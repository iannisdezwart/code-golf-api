import { ServerResponse } from 'http'
import { readFileSync, readdirSync } from 'fs'
import { challenges } from './challenges'
import * as CompileBox from './compile-box-api'
import { addSubmissionToLeaderboard } from './leaderboard'

export interface Submission
{
	name: string
	challenge: string
	lang: string
	code: string
}

interface TestCaseResult
{
	name: string
	state: 'pass' | 'fail' | 'err'
	err?: string
	input: string
	output: string
	expectedOutput?: string
}

interface SubmitResult
{
	state: 'pass' | 'fail'
	results: TestCaseResult[]
}

interface OngoingSubmission
{
	completedTestCases: number
	totalTestCases: number
	result?: SubmitResult
}

const ongoingSubmissions: Map<number, OngoingSubmission> = new Map()
let ongoingSubmissionsCounter = 0

export const submit = async (submission: Submission, res: ServerResponse) =>
{
	console.log(`Submitting ${ submission.name }'s code for ${ submission.challenge }`)
	console.log(`Language: ${ submission.lang }, code:\n${ submission.code }`)

	if (!challenges.includes(submission.challenge))
	{
		throw new Error(`Challenge ${ submission.challenge } does not exist`)
	}

	const { challenge, lang, code } = submission
	const testCaseFiles = readdirSync(`test-cases/${ challenge }`)
		.filter(files => files.endsWith('.in'))

	const id = ongoingSubmissionsCounter++

	ongoingSubmissions.set(id, {
		completedTestCases: 0,
		totalTestCases: testCaseFiles.length
	})

	res.end(id.toString())

	const results: TestCaseResult[] = []
	let state: 'pass' | 'fail' = 'pass'

	for (const testInputFile of testCaseFiles)
	{
		const testCaseName = testInputFile.slice(0, -3)
		const testOutputFile = testInputFile.replace('.in', '.out')
		const input = readFileSync(`test-cases/${ challenge }/${ testInputFile }`, 'utf8')
		const output = readFileSync(`test-cases/${ challenge }/${ testOutputFile }`, 'utf8')

		const result = await CompileBox.run({ lang, code, input })

		const ongoingSubmission = ongoingSubmissions.get(id)
		ongoingSubmission.completedTestCases++

		if (result.err)
		{
			state = 'fail'

			results.push({
				name: testCaseName,
				state: 'err',
				err: result.err,
				input,
				output: result.stdout,
				expectedOutput: output
			})
		}
		else if (result.stdout.trim() != output.trim())
		{
			state = 'fail'

			results.push({
				name: testCaseName,
				state: 'fail',
				input,
				output: result.stdout,
				expectedOutput: output
			})
		}
		else
		{
			results.push({
				name: testCaseName,
				state: 'pass',
				input,
				output: result.stdout
			})
		}
	}

	if (state == 'pass')
	{
		console.log(`${ submission.name }'s code for ${ submission.challenge } passed all test cases`)
		console.log(`Code size: ${ code.length } bytes`)
		addSubmissionToLeaderboard(submission)
	}
	else
	{
		console.log(`${ submission.name }'s code for ${ submission.challenge } failed one or more test cases`)
	}

	console.log('results', results)

	setTimeout(() => {
		ongoingSubmissions.delete(id)
	}, 60000 /* One minute */)

	const ongoingSubmission = ongoingSubmissions.get(id)
	ongoingSubmission.result = { state, results }
}

export const submissionStatus = (id: number) =>
{
	const ongoingSubmission = ongoingSubmissions.get(id)

	if (!ongoingSubmission)
	{
		throw new Error(`Submission ${ id } does not exist`)
	}

	return ongoingSubmission
}
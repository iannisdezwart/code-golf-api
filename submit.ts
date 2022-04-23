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

export const submit = async (submission: Submission): Promise<SubmitResult> =>
{
	console.log(`Submitting ${ submission.name }'s code for ${ submission.challenge }`)
	console.log(`Language: ${ submission.lang }, code:\n${ submission.code }`)

	if (!challenges.includes(submission.challenge))
	{
		throw new Error(`Challenge ${ submission.challenge } does not exist`)
	}

	const { challenge, lang, code } = submission
	const testCaseFiles = readdirSync(`test-cases/${ challenge }`)

	const results: TestCaseResult[] = []
	let state: 'pass' | 'fail' = 'pass'

	for (const testInputFile of testCaseFiles)
	{
		if (!testInputFile.endsWith('.in'))
		{
			continue
		}

		const testCaseName = testInputFile.slice(0, -3)
		const testOutputFile = testInputFile.replace('.in', '.out')
		const input = readFileSync(`test-cases/${ challenge }/${ testInputFile }`, 'utf8')
		const output = readFileSync(`test-cases/${ challenge }/${ testOutputFile }`, 'utf8')

		const result = await CompileBox.run({ lang, code, input })

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

	return { state, results }
}
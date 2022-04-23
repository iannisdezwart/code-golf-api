import { readFileSync, writeFileSync, existsSync } from 'fs'
import { challenges } from './challenges'
import { Submission } from './submit'

interface Leaderboard
{
	[challenge: string]: LangLeaderboard
}

interface LangLeaderboard
{
	[lang: string]: LeaderboardEntry[]
}

interface LeaderboardEntry
{
	name: string
	code: string
}

interface PublicLangLeaderboard
{
	[lang: string]: PublicLeaderboardEntry[]
}

interface PublicLeaderboardEntry
{
	name: string
	codeSize: number
}

if (!existsSync('leaderboard.json'))
{
	writeFileSync('leaderboard.json', '{}')
}

const leaderboard = JSON.parse(readFileSync('leaderboard.json', 'utf8')) as Leaderboard

export const LANGS = [ 'js', 'py', 'c', 'cpp', 'java', 'bash', 'rust', 'php',
	'ruby', 'go', 'scala', 'perl', 'golfscript', 'fish' ]

const writeLeaderboard = () =>
{
	const data = JSON.stringify(leaderboard, null, '\t')
	writeFileSync('leaderboard.json', data)
}

export const addSubmissionToLeaderboard = (submission: Submission) =>
{
	const { challenge, lang, name, code } = submission
	const entry: LeaderboardEntry = { name, code }

	if (!leaderboard[challenge])
	{
		leaderboard[challenge] = {}
	}

	if (!leaderboard[challenge][lang])
	{
		leaderboard[challenge][lang] = []
	}

	leaderboard[challenge][lang].push(entry)
	writeLeaderboard()
}

export const getLeaderboard = (challenge: string) =>
{
	if (!challenges.includes(challenge))
	{
		throw new Error(`Challenge ${ challenge } does not exist`)
	}

	const langLeaderboard: PublicLangLeaderboard = {}

	if (leaderboard[challenge] == null)
	{
		leaderboard[challenge] = {}
	}

	for (const lang of LANGS)
	{
		if (!leaderboard[challenge][lang])
		{
			langLeaderboard[lang] = []
			continue
		}

		langLeaderboard[lang] = leaderboard[challenge][lang]
			.map(entry => ({ name: entry.name, codeSize: entry.code.length }))
			.sort((a, b) => a.codeSize - b.codeSize)
	}

	return langLeaderboard
}
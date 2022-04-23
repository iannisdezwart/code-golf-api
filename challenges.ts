import { readFileSync, writeFileSync, existsSync } from 'fs'

if (!existsSync('leaderboard.json'))
{
	writeFileSync('leaderboard.json', '[]')
}

export const challenges = JSON.parse(readFileSync('challenges.json', 'utf8')) as string[]

export const getChallenges = () =>
{
	return challenges.map(challenge =>
	{
		const description = readFileSync(`descriptions/${ challenge }.html`, 'utf-8')
		return { challenge, description }
	})
}
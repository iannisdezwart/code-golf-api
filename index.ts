import { createAPI, readJSONBody } from '@iannisz/node-api-kit'
import { getChallenges } from './challenges'
import { getLeaderboard, LANGS } from './leaderboard'
import { Submission, submissionStatus, submit } from './submit'

const PORT = +process.argv[2] || 3000
const api = createAPI(PORT)

api.post('/submit', async (req, res) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*')

	const body = await readJSONBody(req)

	if (body == null)
	{
		res.statusCode = 400
		res.end('Invalid JSON')
		return
	}

	const { name, challenge, lang, code } = body

	if (name == null || challenge == null || lang == null || code == null)
	{
		res.statusCode = 400
		res.end('Some of the required fields (name, challenge, lang, code) are missing')
		return
	}

	try
	{
		submit(body as Submission, res)
	}
	catch (err)
	{
		res.statusCode = 400
		res.end(err.message)
	}
})

api.get('/submission-status', async (req, res) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*')

	const url = new URL(req.url, 'http://localhost')
	const id = url.searchParams.get('id')

	if (id == null)
	{
		res.statusCode = 400
		res.end('Some of the required search parameters (id) are missing')
		return
	}

	try
	{
		const status = submissionStatus(+id)
		res.end(JSON.stringify(status))
	}
	catch (err)
	{
		res.statusCode = 400
		res.end(err.message)
	}
})

api.get('/leaderboard', async (req, res) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*')

	const url = new URL(req.url, 'http://localhost')
	const challenge = url.searchParams.get('challenge')

	if (challenge == null)
	{
		res.statusCode = 400
		res.end('Some of the required search parameters (challenge) are missing')
		return
	}

	try
	{
		const result = getLeaderboard(challenge)
		res.end(JSON.stringify(result))
	}
	catch (err)
	{
		res.statusCode = 400
		res.end(err.message)
		return
	}
})

api.get('/challenges', async (_req, res) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*')

	const challenges = getChallenges()
	res.end(JSON.stringify(challenges))
})

api.get('/languages', async (_req, res) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.end(JSON.stringify(LANGS))
})
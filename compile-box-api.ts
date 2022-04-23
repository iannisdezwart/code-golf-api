import { request } from 'http'
import { settings } from './settings'

export interface RunRequest
{
	lang: string
	code: string
	input: string
}

export interface RunResult
{
	err?: string
	stdout: string
	stderr: string
}


export const run = (runRequest: RunRequest) =>
	new Promise<RunResult>(resolve =>
{
	const req = request(settings.compileBoxApiUrl + '/run', { method: 'POST' }, res =>
	{
		let body = ''

		res.on('data', chunk => body += chunk)
		res.on('end', () =>
		{
			const result = JSON.parse(body) as RunResult
			resolve(result)
		})
	})

	req.end(JSON.stringify(runRequest))
})
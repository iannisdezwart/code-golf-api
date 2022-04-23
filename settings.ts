import { readFileSync, existsSync, writeFileSync } from 'fs'

interface Settings
{
	compileBoxApiUrl: string
}

if (!existsSync('settings.json'))
{
	writeFileSync('settings.json', '{}')
}

export const settings = JSON.parse(readFileSync('settings.json', 'utf8')) as Settings
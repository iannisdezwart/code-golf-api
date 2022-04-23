# Code Golf API

This is a simple code golf API that allows people to easily self-host
code golf challenges. Users can view available challenges and submit code
for them. If their code passes all test cases, they will be placed on the
leaderboard.


## Installation

Make sure you have NPM installed.
Depends on [https://github.com/iannisdezwart/compile-box](compile-box).
Open the `settings.json` file and edit `compileBoxApiUrl` to the url of your
compile-box installation.

Then run:

```sh
npm i && npm start <port-number>
```

That's it ✨!


## Usage

Add challenge names to the `challenges.json` file.
Example:

```json
[ "challenge-1", "challenge-2" ]
```

Follow the `README.md` files in the `descriptions` and `test-cases` directories.


## API Reference


### GET `/challenges`

Returns a list of all available challenges.

Example output:

```json
[
	{
		"challenge": "challenge-1",
		"description": "..."
	},
	{
		"challenge": "challenge-2",
		"description": "..."
	}
]
```


### GET `/leaderboard?challenge=<challenge-name>`

Returns the leaderboard for a given challenge.

Example output:

```json
{
	"c": [
		{
			"name": "John",
			"codeSize": 123
		},
		{
			"name": "Jane",
			"codeSize": 456
		}
	],
	"py": [
		{
			"name": "Jack",
			"codeSize": 321
		}
	],
	...
}
```


### POST `/submit`

A user can submit their code for a challenge using this endpoint.
Their code will be tested, and if it passes all test cases,
they will be placed on the leaderboard.

Example input:

```json
{
	"name": "John",
	"challenge": "add-two-numbers",
	"lang": "js",
	"code": "..."
}
```

Example pass output:

```json
{
	"state": "pass",
	"results": [
		{
			"name": "one-plus-two",
			"state": "pass",
			"input": "1 2",
			"output": "3\n"
		},
		{
			"name": "three-plus-five",
			"state": "pass",
			"input": "3 5",
			"output": "8\n"
		}
	]
}
```

Example fail output:

```json
{
	"state": "fail",
	"results": [
		{
			"name": "one-plus-two",
			"state": "pass",
			"input": "1 2",
			"output": "3\n"
		},
		{
			"name": "three-plus-five",
			"state": "fail",
			"input": "3 5",
			"output": "2\n",
			"expectedOutput": "8"
		}
	]
}
```

Example error output:

```json
{
	"state": "fail",
	"results": [
		{
			"name": "one-plus-two",
			"state": "err",
			"err": "...",
			"input": "1 2",
			"output": "<stderr>",
			"expectedOutput": "8"
		}
	]
}
```
In this directory you place the test cases for each challenge.
Each challenge should have a directory with the same name as the challenge.
In each challenge directory you place files that follow the naming convention
`<test-case-name>.in` and `<test-case-name>.out`.

An example directory structure:
```
test-cases
	|- challenge-1
		|- test-case-1.in
		|- test-case-1.out
		|- test-case-2.in
		|- test-case-2.out
	|- challenge-2
		|- small-test-case.in
		|- small-test-case.out
		|- large-test-case.in
		|- large-test-case.out
```

Example test case files look like this:

`test-case.in`:
```
1 2 3 4 5
```

`test-case.out`:
```
5 4 3 2 1
```
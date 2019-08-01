'use strict'

// npm
const meow = require('meow')

// self
const run = require('.')

const cli = meow(`
	Usage
	  $ cli <dir>

	Options
	  --gap, -g  Maximum gap in minutes (defaults to 120; 2h)
`, { flags: { gap: { alias: 'g' } } })

run({dir: cli.input[0], max: cli.flags.gap}).catch(console.error)

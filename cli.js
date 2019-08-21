#!/usr/bin/env node

"use strict"

// npm
const meow = require("meow")
const updateNotifier = require("update-notifier")

// self
const run = require(".")

const cli = meow(
  `
	Usage
	  $ gtc <dir> Defaults to current directory

	Options
		--gap, -g  	Maximum gap in minutes (defaults to 120; 2h)
		--version		Output version
		--help			This help
`,
  { flags: { gap: { alias: "g" } } }
)

const ld = (ts) => new Date(ts * 1000).toDateString()

updateNotifier(cli).notify()
run({ dir: cli.input[0], max: cli.flags.gap })
  .then(({ from, to, stats, dir }) => {
    console.log("Directory:", dir)
    console.log(`From ${ld(from)} until ${ld(to)}:`)
    console.log(stats)
  })
  .catch((e) =>
    console.error(e.name === "ResolveRefError" ? "No .git directory found." : e)
  )

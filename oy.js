'use strict'

// core
const fs = require('fs')

// npm
const git = require('isomorphic-git')

git.plugins.set('fs', fs)

git.log({ dir: '.', depth666: 5, ref: 'master' })
// git.log()
  .then(console.log)
  .catch(console.error)


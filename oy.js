'use strict'

// core
const fs = require('fs')

// npm
const git = require('isomorphic-git')

git.plugins.set('fs', fs)

const doit = async (dir = '.') => {
  const commits =  await git.log({ dir })
  return commits
    .map((x) => {
      return {
        message: x.message,
        ...x.author
      }
    })
}

doit()
  .then(console.log)
  .catch(console.error)


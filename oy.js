'use strict'

// core
const fs = require('fs')

// npm
const git = require('isomorphic-git')

const clumpSize = 15 * 60

git.plugins.set('fs', fs)

const stats = (x) => {
  console.log('stats', x)
  /*
  const tot = x.reduce((a, b) => a + b, 0) // / 3600
  const avg = tot / x.length
  console.log(x)
  console.log(x.length, tot, avg)
  */
}


/*

13:45:57
13:46:29
14:03:55
14:04:21



*/


const red = (a, b) => {
  const el = b.author.timestamp - a.author.timestamp
  console.log('a', a.author.timestamp)
  console.log('b', b.author.timestamp)
  if (el > clumpSize) {
    console.log('larger', el)
    // return b
  } else {
    console.log('smaller', el)
    // return a
  }
  // console.log('a', a)
  // console.log('b', b)
  console.log()
  // return a
  return b
}

const doit = async (dir = '.') => {
  const commits = await git.log({ dir })
  return commits.reverse().reduce(red)
}

const doit3 = async (dir = '.') => {
  const clumps = []
  let begin
  let end

  for (const commit of await git.log({ dir })) {
    if (end) {
      // begin = commit
      if (end.author.timestamp - commit.author.timestamp > clumpSize) {

      } else {

      }
    } else {
      end = commit
    }
    console.log(commit)
  }
  return clumps
}

const doit2 = async (dir = '.') => {
  const clumps = []
  const commits = await git.log({ dir })
  let last = commits[commits.length - 1].author.timestamp
  commits
    .reverse()
    .forEach(({ author: { timestamp } }, i) => {
      const el = timestamp - last
      console.log('EL', i, el)
      if ((clumps.length === 0) || (el > clumpSize)) {
        console.log()
        console.log('NEW', i)
        clumps.push(0)
        last = timestamp
      } else {
        console.log('ADD', i)
        clumps[clumps.length - 1] += el
      }
      // last = timestamp
    })

  // console.log(clumps.length, clumps.reduce((a, b) => a + b, 0) / (24 * 3600))
  return clumps
}

// doit()
doit('/home/millette/eqcap/')
  .then(stats)
  .catch(console.error)


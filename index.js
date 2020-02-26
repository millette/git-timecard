"use strict"

// core
const fs = require("fs")
const path = require("path")

// npm
const git = require("isomorphic-git")

const doit0 = (commits) =>
  commits.reduce((a, ts) => {
    const el = a.length && ts - a[a.length - 1].ts
    a.push({ ts, el })
    return a
  }, [])

const doit1 = (max, els) => {
  const p2 = [[]]
  els.forEach((a) => {
    if (a.el > max) p2.push([])
    const p2b = p2[p2.length - 1]
    const l2 = p2b.length
    if (!l2) a.el = 0
    p2b.push(a)
  })
  return p2
}

const doit2 = (max, p2, from, to, dir) => {
  const x = []
  let extras = 0
  p2.forEach((p) => {
    const n = p.length
    if (n > 1) x.push({ el: p[n - 1].ts - p[0].ts, n })
    else ++extras
  })
  if (extras) x.push({ el: (extras * max) / 4, n: extras })
  return { x, from, to, dir }
}

const doit = (dir, max, commits) => {
  let from
  let to
  if (commits.length) {
    from = commits[0]
    to = commits[commits.length - 1]
  }
  return doit2(max, doit1(max, doit0(commits)), from, to, dir)
}

const vava = async (dir, max) => {
  dir = path.resolve(dir)
  try {
    const commits = await git.log({ fs, dir })
    return doit(
      dir,
      max,
      commits.reverse().map(
        ({
          commit: {
            author: { timestamp },
          },
        }) => timestamp
      )
    )
  } catch (e) {
    if (e.name === "ResolveRefError") {
      const d2 = path.resolve(dir, "..")
      if (dir === d2) throw e
      return vava(d2, max)
    }
    throw e
  }
}

const stats = ({ x, from, to, dir }) => {
  const s = x.reduce(
    (a, b) => {
      return {
        el: a.el + b.el,
        n: a.n + b.n,
      }
    },
    { el: 0, n: 0 }
  )
  const mc = Math.round(s.el / (s.n * 60))
  return {
    dir,
    from,
    to,
    stats: `${x.length} spurts; ${Math.round(s.el / 360) / 10}h total; ${
      s.n
    } commits; ${Math.round(s.n / x.length)} commits/spurt; ${mc} min./commit.`,
  }
}

module.exports = (opts = {}) =>
  vava(opts.dir || ".", (opts.max || 120) * 60).then(stats)

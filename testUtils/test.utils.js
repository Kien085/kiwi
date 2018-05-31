import { Chromeless } from 'chromeless'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import * as fs from 'fs'

export const setup = () => {
  expect.extend({ toMatchImageSnapshot }) 
  jest.setTimeout(100000)
  // return new Chromeless(global.config.chromeless)
  return new Chromeless({})
}

export const teardown = async chromeless => {
  try {
    await chromeless.end()
  } catch (err) {
    console.log(err)
  }
}

export const getFile = path => Promise.resolve(fs.readFileSync(path))
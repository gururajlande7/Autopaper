import 'server-only'
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const KEY_LENGTH = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString(
    'base64url',
  )}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, encodedSalt, encodedHash] = storedHash.split('$')

  if (algorithm !== 'scrypt' || !encodedSalt || !encodedHash) {
    return false
  }

  const salt = Buffer.from(encodedSalt, 'base64url')
  const expectedHash = Buffer.from(encodedHash, 'base64url')
  const actualHash = (await scrypt(
    password,
    salt,
    expectedHash.length,
  )) as Buffer

  return (
    actualHash.length === expectedHash.length &&
    timingSafeEqual(actualHash, expectedHash)
  )
}

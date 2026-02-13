import { describe, it, expect, beforeEach } from 'vitest'
import { randomSalt, hashWithSalt } from './crypto'

describe('Crypto Utilities', () => {
  describe('randomSalt', () => {
    it('generates a random salt', async () => {
      const salt = await randomSalt(16)
      expect(salt).toBeDefined()
      expect(typeof salt).toBe('string')
    })

    it('generates different salts each time', async () => {
      const salt1 = await randomSalt(16)
      const salt2 = await randomSalt(16)
      expect(salt1).not.toBe(salt2)
    })

    it('generates salt of correct length', async () => {
      const salt = await randomSalt(32)
      expect(salt.length).toBeGreaterThan(0)
    })

    it('generates valid hex string', async () => {
      const salt = await randomSalt(16)
      const hexRegex = /^[a-f0-9]*$/i
      expect(hexRegex.test(salt)).toBe(true)
    })
  })

  describe('hashWithSalt', () => {
    it('hashes a password with salt', async () => {
      const password = 'mySecurePassword123'
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('produces same hash for same password and salt', async () => {
      const password = 'mySecurePassword123'
      const salt = await randomSalt(16)
      
      const hash1 = await hashWithSalt(password, salt)
      const hash2 = await hashWithSalt(password, salt)
      
      expect(hash1).toBe(hash2)
    })

    it('produces different hash for different passwords', async () => {
      const salt = await randomSalt(16)
      const hash1 = await hashWithSalt('password1', salt)
      const hash2 = await hashWithSalt('password2', salt)
      
      expect(hash1).not.toBe(hash2)
    })

    it('produces different hash for different salts', async () => {
      const password = 'mySecurePassword123'
      const salt1 = await randomSalt(16)
      const salt2 = await randomSalt(16)
      
      const hash1 = await hashWithSalt(password, salt1)
      const hash2 = await hashWithSalt(password, salt2)
      
      expect(hash1).not.toBe(hash2)
    })

    it('hashes empty password', async () => {
      const password = ''
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('hashes long password', async () => {
      const password = 'a'.repeat(256)
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('handles special characters in password', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('handles unicode characters in password', async () => {
      const password = '密码🔐こんにちは'
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })
  })

  describe('Password hashing workflow', () => {
    it('completes full authentication workflow', async () => {
      // Signup phase
      const password = 'MySecurePassword123!'
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)

      // Simulate stored user data
      const user = { salt, hash }

      // Login phase
      const loginPassword = 'MySecurePassword123!'
      const loginHash = await hashWithSalt(loginPassword, user.salt)

      // Verify
      expect(loginHash).toBe(user.hash)
    })

    it('fails with wrong password', async () => {
      const password = 'MySecurePassword123!'
      const salt = await randomSalt(16)
      const hash = await hashWithSalt(password, salt)

      const wrongPassword = 'WrongPassword123!'
      const wrongHash = await hashWithSalt(wrongPassword, salt)

      expect(wrongHash).not.toBe(hash)
    })
  })
})

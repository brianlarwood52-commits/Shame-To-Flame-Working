// Shared in-memory store for 2FA codes
// In production, use Redis or a database instead

interface TwoFactorCode {
  code: string
  expiresAt: number
}

const twoFactorCodes = new Map<string, TwoFactorCode>()

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [email, data] of twoFactorCodes.entries()) {
    if (data.expiresAt < now) {
      twoFactorCodes.delete(email)
    }
  }
}, 5 * 60 * 1000)

export function store2FACode(email: string, code: string, expiresInMs: number = 10 * 60 * 1000) {
  twoFactorCodes.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + expiresInMs,
  })
}

export function get2FACode(email: string): TwoFactorCode | undefined {
  return twoFactorCodes.get(email.toLowerCase())
}

export function delete2FACode(email: string) {
  twoFactorCodes.delete(email.toLowerCase())
}

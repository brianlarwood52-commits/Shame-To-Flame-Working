function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin)
}

let cachedKey: CryptoKey | null = null

async function getAesKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey

  const keyB64 = Deno.env.get('MESSAGE_ENCRYPTION_KEY_B64')
  if (!keyB64) {
    throw new Error('Missing MESSAGE_ENCRYPTION_KEY_B64 (expected 32-byte key, base64)')
  }

  const raw = base64ToBytes(keyB64)
  if (raw.byteLength !== 32) {
    throw new Error(`MESSAGE_ENCRYPTION_KEY_B64 must decode to 32 bytes; got ${raw.byteLength}`)
  }

  cachedKey = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
  return cachedKey
}

export async function encryptText(plaintext: string): Promise<{ ciphertext_b64: string; iv_b64: string }> {
  const key = await getAesKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  return {
    ciphertext_b64: bytesToBase64(new Uint8Array(ciphertext)),
    iv_b64: bytesToBase64(iv),
  }
}

// Optional: used by admin tooling later.
export async function decryptText(ciphertext_b64: string, iv_b64: string): Promise<string> {
  const key = await getAesKey()
  const iv = base64ToBytes(iv_b64)
  const data = base64ToBytes(ciphertext_b64)
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(plaintext)
}

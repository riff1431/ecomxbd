import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const ENCODING: BufferEncoding = "hex";

function getEncryptionKey(): Buffer {
  const key = process.env.SETTINGS_ENCRYPTION_KEY;
  if (!key) {
    // Fallback: derive a key from the service role key (NOT ideal for production)
    const fallback = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-key-change-me";
    return crypto.createHash("sha256").update(fallback).digest();
  }
  // Key must be 32 bytes (64 hex chars) for AES-256
  if (key.length === 64) {
    return Buffer.from(key, "hex");
  }
  return crypto.createHash("sha256").update(key).digest();
}

/**
 * Encrypt a plaintext value using AES-256-GCM.
 * Returns a hex string: iv + authTag + ciphertext
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag();

  // Format: iv(32hex) + tag(32hex) + ciphertext
  return iv.toString(ENCODING) + authTag.toString(ENCODING) + encrypted;
}

/**
 * Decrypt a hex string encrypted with encrypt().
 */
export function decrypt(encryptedHex: string): string {
  const key = getEncryptionKey();

  const iv = Buffer.from(encryptedHex.slice(0, IV_LENGTH * 2), ENCODING);
  const authTag = Buffer.from(
    encryptedHex.slice(IV_LENGTH * 2, IV_LENGTH * 2 + TAG_LENGTH * 2),
    ENCODING
  );
  const ciphertext = encryptedHex.slice(IV_LENGTH * 2 + TAG_LENGTH * 2);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, ENCODING, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/** Mask a secret value for display */
export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "••••••••";
  return "••••••••" + value.slice(-4);
}

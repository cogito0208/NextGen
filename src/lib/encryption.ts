import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const HASH_SALT = process.env.HASH_SALT || 'default-salt-change-in-production';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set');
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be 64 hexadecimal characters (32 bytes)');
}

/**
 * Encrypts text using AES-256-CBC with a random IV
 * @param text - Plain text to encrypt
 * @returns Object containing encrypted text (hex) and IV (hex)
 */
export function encrypt(text: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
  };
}

/**
 * Decrypts text using AES-256-CBC
 * @param encrypted - Encrypted text (hex)
 * @param ivHex - Initialization vector (hex)
 * @returns Decrypted plain text
 */
export function decrypt(encrypted: string, ivHex: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Validates Korean resident ID format (YYMMDD-XXXXXXX)
 * @param residentId - Resident ID to validate
 * @returns true if valid format
 */
export function validateResidentId(residentId: string): boolean {
  // Format: YYMMDD-XXXXXXX (13 characters total with hyphen)
  const regex = /^\d{6}-\d{7}$/;

  if (!regex.test(residentId)) {
    return false;
  }

  const [datePart, serialPart] = residentId.split('-');

  // Validate date part (YYMMDD)
  const year = parseInt(datePart.substring(0, 2), 10);
  const month = parseInt(datePart.substring(2, 4), 10);
  const day = parseInt(datePart.substring(4, 6), 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Validate first digit of serial part (gender/century indicator)
  const genderDigit = parseInt(serialPart[0], 10);
  if (genderDigit < 1 || genderDigit > 8) return false;

  return true;
}

/**
 * Creates a hash of the resident ID for duplicate checking
 * @param residentId - Resident ID to hash
 * @returns SHA-256 hash (hex)
 */
export function hashResidentId(residentId: string): string {
  return crypto
    .createHash('sha256')
    .update(residentId + HASH_SALT)
    .digest('hex');
}

/**
 * Securely compares two strings in constant time to prevent timing attacks
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

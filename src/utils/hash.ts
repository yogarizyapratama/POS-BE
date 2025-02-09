import * as crypto from 'crypto';

const SALT_LENGTH = 16;
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;
const AES_ALGORITHM = 'aes-256-gcm';
const SECURE_KEY = process.env.SECURE_KEY;

if (!SECURE_KEY) {
    throw new Error('SECURE_KEY is not defined in environment variables.');
}

function generateKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(SECURE_KEY!, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

export function encryptResponse(response: any): string {
    const responseString = JSON.stringify(response);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = generateKey(salt);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);
    let encrypted = cipher.update(responseString, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptResponse(encryptedResponse: string): any {
    const [saltHex, ivHex, authTagHex, encryptedText] = encryptedResponse.split(':');
    if (!saltHex || !ivHex || !authTagHex || !encryptedText) {
        throw new Error('Invalid encrypted response format.');
    }

    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = generateKey(salt);

    const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

export function encryptResponseJSON(response: Record<string, any>): Record<string, any> {
    const encryptedResponse: Record<string, any> = {};

    for (const key in response) {
        if (typeof response[key] === 'string' || typeof response[key] === 'number' || typeof response[key] === 'boolean') {
            encryptedResponse[key] = encryptResponse(String(response[key]));
        } else if (typeof response[key] === 'object' && response[key] !== null) {
            encryptedResponse[key] = encryptResponse(JSON.stringify(response[key]));
        } else {
            encryptedResponse[key] = response[key];
        }
    }

    return encryptedResponse;
}

export function decryptResponseJSON(encryptedResponse: Record<string, any>): Record<string, any> {
    const decryptedResponse: Record<string, any> = {};

    for (const key in encryptedResponse) {
        if (typeof encryptedResponse[key] === 'string' && encryptedResponse[key].includes(':')) {
            try {
                decryptedResponse[key] = decryptResponse(encryptedResponse[key]);
            } catch (error:unknown) {
                if (error instanceof Error) {
                    throw new Error(`Failed to decrypt key "${key}": ${error.message}`);
                }
                throw new Error(`Failed to decrypt key "${key}": Unknown error`);
            }
        } else {
            decryptedResponse[key] = encryptedResponse[key];
        }
    }

    return decryptedResponse;
}

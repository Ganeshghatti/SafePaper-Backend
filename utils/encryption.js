const crypto = require('crypto');
const sss = require('shamirs-secret-sharing');

const ALGORITHM = 'aes-256-ecb';
const KEY_LENGTH = 32;

class EncryptionService {
  static generateKey() {
    return crypto.randomBytes(KEY_LENGTH);
  }

  static encrypt(data, key) {
    try {
      if (key.length !== KEY_LENGTH) {
        throw new Error('Invalid key length for encryption');
      }
      const cipher = crypto.createCipheriv(ALGORITHM, key, null);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      console.log("encrypted data", encrypted)
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  static decrypt(encryptedData, key) {
    try {
      if (key.length !== KEY_LENGTH) {
        console.log(`Adjusting key length from ${key.length} to ${KEY_LENGTH} bytes`);
        const adjustedKey = Buffer.alloc(KEY_LENGTH);
        key.copy(adjustedKey, 0, 0, Math.min(key.length, KEY_LENGTH));
        key = adjustedKey;
      }

      const decipher = crypto.createDecipheriv(ALGORITHM, key, null);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.log('Decryption error:', error);
      throw error;
    }
  }

  static generateKeyShares(key, numShares, threshold) {
    return sss.split(key, { shares: numShares, threshold });
  }

  static combineKeyShares(shares) {
    try {
      // Use all valid shares
      const validShares = shares.filter(share => share !== null);
      console.log('Using shares:', validShares);
      
      // Combine shares
      const combinedKey = sss.combine(validShares);
      console.log('Raw combined key length:', combinedKey.length);
      
      return combinedKey;
    } catch (error) {
      console.error('Error combining shares:', error);
      throw error;
    }
  }
}
module.exports = EncryptionService;

const crypto = require('crypto');
const sss = require('shamirs-secret-sharing');

const ALGORITHM = 'aes-256-cbc';

class EncryptionService {
  static generateKey() {
    return crypto.randomBytes(32);
  }

  static encrypt(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedData, key) {
    const [ivHex, encryptedText] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static generateKeyShares(key, numShares, threshold) {
    return sss.split(key, { shares: numShares, threshold });
  }

  static combineKeyShares(shares) {
    return sss.combine(shares);
  }
}

module.exports = EncryptionService;

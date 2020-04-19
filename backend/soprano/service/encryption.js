const kms = require('@google-cloud/kms');

// For authentication purposes
const CRYPT_PROJECT = 'organic-primer-270918';
const CRYPT_KEYRING = 'Soprano'; // Name of the crypto key's key ring
const CRYPTO_KEY = 'Session-Key'; // Name of the crypto key
const CRYPTO_LOCATION = 'global'; // Location of the key
const OPTIONS = {
  keyFilename: './backend/soprano/keys_service_account.json',
  projectId: CRYPT_PROJECT,
};

const client = new kms.KeyManagementServiceClient(OPTIONS);
const name = client.cryptoKeyPath(
  CRYPT_PROJECT,
  CRYPTO_LOCATION,
  CRYPT_KEYRING,
  CRYPTO_KEY
);

class EncryptionService
{
  /**
   * Encrypts original string using the KMS key
   * @param {string} original
   */
  static async Encrypt(text)
  {
    // Transform the string into a buffer and encrypt it
    const plaintext = Buffer.from(text);
    const [result] = await client.encrypt({ name, plaintext });
    return result.ciphertext.toString('base64');
  }

  /**
   * Decrypts encoded string using the KMS key
   * @param {string} encoded
   * @returns {string} the decrypted string
   */
  static async Decrypt(encoded)
  {
    // Transform the string into a buffer and encrypt it
    const ciphertext = Buffer.from(encoded, 'base64');
    const [result] = await client.decrypt({ name, ciphertext });
    return result.plaintext.toString();
  }

  /**
   * Encrypts an array of strings
   * @param {string[]} items
   * @returns {string[]} array of encrypted strings
   */
  static async EncryptMany(items)
  {
    return Promise.all(items.map(this.Encrypt));
  }

  /**
   * Decrypts an array of strings
   * @param {string[]} items
   * @returns {string[]} array of encrypted strings
   */
  static async DecryptMany(items)
  {
    return Promise.all(items.map(this.Decrypt));
  }

  /**
   * Encrypts all of the strings in an object (shallow)
   * @param {Object} obj
   */
  static async EncryptObject(obj)
  {
    const KVPs = Object
      .entries(obj)
      .filter(kvp => typeof(kvp[1]) === 'string');

    const list = KVPs.map(kvp => kvp[1]);
    const encrypted = await EncryptionService.EncryptMany(list);

    encrypted.forEach((enc, i) => obj[KVPs[i][0]] = enc);
    return obj;
  }

  /**
   * Encrypts all of the strings in an object (shallow)
   * @param {Object} obj
   */
  static async DecryptObject(obj)
  {
    const KVPs = Object
      .entries(obj)
      .filter(kvp => typeof(kvp[1]) === 'string');

    const toDecrypt = KVPs.map(kvp => kvp[1]);
    const decrypted = await EncryptionService.DecryptMany(toDecrypt);

    decrypted.forEach((dec, i) => obj[KVPs[i][0]] = dec);
    return obj;
  }
}

module.exports = EncryptionService;
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

module.exports = class EncryptionService
{
  /**
   * Encrypts original string using the KMS key
   * @param {string} original
   */
  static async Encrypt(original)
  {
    const client = new kms.KeyManagementServiceClient(OPTIONS);

    const name = client.cryptoKeyPath(
      CRYPT_PROJECT,
      CRYPTO_LOCATION,
      CRYPT_KEYRING,
      CRYPTO_KEY
    );

    //Transform the string into a buffer and encrypt it
    const plaintext = Buffer.from(original);
    const [result] = await client.encrypt({ name, plaintext });
    return result.ciphertext.toString('base64');
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
   * Decrypts encoded string using the KMS key
   * @param {string} encoded
   * @returns {string} the decrypted string
   */
  static async Decrypt(encoded)
  {
    const client = new kms.KeyManagementServiceClient(OPTIONS);

    const name = client.cryptoKeyPath(
      CRYPT_PROJECT,
      CRYPTO_LOCATION,
      CRYPT_KEYRING,
      CRYPTO_KEY
    );

    //Transform the string into a buffer and encrypt it
    const ciphertext = Buffer.from(encoded, 'base64');

    const [result] = await client.decrypt({ name, ciphertext });
    return result.plaintext.toString();
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
};

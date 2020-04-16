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

class EncryptionInterface
{
  /**
   * @typedef {Object} AuthCredentials
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   */

  /**
   * Encrypts original string using the KMS key
   * @param {string} original
   */
  Encrypt(original) 
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
    return client.encrypt({ name, plaintext })
      .then(([result]) => 
        result.ciphertext.toString('base64'));
  }

  /**
   * Decrypts encoded string using the KMS key
   * @param {string} encoded
   */
  Decrypt(encoded) 
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

    return client.decrypt({ name, ciphertext})
      .then(
        ([result]) => 
          result.plaintext.toString());  
  }

  /**
   * Encrypts user credentials using google KMS
   * @param {AuthCredentials} credentials
   */
  EncryptCredentials(credentials)
  {
    const encryptAuth = this.Encrypt(credentials.authToken);
    const encryptRefresh = this.Encrypt(credentials.refreshToken);
    return Promise.all([encryptAuth, encryptRefresh]).then(([authToken, refreshToken]) =>
      ({authToken, refreshToken}));
  }

  /**
   * Decrypts encoded credentials using google KMS
   * @param {AuthCredentials} credentials
   */
  DecryptCredentials(credentials)
  {
    const decryptAuth = this.Decrypt(credentials.authToken);
    const decryptRefresh = this.Decrypt(credentials.refreshToken);
    return Promise.all([decryptAuth, decryptRefresh]).then(([authToken, refreshToken]) =>
      ({authToken, refreshToken}));
  }
}
/**
 * @returns {EncryptionInterface}
 */
module.exports = () => new EncryptionInterface();
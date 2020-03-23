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
    return new Promise(
      (resolve) =>
      {
        client.encrypt({ name, plaintext })
          .then(
            ([result]) => 
            {
              resolve(result.ciphertext.toString('base64'));
            });
      });
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

    return new Promise(
      (resolve) =>
      {
        client.decrypt({ name, ciphertext})
          .then(
            ([result]) => 
            {
              resolve(result.plaintext.toString());
            });
      });
  }

  /**
   * Encrypts user credentials using google KMS
   * @param {AuthCredentials} credentials
   */
  EncryptCredentials(credentials)
  {
    var _encryptedAuth, _encryptedRefresh; 

    return new Promise(
      (resolve) =>
      {
        this.Encrypt(credentials.authToken)
          .then(
            (encryptedAuth ) => 
            {
              _encryptedAuth = encryptedAuth;
            }).then(
            () => this.Encrypt(credentials.refreshToken)
          ).then(
            (encryptedRefresh) =>
            {
              _encryptedRefresh = encryptedRefresh;
            }).then(
            ()=>
            {
              resolve({authToken: _encryptedAuth, refreshToken: _encryptedRefresh});
            });
      });
  }

  /**
   * Decrypts encoded credentials using google KMS
   * @param {AuthCredentials} credentials
   */
  DecryptCredentials(credentials)
  {
    var _decryptedAuth, _decryptedRefresh; 

    return new Promise(
      (resolve) =>
      {
        this.Decrypt(credentials.authToken)
          .then(
            (decryptedAuth ) => 
            {
              _decryptedAuth = decryptedAuth;
            }).then(
            () => this.Decrypt(credentials.refreshToken)
          ).then(
            (decryptedRefresh) =>
            {
              _decryptedRefresh = decryptedRefresh;
            }).then(
            ()=>
            {
              resolve({authToken: _decryptedAuth, refreshToken: _decryptedRefresh});
            });
      });
  }
}
/**
 * @returns {EncryptionInterface}
 */
module.exports = () => new EncryptionInterface();
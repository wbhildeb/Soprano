const expect = require('chai').expect;
const EncryptionService = require('../../service/encryption');


describe('Encryption Service', () =>
{
  it('should encrypt a string', async () =>
  {
    const original = 'this is the original';
    const encrypted = await EncryptionService.Encrypt(original);
    expect(encrypted).to.be.a('string');
    expect(encrypted).to.not.equal(original);
  });

  it('should decrypt a string', async () =>
  {
    const original = 'this is the original';
    const encrypted = await EncryptionService.Encrypt(original);
    const decrypted = await EncryptionService.Decrypt(encrypted);
    expect(decrypted).to.be.a('string');
    expect(decrypted).to.equal(original);
  });

  it('should encrypt an array of string', async () =>
  {
    const original = ['this is an array', 'of many', 'strings to ', 'be encypted'];
    const encrypted = await EncryptionService.EncryptMany(original);
    expect(encrypted).to.be.an('array');
    encrypted.forEach((val, i) =>
      expect(val).to.not.equal(original[i])
    );
  });

  it('should decrypt an array of string', async () =>
  {
    const original = ['this is an array', 'of many', 'strings to ', 'be encypted'];
    const encrypted = await EncryptionService.EncryptMany(original);
    const decrypted = await EncryptionService.DecryptMany(encrypted);
    expect(decrypted).to.be.an('array');
    expect(decrypted).to.deep.equal(original);
  });
});


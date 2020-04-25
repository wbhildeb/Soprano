const expect = require('chai').expect;
const EncryptionService = require('../../service/encryption');


describe('Encrypt() and Decrypt()', () =>
{
  const original = 'this is the original string';
  var encrypted, decrypted;

  before(async () =>
  {
    encrypted = await EncryptionService.Encrypt(original);
    decrypted = await EncryptionService.Decrypt(encrypted);
  });

  it('should encrypt a string', async () =>
  {
    expect(encrypted).to.be.a('string');
    expect(encrypted).to.not.equal(original);
  });

  it('should decrypt a string', async () =>
  {
    expect(decrypted).to.be.a('string');
    expect(decrypted).to.equal(original);
  });
});


describe('EncryptMany() and DecryptMany()', () =>
{
  const original = [
    'this is a 5',
    'array of strings',
    'that we are',
    '',
    '5',
    'going',
    'to encrypt'
  ];

  var encrypted, decrypted;

  before(async () =>
  {
    encrypted = await EncryptionService.EncryptMany(original);
    decrypted = await EncryptionService.DecryptMany(encrypted);
  });


  it('should encrypt an array of strings', async () =>
  {
    expect(encrypted).to.be.an('array').with.length(original.length);

    encrypted.forEach((val, i) =>
      expect(val).to.not.equal(original[i])
    );
  });

  it('should decrypt an array of strings', async () =>
  {
    expect(decrypted).to.be.an('array').of.length(original.length);
    expect(decrypted).to.deep.equal(original);
  });
});


describe('EncryptMany() and DecryptMany()', () =>
{
  const original = {
    key: 'value',
    salt: 'pepper',
    mambo: 5,
    four_twenty: 6.9,
    deep: {
      bonnie: 'clyde',
      deeper: {
        apple: 'bees',
        maxi: 'mum'
      }
    },
    bread: 'butter'
  };

  var encrypted, decrypted;

  before(async () =>
  {
    encrypted = Object.assign({}, original);
    await EncryptionService.EncryptObject(encrypted);

    decrypted = Object.assign({}, encrypted);
    await EncryptionService.DecryptObject(decrypted);
  });


  it('should not change the keys', async () =>
  {
    Object
      .keys(original)
      .forEach(key => expect(encrypted).to.haveOwnProperty(key));
  });

  it('should change all (shallow) string values', async () =>
  {
    Object
      .entries(original)
      .forEach(([key, value]) =>
      {
        if (typeof(value) === 'string')
        {
          expect(encrypted[key]).to.not.equal(value);
        }
      });
  });

  it('should not change non-string values', async () =>
  {
    Object
      .entries(original)
      .forEach(([key, value]) =>
      {
        if (typeof(value) !== 'string')
        {
          expect(encrypted[key]).to.equal(value);
        }
      });
  });

  it('should decrypt the object\'s strings properly', async () =>
  {
    Object
      .entries(original)
      .forEach(([key, value]) =>
        expect(decrypted[key]).to.equal(value)
      );
  });
});

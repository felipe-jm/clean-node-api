import { rejects } from 'assert';
import { Encrypter } from '../../protocols/encrypter';
import DbCreateAccount from './db-create-account';

interface MakeDbCreateAccountReturn {
  dbCreateAccount: DbCreateAccount;
  encrypterMock: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterMock implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncrypterMock();
};

const makeDbCreateAccount = (): MakeDbCreateAccountReturn => {
  const encrypterMock = makeEncrypter();
  const dbCreateAccount = new DbCreateAccount(encrypterMock);
  return {
    dbCreateAccount,
    encrypterMock,
  };
};

describe('DbCreateAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { dbCreateAccount, encrypterMock } = makeDbCreateAccount();
    const encryptSpy = jest.spyOn(encrypterMock, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await dbCreateAccount.create(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Encrypter throws', async () => {
    const { dbCreateAccount, encrypterMock } = makeDbCreateAccount();
    jest
      .spyOn(encrypterMock, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promise = dbCreateAccount.create(accountData);
    await expect(promise).rejects.toThrow();
  });
});

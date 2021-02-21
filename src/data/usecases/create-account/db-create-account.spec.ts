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
});

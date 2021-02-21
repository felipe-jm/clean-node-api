import DbCreateAccount from './db-create-account';

describe('DbCreateAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterMock {
      async encrypt(password: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'));
      }
    }
    const encrypterMock = new EncrypterMock();
    const dbCreateAccount = new DbCreateAccount(encrypterMock);
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

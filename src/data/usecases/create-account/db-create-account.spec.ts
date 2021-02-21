import {
  Encrypter,
  CreateAccountModel,
  AccountModel,
  CreateAccountRepository,
} from './db-create-account-procotols';
import DbCreateAccount from './db-create-account';

const makeEncrypter = (): Encrypter => {
  class EncrypterMock implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncrypterMock();
};

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryMock implements CreateAccountRepository {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new CreateAccountRepositoryMock();
};

interface MakeDbCreateAccountReturn {
  dbCreateAccount: DbCreateAccount;
  encrypterMock: Encrypter;
  createAccountRepositoryMock: CreateAccountRepository;
}

const makeDbCreateAccount = (): MakeDbCreateAccountReturn => {
  const encrypterMock = makeEncrypter();
  const createAccountRepositoryMock = makeCreateAccountRepository();
  const dbCreateAccount = new DbCreateAccount(
    encrypterMock,
    createAccountRepositoryMock,
  );
  return {
    dbCreateAccount,
    encrypterMock,
    createAccountRepositoryMock,
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

  it('should call CreateAccountRepository with correct values', async () => {
    const {
      dbCreateAccount,
      createAccountRepositoryMock,
    } = makeDbCreateAccount();
    const createSpy = jest.spyOn(createAccountRepositoryMock, 'create');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await dbCreateAccount.create(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });

  it('should throw if CreateAccountRepository throws', async () => {
    const {
      dbCreateAccount,
      createAccountRepositoryMock,
    } = makeDbCreateAccount();
    jest
      .spyOn(createAccountRepositoryMock, 'create')
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

  it('should return an account on success', async () => {
    const { dbCreateAccount } = makeDbCreateAccount();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const account = await dbCreateAccount.create(accountData);
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });
});

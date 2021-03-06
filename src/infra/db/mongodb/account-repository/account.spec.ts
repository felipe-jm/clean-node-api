import MongoHelper from '../helpers/mongo-helper';
import AccountMongoRepository from './account';

describe('Account Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeAccountMongoRepository = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('should return an account on success', async () => {
    const accountMongoRepository = makeAccountMongoRepository();
    const account = await accountMongoRepository.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });
});

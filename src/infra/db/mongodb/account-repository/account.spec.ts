import MongoClient from '../helpers/mongo-helper';
import AccountMongoRepository from './account';

describe('Account Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoClient.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoClient.disconnect();
  });

  it('should return an account on success', async () => {
    const accountMongoRepository = new AccountMongoRepository();
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

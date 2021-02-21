import { CreateAccountRepository } from '../../../../data/protocols/create-account-repository';
import { CreateAccountModel } from '../../../../domain/usecases/create-account';
import { AccountModel } from '../../../../domain/models/account';
import MongoHelper from '../helpers/mongo-helper';

export default class AccountMongoRepository implements CreateAccountRepository {
  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const [account] = result.ops;
    return MongoHelper.mapper(account);
  }
}

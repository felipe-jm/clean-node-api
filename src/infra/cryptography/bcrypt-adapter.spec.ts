import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await bcryptAdapter.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
});

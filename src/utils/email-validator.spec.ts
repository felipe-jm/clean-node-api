import validator from 'validator';
import EmailValidatorAdapter from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();
    const isValid = emailValidatorAdapter.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });
});

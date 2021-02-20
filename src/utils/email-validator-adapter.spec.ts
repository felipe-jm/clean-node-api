import validator from 'validator';
import EmailValidatorAdapter from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const emailValidatorAdapter = makeEmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const emailValidatorAdapter = makeEmailValidatorAdapter();
    const isValid = emailValidatorAdapter.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });

  it('should call validator with correct email', () => {
    const emailValidatorAdapter = makeEmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    emailValidatorAdapter.isValid('any_email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});

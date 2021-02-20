import { EmailValidatorAdapter } from './email-validator';

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter();
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });
});

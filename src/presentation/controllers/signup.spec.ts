import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const signUpController = new SignUpController();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});

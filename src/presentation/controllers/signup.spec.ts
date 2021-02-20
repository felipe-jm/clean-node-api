import SignUpController from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';
import { AccountModel } from '../../domain/models/account';
import {
  CreateAccount,
  CreateAccountModel,
} from '../../domain/usecases/create-account';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorMock implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorMock();
};

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountMock implements CreateAccount {
    create(account: CreateAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@emai.com',
        password: 'valid_password',
      };

      return fakeAccount;
    }
  }

  return new CreateAccountMock();
};

interface MakeSignUpControllerReturn {
  signUpController: SignUpController;
  emailValidatorMock: EmailValidator;
  createAccountMock: CreateAccount;
}

const makeSignUpController = (): MakeSignUpControllerReturn => {
  const emailValidatorMock = makeEmailValidator();
  const createAccountMock = makeCreateAccount();
  const signUpController = new SignUpController(
    emailValidatorMock,
    createAccountMock,
  );

  return { signUpController, emailValidatorMock, createAccountMock };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if no password confirmation is provided', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  it('should return 400 if password confirmation fails', () => {
    const { signUpController } = makeSignUpController();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  it('should return 400 if an invalid email is provided', () => {
    const { signUpController, emailValidatorMock } = makeSignUpController();
    jest.spyOn(emailValidatorMock, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', () => {
    const { signUpController, emailValidatorMock } = makeSignUpController();
    const isValidSpy = jest.spyOn(emailValidatorMock, 'isValid');

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    signUpController.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  it('should return 500 if EmailValidator throws an exception', () => {
    const { signUpController, emailValidatorMock } = makeSignUpController();
    jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = signUpController.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should call CreateAccount with correct values', () => {
    const { signUpController, createAccountMock } = makeSignUpController();
    const createSpy = jest.spyOn(createAccountMock, 'create');

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    signUpController.handle(httpRequest);
    expect(createSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@email.com',
      password: 'any_password',
    });
  });
});

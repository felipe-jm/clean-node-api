import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
  CreateAccount,
} from './signup-protocols';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly createAccount: CreateAccount;

  constructor(emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator;
    this.createAccount = createAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      const bodyKeys = Object.keys(httpRequest.body);

      const missingField = requiredFields.find(
        field => !bodyKeys.includes(field),
      );

      if (missingField) {
        return badRequest(new MissingParamError(missingField));
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this.createAccount.create({
        name,
        email,
        password,
      });

      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return serverError();
    }
  }
}

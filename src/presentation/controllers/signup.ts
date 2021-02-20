import MissingParamError from '../errors/missing-param-error';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import InvalidParamError from '../errors/invalid-param-error';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
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

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'));
    }
  }
}

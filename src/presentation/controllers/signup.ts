import { MissingParamError, InvalidParamError } from '../errors';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest, serverError } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
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

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}

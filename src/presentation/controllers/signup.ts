import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
} from '../protocols';

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

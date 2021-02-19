import MissingParamError from '../errors/missing-param-error';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';

export default class SignUpController implements Controller {
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
  }
}

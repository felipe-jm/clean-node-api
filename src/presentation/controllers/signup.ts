import { request } from 'http';
import MissingParamError from '../errors/missing-param-error';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';

export default class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email'];

    const bodyKeys = Object.keys(httpRequest.body);

    const missingField = requiredFields.find(
      field => !bodyKeys.includes(field),
    );

    if (missingField) {
      return badRequest(new MissingParamError(missingField));
    }
  }
}

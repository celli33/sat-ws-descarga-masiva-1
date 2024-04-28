import { HttpClientError } from '../web-client/exceptions/http-client-error.js';
import { type Token } from '../shared/token.js';
import { CRequest } from '../web-client/crequest.js';
import { type CResponse } from '../web-client/cresponse.js';
import { HttpServerError } from '../web-client/exceptions/http-server-error.js';
import { SoapFaultError } from '../web-client/exceptions/soap-fault-error.js';
import { type WebClientException } from '../web-client/exceptions/web-client-exception.js';
import { type WebClientInterface } from '../web-client/web-client-interface.js';
import { SoapFaultInfoExtractor } from './soap-fault-info-extractor.js';

export class ServiceConsumer {
  public static async consume(
    webClient: WebClientInterface,
    soapAction: string,
    uri: string,
    body: string,
    token?: Token,
  ): Promise<string> {
    return new ServiceConsumer().execute(webClient, soapAction, uri, body, token);
  }

  public async execute(
    webClient: WebClientInterface,
    soapAction: string,
    uri: string,
    body: string,
    token?: Token,
  ): Promise<string> {
    const headers = this.createHeaders(soapAction, token);
    const request = this.createRequest(uri, body, headers);
    let exception: WebClientException | undefined;
    let response: CResponse;
    try {
      response = await this.runRequest(webClient, request);
    } catch (error) {
      const webError = error as WebClientException;
      exception = webError;
      response = webError.getResponse();
    }

    this.checkErrors(request, response, exception);

    return response.getBody();
  }

  public createRequest(uri: string, body: string, headers: Record<string, string>): CRequest {
    return new CRequest('POST', uri, body, headers);
  }

  public createHeaders(soapAction: string, token?: Token): Record<string, string> {
    const headers = new Map();
    headers.set('SOAPAction', soapAction);
    if (token) {
      headers.set('Authorization', `WRAP access_token="${token.getValue()}"`);
    }

    return Object.fromEntries(headers) as Record<string, string>;
  }

  public async runRequest(webClient: WebClientInterface, request: CRequest): Promise<CResponse> {
    webClient.fireRequest(request);
    let response: CResponse;
    try {
      response = await webClient.call(request);
    } catch (error) {
      const webError = error as WebClientException;
      webClient.fireResponse(webError.getResponse());
      throw webError;
    }

    webClient.fireResponse(response);

    return response;
  }

  public checkErrors(request: CRequest, response: CResponse, exception?: Error): void {
    const fault = SoapFaultInfoExtractor.extract(response.getBody());
    // evaluate SoapFaultInfo
    if (fault) {
      throw new SoapFaultError(request, response, fault, exception);
    }

    if (response.statusCodeIsClientError()) {
      const message = `Unexpected client error status code ${response.getStatusCode()}`;
      throw new HttpClientError(message, request, response, exception);
    }

    if (response.statusCodeIsServerError()) {
      const message = `Unexpected server error status code ${response.getStatusCode()}`;
      throw new HttpServerError(message, request, response, exception);
    }

    if (response.isEmpty()) {
      throw new HttpServerError(
        'Unexpected empty response from server',
        request,
        response,
        exception,
      );
    }
  }
}

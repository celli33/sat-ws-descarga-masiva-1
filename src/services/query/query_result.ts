import { type StatusCode } from '#src/shared/status_code';

export class QueryResult {
  private readonly _status: StatusCode;

  private readonly _requestId: string;

  public constructor(statusCode: StatusCode, requestId: string) {
    this._status = statusCode;
    this._requestId = requestId;
  }

  /**
   * Status of the verification call
   */
  public getStatus(): StatusCode {
    return this._status;
  }

  /**
   * If accepted, contains the request identification required for verification
   */
  public getRequestId(): string {
    return this._requestId;
  }

  public toJSON(): { status: StatusCode; requestId: string } {
    return {
      status: this._status,
      requestId: this._requestId,
    };
  }
}

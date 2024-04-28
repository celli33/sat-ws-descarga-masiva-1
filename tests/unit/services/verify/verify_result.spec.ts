import { VerifyResult } from '#src/services/verify/verify_result';
import { CodeRequest } from '#src/shared/code_request';
import { StatusCode } from '#src/shared/status_code';
import { StatusRequest } from '#src/shared/status_request';
import { useTestCase } from '../../../test_case.js';

describe('verify result', () => {
  const { fileContents } = useTestCase();
  test('properties', () => {
    const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
    const statusRequest = new StatusRequest(2);
    const codeRequest = new CodeRequest(5003);
    const numberCfdis = 1000;
    const packageIds = ['x-package-1', 'x-package-2'];

    const result = new VerifyResult(
      statusCode,
      statusRequest,
      codeRequest,
      numberCfdis,
      ...packageIds,
    );

    expect(result.getStatus()).toBe(statusCode);
    expect(result.getStatusRequest()).toBe(statusRequest);
    expect(result.getCodeRequest()).toBe(codeRequest);
    expect(result.getNumberCfdis()).toBe(numberCfdis);
    expect(result.getPackageIds()).toStrictEqual(packageIds);
  });

  test('json', () => {
    const statusCode = new StatusCode(5000, 'Solicitud recibida con éxito');
    const statusRequest = new StatusRequest(3);
    const codeRequest = new CodeRequest(5003);

    const numberCfdis = 1000;
    const packageIds = ['x-package-1', 'x-package-2'];

    const result = new VerifyResult(
      statusCode,
      statusRequest,
      codeRequest,
      numberCfdis,
      ...packageIds,
    );

    const expectedFile = fileContents('json/verify-result.json', 'utf8');

    expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(expectedFile)));
  });
});

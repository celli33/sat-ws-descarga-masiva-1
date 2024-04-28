import { BaseEnum } from './enum/base-enum.js';

export type DocumentStatusTypes = 'undefined' | 'active' | 'cancelled';

enum DocumentStatusEnum {
  undefined = '',
  active = '1',
  cancelled = '0',
}

export class DocumentStatus extends BaseEnum<DocumentStatusTypes> {
  public value(): string {
    return DocumentStatusEnum[this._id];
  }

  public override toJSON(): string {
    return DocumentStatusEnum[this._id];
  }
}

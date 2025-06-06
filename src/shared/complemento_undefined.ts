import { type ComplementoInterface } from './complemento_interface.js';
import { BaseEnum } from './enum/base_enum.js';

export type ComplementoUndefinedTypes = 'undefined';

export class ComplementoUndefined
  extends BaseEnum<ComplementoUndefinedTypes>
  implements ComplementoInterface<ComplementoUndefinedTypes>
{
  public readonly Map = {
    undefined: {
      satCode: '',
      label: 'Sin complemento definido',
    },
  };

  public static create(
    id: ComplementoUndefinedTypes,
  ): ComplementoInterface<ComplementoUndefinedTypes> {
    return new ComplementoUndefined(id);
  }

  public static undefined(): ComplementoInterface<ComplementoUndefinedTypes> {
    return new ComplementoUndefined('undefined');
  }

  public label(): string {
    return this.Map[this._id].label;
  }

  public value(): string {
    return this.Map[this._id].satCode;
  }

  public override toJSON(): string {
    return this.value();
  }
}

export class Field {
  field: string;
  name: string;

  constructor(field: string, name: string) {
    this.field = field;
    this.name = name;
  }

  get(): string {
    return this.field;
  }
}

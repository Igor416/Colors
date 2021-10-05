export interface IPrimitiveType {
  max: number;
  min: number;
  value: number | string;

  handle(): void;
  eq(int: any): boolean;
}

// HSL to RGB and RGB to HSL is not accurate. Increment the coefficent at "eq" if needed.

export class Integer implements IPrimitiveType {
  max: number;
  min: number;
  value: number;

  constructor(value: number, max: number, min = 0) {
    this.max = max;
    this.min = min;
    if (value > max) {
      this.value = max;
    } else if (value < min) {
      this.value = min;
    } else {
      this.value = value;
    }
  }

  handle(): void {
    if (this.value == null) {
      this.value = 0;
    } else {
      if (this.value > this.max) {
        this.value = this.max;
      } else if (this.value < this.min) {
        this.value = this.min;
      }
    }
  }

  Add(int: Integer): Integer {
    let value = this.value + int.value;
    if (value > this.max) {
      value -= this.max;
    }
    if (value != 0 && value % this.max == 0) {
      value = this.max
    }
    return new Integer(value, this.max);
  }

  Sub(int: Integer): Integer {
    let value = this.value - int.value;
    if (value < this.min) {
      value = Math.abs(value);
    }
    if (value != 0 && value % this.max == 0) {
      value = this.max
    }
    return new Integer(value, this.max);
  }

  Mix(int: Integer): Integer {
    let value = Math.round((this.value + int.value) / 2);
    return new Integer(value, this.max);
  }

  eq(int: any): boolean {
    const dispersion = 3;
    int = int as Integer;
    if (this.value >= int.value - dispersion && this.value <= int.value + dispersion) {
      return true;
    }
    return false;
  }
}

export class String implements IPrimitiveType {
  max: number;
  min: number;
  value: string;

  constructor(value: string, max = 255, min = 0) {
    this.max = max;
    this.min = min;
    if (parseInt(value, 16) > max) {
      this.value = max.toString(16);
    } else if (parseInt(value, 16) < min) {
      this.value = min.toString(16);
    } else {
      this.value = value;
    }
  }

  handle(): void {
    let regex = new RegExp('([A-Fa-f0-9]{1}|[A-Fa-f0-9]{2})');
    if (!this.value.match(regex)) {
      this.value = '0';
    } else {
      if (parseInt(this.value, 16) > this.max) {
        this.value = this.max.toString(16);
      } else if (parseInt(this.value, 16) < this.min) {
        this.value = this.min.toString(16);
      }
    }
  }

  eq(str: any): boolean {
    const dispersion = 3;
    str = str as String;
    str = parseInt(str.value, 16);
    let val = parseInt(this.value, 16);

    if (val >= str - dispersion && val <= str + dispersion) {
      return true;
    }
    return false;
  }
}

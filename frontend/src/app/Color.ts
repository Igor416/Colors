import { IModel, RGB, HEX, HSL, HWB, CMYK } from './Model';

export class Color {
  models: string[];
  rgb: RGB;
  hex: HEX;
  hsl: HSL;
  hwb: HWB;
  cmyk: CMYK;

  constructor(model: IModel) {
    this.models = ['rgb', 'hex', 'hsl', 'hwb', 'cmyk'];
    this.rgb = model.toRGB();
    this.hex = model.toHEX();
    this.hsl = model.toHSL();
    this.hwb = model.toHWB();
    this.cmyk = model.toCMYK();
  }

  get(modelName: string): IModel | void {
    switch (modelName) {
      case 'rgb':
        return this.rgb;
      case 'hex':
        return this.hex;
      case 'hsl':
        return this.hsl;
      case 'hwb':
        return this.hwb;
      case 'cmyk':
        return this.cmyk;
    }
  }

  update(): void {
    let isSync: boolean | IModel = this.isSync()
    if (isSync === true) {
      return;
    } else {
      setTimeout(() => {
        isSync = isSync as IModel;
        isSync.default();
        this.rgb = isSync.toRGB();
        this.hex = isSync.toHEX();
        this.hsl = isSync.toHSL();
        this.hwb = isSync.toHWB();
        this.cmyk = isSync.toCMYK();
      }, 1);
    }
  }

  isSync(): boolean | IModel {
    //returns if models ary sync, if not, return the distinct model
    this.hwb.handle(); //Whiteness + Blackness = 100

    let getDistinct = (value: void | IModel, index: number, array: (void | IModel)[]) => {
      return !(value as IModel).eq(this.rgb);
    }

    let models: IModel[] = [];
    for (let model of this.models) {
      models.push(this.get(model) as IModel)
    }

    let distinct = models.filter(getDistinct)

    let result = distinct.length == 0 ? true : distinct[0];
    return result;
  }

  add(...colors: Color[]): Color {
    let rgb = this.rgb;
    for (let color of colors) {
      color.update();
      rgb = rgb.Add(color.rgb);
    }
    return new Color(rgb);
  }

  sub(...colors: Color[]): Color {
    let rgb = this.rgb;
    for (let color of colors) {
      color.update();
      rgb = rgb.Sub(color.rgb);
    }
    return new Color(rgb);
  }

  mix(...colors: Color[]): Color {
    let rgb = this.rgb;
    for (let color of colors) {
      color.update();
      rgb = rgb.Mix(color.rgb);
    }
    return new Color(rgb);
  }

  getShade(): string {
    if (this.hsl.c.value <= 50) {
      return 'white';
    } else {
      return 'black';
    }
  }

  semiInvert(): Color {
    let R, G, B;
    if (this.rgb.a.value > this.rgb.a.max / 2) {
      R = 0;
    } else {
      R = this.rgb.a.max;
    }
    if (this.rgb.b.value > this.rgb.b.max / 2) {
      G = 0;
    } else {
      G = this.rgb.b.max;
    }
    if (this.rgb.c.value > this.rgb.c.max / 2) {
      B = 0;
    } else {
      B = this.rgb.c.max;
    }
    return new Color(new RGB(R, G, B));
  }

  invert(): Color {
    let color = this.sub(new Color(new HSL(0, 100, 100)));
    return color;
  }

  eq(...colors: Color[]): boolean {
    for (let color of colors) {
      color.update();
      if (!this.rgb.eq(color.rgb)) {
        return false;
      }
    }
    return true;
  }

  static toColor(hex: string): Color {
    let R = hex.repeat(1).slice(1, 3);
    let G = hex.repeat(1).slice(3, 5);
    let B = hex.repeat(1).slice(5, 7);

    return new Color(new HEX(R, G, B));
  }
}

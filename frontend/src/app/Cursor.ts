import { Color } from './Color';

export class Cursor {
  x!: number;
  y!: number;
  canvasSize!: number;
  radius!: number;
  color!: Color;

  constructor (x: number, y: number, size: number) {
    const radius = 6; //for displaying
    if (this.isValid(x, y)) {
      this.x = x;
      this.y = y;
    } else {
      //default values
      this.x = 0;
      this.y = 0;
    }
    this.canvasSize = size;
    this.radius = radius;
  }

  isValid(x: number, y: number): boolean {
    let c = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    let sin = x / c;
    let cos = y / c;
    let result = Math.pow(sin, 2) + Math.pow(cos, 2);
    //sin^2 + cos^2 = 1
    return 1.001 > result || result > 0.9999;
  }
}

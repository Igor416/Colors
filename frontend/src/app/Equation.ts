import { Color } from './Color';
import { HEX } from './Model';

export class Equation {
  row: string[] = [];
  hexs: string[];
  colors: Color[] = [];
  signes: string[];
  result: string;

  constructor(row: string = '') {
    /*
    row - the whole equation, consists both from hexs and signs
    hexs - all terms of the equation, except for the result
    colors - all hexs, but transfromed to the type Color
    signes - all signs except for the '='
    result - the hex, representing the result
    */
    if (row != '') {
      this.hexs = row.split(new RegExp('[+&=-]{1}', 'g')); //split at any sign
      this.signes = row.split(new RegExp('[#A-Fa-f0-9]{7}', 'g')); //split at any hex

      /*as the row starts with hex and ends,
      when splitted there will be two empty string from both ends*/
      this.signes.shift(); //removing first emplty string
      this.signes.pop(); //removing last emplty string
      this.signes.pop(); //removing = sign, beacuse it's at the tail of array

      for (let i = 0; i < this.signes.length; i++) {
        if (this.signes[i] == '+') {
          this.signes[i] = 'plus';
        } else if (this.signes[i] == '-') {
          this.signes[i] = 'minus';
        } else if (this.signes[i] == '&') {
          this.signes[i] = 'mix';
        }
      }

      //removing the last hex (result) and store it
      this.result = this.hexs.pop() as string;

      this.row.push(this.hexs[0]);
      this.colors.push(Color.toColor(this.hexs[0]))
      for (let i = 1; i < this.hexs.length; i++) {
        this.colors.push(Color.toColor(this.hexs[i]))
        this.row.push(this.signes[i - 1]);
        this.row.push(this.hexs[i]);
      }
    } else {
      //default
      this.row = ['#000000', 'plus', '#000000'];
      this.hexs = ['#000000', '#000000'];
      this.hexs.forEach(h => this.colors.push(Color.toColor(h)));
      this.signes = ['plus'];
      this.result = ''; //would be calculated later
    }
  }

  add(hex: string): void {
    this.row.push('plus');
    this.row.push(hex);
    this.hexs.push(hex);
    this.signes.push('plus');
    this.colors.push(Color.toColor(hex));
  }

  remove(): void {
    this.row.pop();
    this.row.pop();
    this.hexs.pop();
    this.signes.pop();
    this.colors.pop();
  }

  get(): string[] {
    return this.row;
  }

  getResult(): string {
    //updating colors for the rendering and calculating the result
    this.result = this.hexs[0];
    this.colors[0] = Color.toColor(this.result);
    let color, result;
    for (let i = 1; i < this.hexs.length; i++) {
      color = Color.toColor(this.hexs[i]);
      this.colors[i] = color;
      result = Color.toColor(this.result);

      if (this.signes[i-1] == 'plus') {
        this.result = result.add(color).hex.toString();
      } else if (this.signes[i-1] == 'minus') {
        this.result = result.sub(color).hex.toString();
      } else if (this.signes[i-1] == 'mix') {
        this.result = result.mix(color).hex.toString();
      }
    }
    return this.result
  }
}

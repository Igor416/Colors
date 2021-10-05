import { Injectable } from '@angular/core';
import { IScheme, Monochromatic, Complementary, Analogous, Compound, Triadic, Rectangle, Square } from '../../Scheme';
import { Cursor } from '../../Cursor';
import { Color } from '../../Color';
import { CookiesService } from '../cookies/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  constructor(private cookies: CookiesService) { }

  get(name: string, x: number, y: number, size: number): IScheme | null {
    let scheme = null;
    let description = '';

    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (40, 52) on the canvas,
    though we need to perform calculations, as the center
    of the unit circle is at coords (size / 2, size / 2),
    so the circle_x will be: x - size / 2.
    circle_y will be: size / 2 - y;
    */

    x -= size / 2;
    y = size / 2 - y;

    switch (name) {
      case 'monochromatic': {
        scheme = new Monochromatic(x, y, size)
        description = 'Pick any color and see it\'s shadow\'s. The percentage displays the color\'s lightness, by HSL model.';
        break;
      }
      case 'complementary': {
        scheme = new Complementary(x, y, size)
        description = 'This scheme offers two opposite colors (you can check it in our color picker!). Two colors around the middle one are the picked colors mixed in ratio 2:1 and 1:2.';
        break;
      }
      case 'analogous': {
        scheme = new Analogous(x, y, size)
        description = 'The Analogous scheme provides various similar colors, that diversifies the choice from one color to six with a little different hue.'
        break;
      }
      case 'compound': {
        scheme = new Compound(x, y, size)
        description = 'This scheme is similar to the analagous one, the only difference is that the center color was inverted, scheme is also known as "Split-Complementary".'
        break;
      }
      case 'triadic': {
        scheme = new Triadic(x, y, size)
        description = 'The Triadic scheme gives 3 opposite colors. It provides visual contrast, while keeping color harmony and balance.'
        break;
      }
      case 'rectangle': {
        scheme = new Rectangle(x, y, size)
        description = 'This scheme is similar to the compound one, expcept for the center color, that is splited in 2. You can look at it as two pairs of opposite colors.'
        break;
      }
      case 'square': {
        scheme = new Square(x, y, size)
        description = 'The Square scheme is similar to the triadic, though there are 4 colors instead of 3. There are stil two pairs of colors, so the scheme is quite balanced.'
        break;
      }
    }
    if (scheme != null) {
      scheme.description = description + ' Try clicking on colors.';
    }
    return scheme;
  }

  loadCoords(key: string): number[] {
    let coords = this.cookies.get(key);
    return coords.split(',').map(c => Number(c));
  }

  saveCoords(key: string, cursor: Cursor, days?: number): void {
    let x, y;

    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (-40, 52) on the unit circle,
    though we need to draw it on canvas, as the center of circle
    is at coords (size / 2, size / 2), so the canvas_x will be:
    size / 2 + x. If y is positive, then canvas_y will be:
    size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
    */

    x = cursor.x + cursor.canvasSize / 2
    if (cursor.y < 0) {
      y = Math.abs(cursor.y) + cursor.canvasSize / 2;
    } else {
      y = cursor.canvasSize / 2 - cursor.y;
    }
    this.cookies.set(key, x + ',' + y, days);
  }
}


export class CursorInfo {
  label: string;
  color: Color;

  constructor(label: string, value: Cursor | Color, value2?: Cursor) {
    this.label = label;
    if (value2 == undefined && value instanceof Cursor) {
      this.color = (value as Cursor).color;
    } else if (value2 == undefined) { //value isn't Cursor
      this.color = value as Color;
    } else if (value instanceof Cursor) { //value2 is defined
      this.color = (value as Cursor).color.mix(value2.color)
    } else { //neither of them
      this.color = (value as Color).mix(value2.color);
    }
  }
}

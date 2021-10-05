import { Injectable } from '@angular/core';
import { Cursor } from '../../Cursor';
import { Color } from '../../Color';
import { RGB } from '../../Model';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  canvas!: HTMLCanvasElement;
  wheel!: HTMLCanvasElement;

  constructor() { }

  drawWheel(size = 350): HTMLCanvasElement {
    //https://stackoverflow.com/questions/46214072/color-wheel-picker-canvas-javascript
    let degToRad = (deg: number) => (deg * (Math.PI / 180));

    const centerColor = 'white';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = size;
    canvas.height = size;

    // Initiate variables
    let angle = 0;
    let pivotPointer = 0;
    const hexCode = [255, 0, 0];
    const colorOffsetByDegree = 4.322;
    const radius = size / 2;

    // For each degree in circle, perform operation
    while (angle < 360) {
      // find index immediately before our pivot
      const pivotPointerbefore = (pivotPointer + 3 - 1) % 3;

      // Modify colors
      if (hexCode[pivotPointer] < 255) {
        // If main points isn't full, add to main pointer
        if (hexCode[pivotPointer] + colorOffsetByDegree > 255) {
          hexCode[pivotPointer] = 255;
        } else {
          hexCode[pivotPointer] += colorOffsetByDegree;
        }
      } else if (hexCode[pivotPointerbefore] > 0) {
        // If color before main isn't zero, subtract
        if (hexCode[pivotPointerbefore] > colorOffsetByDegree) {
          hexCode[pivotPointerbefore] -= colorOffsetByDegree
        } else {
          hexCode[pivotPointerbefore] = 0;
        }
      } else if (hexCode[pivotPointer] >= 255) {
        // If main color is full, move pivot
        hexCode[pivotPointer] = 255;
        pivotPointer = (pivotPointer + 1) % 3;
      }

      const rgb = `rgb(${hexCode.map(h => Math.floor(h)).join(',')})`;
      const grad = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
      grad.addColorStop(0, centerColor);
      grad.addColorStop(1, rgb);
      context.fillStyle = grad;

      // draw circle portion
      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      context.moveTo(radius, radius);
      context.arc(radius, radius, radius, degToRad(angle), 2 * Math.PI);
      context.closePath();
      context.fill();

      angle++;
    }

    return canvas;
  }

  drawAllCursors(cursors: Cursor[]) {
    let size = this.canvas.width;
    let x, y;

    let ctx = getContext(this.canvas);
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 3;
    for (let cursor of cursors) {
      ctx.beginPath();
      /*
      Adjust for trigonometric calculations
      E.g. the (x, y) are (-40, 52) on the unit circle,
      though we need to draw it on canvas, as the center of circle
      is at coords (size / 2, size / 2), so the canvas_x will be:
      size / 2 + x. If y is positive, then canvas_y will be:
      size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
      */
      x = cursor.x + size / 2
      if (cursor.y < 0) {
        y = Math.abs(cursor.y) + size / 2;
      } else {
        y = size / 2 - cursor.y;
      }
      cursor.color = this.getColor(x, y);
      ctx.arc(x, y, cursor.radius * 2, 0, 2 * Math.PI);
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();
    }
  }

  getColor(x: number, y: number): Color {
    let ctx = getContext(this.wheel);
    let data = ctx.getImageData(x, y, 1, 1);
    let rgb = data.data.slice(0, 3);
    return new Color(new RGB(rgb[0], rgb[1], rgb[2]));
  }
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas.getContext('2d') as CanvasRenderingContext2D;
}

import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

import { IScheme, Monochromatic, Complementary, Analogous, Compound, Triadic, Rectangle, Square } from '../../Scheme';
import { Cursor } from '../../Cursor';
import { Color } from '../../Color';
import { RGB, HSL } from '../../Model';
import { CanvasService } from '../../services/canvas/canvas.service';
import { SchemeService, CursorInfo } from '../../services/schemes/scheme.service';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.css']
})
export class SchemesComponent implements OnInit {
  wheel!: HTMLCanvasElement;
  canvas!: HTMLCanvasElement;
  scheme!: IScheme;
  picked_scheme!: string;
  schemes: string[];
  mouseIsDown: boolean;
  colors_shown: boolean;
  isMobile: boolean;

  constructor(private route: ActivatedRoute, private schemeService: SchemeService, private canvasService: CanvasService) {
    let scheme;
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
    let name = this.route.snapshot.paramMap.get('scheme') as string;
    let size = screen.availWidth
    if (this.isMobile) {
      size *= 80 / 100 //80vw
    } else {
      size *= 20 / 100 //20vw
    }
    let coords = this.schemeService.loadCoords(name);
    if (coords.length == 2) { //the cookie may expire, then length will be 0
      scheme = this.schemeService.get(name, coords[0], coords[1], size);
    } else {
      scheme = this.schemeService.get(name, size / 2, size / 4, size); //tint of violet
    }

    if (scheme == null) {
      window.location.replace('https://igor416.github.io/Colors/');
    } else {
      this.scheme = scheme;
      this.picked_scheme = scheme.name;
    }

    this.schemes = ['monochromatic', 'complementary', 'analogous', 'compound', 'triadic', 'rectangle', 'square'];
    this.mouseIsDown = false;
    this.colors_shown = false;
  }

  ngOnInit(): void {
    //there are 2 different canvas elements so that when user drags any of the cursors we may redraw only the cursors, the wheel is only drawn once, at the beginind, remains unchanged
    let size = screen.availWidth
    if (this.isMobile) {
      size *= 80 / 100 //80vw
    } else {
      size *= 20 / 100 //20vw
    }
    let container = document.getElementById('canvas_container') as HTMLElement;

    this.wheel = this.canvasService.drawWheel(size);
    container.style.width = container.style.height = size + 'px';
    this.wheel.style.position = 'absolute';
    container?.appendChild(this.wheel);
    this.canvasService.wheel = this.wheel;

    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.canvas.width = this.canvas.height = size;
    this.canvas.style.position = 'absolute';
    container?.appendChild(this.canvas);
    this.canvasService.canvas = this.canvas;

    this.canvasService.drawAllCursors(this.scheme.cursors);

    //cursor can only be moved when the mouse is down, so we need to track mouse state
    if (this.isMobile) {
      fromEvent(this.canvas, 'touchstart') .subscribe(e => { this.onMouseDown(e); });
      fromEvent(this.canvas, 'touchend') .subscribe(e => { this.onMouseUp(e); });
      fromEvent(this.canvas, 'touchmove') .subscribe(e => { this.onCursorDrag(e); });
    } else {
      fromEvent(this.canvas, 'mousedown') .subscribe(e => { this.onMouseDown(e); });
      fromEvent(this.canvas, 'mouseup') .subscribe(e => { this.onMouseUp(e); });
      fromEvent(this.canvas, 'mousemove') .subscribe(e => { this.onCursorDrag(e); });
    }
  }

  navigateTo(value: any): boolean {
    /*
    the select value comes as an 'index: value' pair, so we split the string into '['index:', 'value']', so the true value is now separated and we can access it
    */
    if (value) {
      value = value.target.value.split(' ');
      window.location.href = (`https://igor416.github.io/Colors/schemes/${value[1]}`);
    }
    return false;
  }

  onMouseDown(event: Event) {
    /*
    if user clicked on any cursor, update the lastActive with cursor's index, else don't update the lastActive field
    */
    let evt = event as MouseEvent;

    let mouseX = evt.clientX - this.canvas.offsetLeft;
    let mouseY = evt.clientY - this.canvas.offsetTop;
    let size = this.canvas.width;
    mouseX -= size / 2;
    mouseY = size / 2 - mouseY;

    for (let i = 0; i < this.scheme.cursors.length; i++) {
      let cursor = this.scheme.cursors[i];
      let rad = cursor.radius;

      if (inRange(cursor.x, rad, mouseX) && inRange(cursor.y, rad, mouseY)) {
        this.scheme.lastActive = i;
        break;
      }
    }

    this.mouseIsDown = true;
  }

  onMouseUp(event: Event) {
    this.mouseIsDown = false;
  }

  onCursorDrag(event: Event): void {
    if (!this.mouseIsDown) {
      return;
    }
    let evt = event as MouseEvent;

    let mouseX = evt.clientX - this.canvas.offsetLeft;
    let mouseY = evt.clientY - this.canvas.offsetTop;
    let size = this.canvas.width;

    let ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    let cursor = this.scheme.cursors[this.scheme.lastActive]

    let x = mouseX - size / 2;
    let y = size / 2 - mouseY;

    //cursor can't go beyond the wheel, we handling it using Pythagoras's theorem
    if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= size / 2) {
      cursor.x = x;
      cursor.y = y;

      this.scheme.update();
      //as the cursors aren't independent we need to redraw every one. The dependencies are in the scheme.ts file
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasService.drawAllCursors(this.scheme.cursors);
      this.schemeService.saveCoords(this.picked_scheme, this.scheme.cursors[0])
    }
  }

  getCursorsInfo(): CursorInfo[] {
    //get label and color of the cursor. For details of the composition, consider using the website
    let container = document.getElementById('cursor_values') as HTMLElement;
    let info = [];
    let cursors = this.scheme.cursors;
    if (cursors.length == 1) {
      //line
      container.style.gridTemplateColumns = 'auto '.repeat(7)
      let color = cursors[0].color;
      //the hue and saturation remain unchanged
      let H = color.hsl.a.value;
      let S = color.hsl.b.value

      if (this.isMobile) {
        info.push(new CursorInfo('95%', new Color(new HSL(H, S, 95))));
        info.push(new CursorInfo('75%', new Color(new HSL(H, S, 75))));
        info.push(new CursorInfo('50%', new Color(new HSL(H, S, 50))));
      } else {
        for (let l = 90; l >= 50; l -= 10) {
          info.push(new CursorInfo(l + '%', new Color(new HSL(H, S, l))));
        }
      }

      info.push(new CursorInfo('', new Color(new HSL(0, 0, 96)))); //background-color, simulate space between gradient and picked color
      info.push(new CursorInfo('1', color));

    } else if (cursors.length == 2) {
      //line
      container.style.gridTemplateColumns = 'auto '.repeat(5)
      let mixed = cursors[0].color.mix(cursors[1].color)

      info.push(new CursorInfo('1', cursors[0]));
      if (this.isMobile) {
        info.push(new CursorInfo('1 & 1.2', mixed, cursors[0]));
        info.push(new CursorInfo('1 & 2', mixed));
        info.push(new CursorInfo('1.2 & 2', mixed, cursors[1]));
      } else {
        info.push(new CursorInfo('1 & 1 & 2', mixed, cursors[0]));
        info.push(new CursorInfo('1 & 2', mixed));
        info.push(new CursorInfo('1 & 2 & 2', mixed, cursors[1]));
      }
      info.push(new CursorInfo('2', cursors[1]));

    } else if (cursors.length == 3) {
      //rectngle
      info.push(new CursorInfo('1 & 2', cursors[0], cursors[1]))
      info.push(new CursorInfo('2', cursors[1]))
      info.push(new CursorInfo('2 & 3', cursors[2], cursors[1]))
      info.push(new CursorInfo('1', cursors[0]))
      info.push(new CursorInfo('1 & 3', cursors[0], cursors[2]))
      info.push(new CursorInfo('3', cursors[2]))

    } else if (cursors.length == 4) {
      //square
      info.push(new CursorInfo('1', cursors[0]))
      info.push(new CursorInfo('1 & 2', cursors[0], cursors[1]))
      info.push(new CursorInfo('2', cursors[1]))
      info.push(new CursorInfo('1 & 3', cursors[0], cursors[2]))
      info.push(new CursorInfo('1 & 4', cursors[0], cursors[3]))
      info.push(new CursorInfo('2 & 4', cursors[1], cursors[3]))
      info.push(new CursorInfo('3', cursors[2]))
      info.push(new CursorInfo('3 & 4', cursors[2], cursors[3]))
      info.push(new CursorInfo('4', cursors[3]))
    }

    return info;
  }
}

function inRange(center: number, radius: number, point: number) {
  return center - radius < point && point < center + radius;
}

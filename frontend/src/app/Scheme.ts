import { Cursor } from './Cursor';

export interface IScheme {
  name: string;
  cursors: Cursor[];
  description: string;
  lastActive: number;

  update(): void;
}

export class Monochromatic {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'monochromatic';
    this.cursors.push(new Cursor(x, y, size))
  }

  update(): void { }
}

export class Complementary {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'complementary';
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))

    this.update();
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    switch (this.lastActive) {
      case 0: {
        this.cursors[1] = new Cursor(-active.x, -active.y, active.canvasSize);
        break;
      }
      case 1: {
        console.log(this)
        this.cursors[0] = new Cursor(-active.x, -active.y, active.canvasSize);
        break;
      }
    }
  }
}

export class Analogous {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'analogous';
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))

    this.update();
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle1 = getAngle(active),
        offset = getOffset(active);

    let x, y;
    switch (this.lastActive) {
      case 0: {
        let angle2 = offset + 30 - angle1;
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[1] = new Cursor(x, y, active.canvasSize);

        let angle3 = offset + 60 - angle1;
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[2] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 1: {
        let angle2 = offset - 30 - angle1;
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[0] = new Cursor(x, y, active.canvasSize);

        let angle3 = offset + 30 - angle1;
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[2] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 2: {
        let angle2 = offset - 30 - angle1;
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[1] = new Cursor(x, y, active.canvasSize);

        let angle3 = offset - 60 - angle1;
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[0] = new Cursor(x, y, active.canvasSize);
        break;
      }
    }
  }
}

export class Compound {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'compound';
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))

    this.update();
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle1 = getAngle(active),
        offset = getOffset(active);

    let x, y;
    switch (this.lastActive) {
      case 0: {
        let angle2 = offset + 30 - angle1;
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[1] = new Cursor(-x, -y, active.canvasSize);

        let angle3 = offset + 60 - angle1;
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[2] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 1: {
        let angle2 = offset - 30 - angle1;
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[0] = new Cursor(-x, -y, active.canvasSize);

        let angle3 = offset + 30 - angle1;
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[2] = new Cursor(-x, -y, active.canvasSize);
        break;
      }
      case 2: {
        let angle2 = offset - 30 - angle1;
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[1] = new Cursor(-x, -y, active.canvasSize);

        let angle3 = offset - 60 - angle1;
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[0] = new Cursor(x, y, active.canvasSize);
        break;
      }
    }
  }
}

export class Triadic {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'triadic';
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))

    this.update();
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle1 = getAngle(active),
        offset = getOffset(active);

    let x, y;
    let angle2 = offset - 120 - angle1;
    let angle3 = offset - 240 - angle1;
    switch (this.lastActive) {
      case 0: {
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[2] = new Cursor(x, y, active.canvasSize);

        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[1] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 1: {
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[0] = new Cursor(x, y, active.canvasSize);

        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[2] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 2: {
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[1] = new Cursor(x, y, active.canvasSize);

        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[0] = new Cursor(x, y, active.canvasSize);
        break;
      }
    }
  }
}

export class Rectangle {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'rectangle';
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))

    this.update();
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle1 = getAngle(active),
        offset = getOffset(active);

    let x, y;
    let angle2 = offset - 120 - angle1;
    let angle3 = offset - 240 - angle1;
    switch (this.lastActive) {
      case 0: {
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[1] = new Cursor(x, y, active.canvasSize);
        this.cursors[2] = new Cursor(-x, -y, active.canvasSize);
        this.cursors[3] = new Cursor(-active.x, -active.y, active.canvasSize);
        break;
      }
      case 1: {
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[0] = new Cursor(x, y, active.canvasSize);
        this.cursors[2] = new Cursor(-active.x, -active.y, active.canvasSize);
        this.cursors[3] = new Cursor(-x, -y, active.canvasSize);
        break;
      }
      case 2: {
        x = c * Math.cos(degToRad(angle3));
        y = c * Math.sin(degToRad(angle3));
        this.cursors[0] = new Cursor(-x, -y, active.canvasSize);
        this.cursors[1] = new Cursor(-active.x, -active.y, active.canvasSize);
        this.cursors[3] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 3: {
        x = c * Math.cos(degToRad(angle2));
        y = c * Math.sin(degToRad(angle2));
        this.cursors[0] = new Cursor(-active.x, -active.y, active.canvasSize);
        this.cursors[1] = new Cursor(-x, -y, active.canvasSize);
        this.cursors[2] = new Cursor(x, y, active.canvasSize);
        break;
      }
    }
  }
}

export class Square {
  name: string;
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    this.name = 'square';
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))
    this.cursors.push(new Cursor(x, y, size))

    this.update();
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle1 = getAngle(active),
        offset = getOffset(active);

    let x, y;
    let angle2 = offset - 90 - angle1;
    x = c * Math.cos(degToRad(angle2));
    y = c * Math.sin(degToRad(angle2));
    switch (this.lastActive) {
      case 0: {
        this.cursors[1] = new Cursor(x, y, active.canvasSize);
        this.cursors[2] = new Cursor(-x, -y, active.canvasSize);
        this.cursors[3] = new Cursor(-active.x, -active.y, active.canvasSize);
        break;
      }
      case 1: {
        this.cursors[0] = new Cursor(-x, -y, active.canvasSize);
        this.cursors[2] = new Cursor(-active.x, -active.y, active.canvasSize);
        this.cursors[3] = new Cursor(x, y, active.canvasSize);
        break;
      }
      case 2: {
        this.cursors[0] = new Cursor(x, y, active.canvasSize);
        this.cursors[1] = new Cursor(-active.x, -active.y, active.canvasSize);
        this.cursors[3] = new Cursor(-x, -y, active.canvasSize);
        break;
      }
      case 3: {
        this.cursors[0] = new Cursor(-active.x, -active.y, active.canvasSize);
        this.cursors[1] = new Cursor(-x, -y, active.canvasSize);
        this.cursors[2] = new Cursor(x, y, active.canvasSize);
        break;
      }
    }
  }
}

function getOffset(cursor: Cursor): number {
  let offset;
  if (cursor.x > 0 && cursor.y > 0) {
    offset = 90;
  } else if (cursor.y > 0) {
    offset = 90;
  } else if (cursor.x > 0) {
    offset = 270;
  } else {
    offset = 270;
  }

  return offset
}

function getAngle(cursor: Cursor) {
  let angle;
  if (cursor.x == 0 && cursor.y == 0) {
    angle = 0
  } else if (cursor.x == 0) {
    angle = 0;
  } else if (cursor.y == 0) {
    if (cursor.x > 0) {
      angle = -90;
    } else {
      angle = 90;
    }
  } else {
    angle = radToDeg(Math.atan(cursor.x / cursor.y));
  }

  return angle
}


function radToDeg(rad: number) {
  return rad / Math.PI * 180
}


function degToRad(deg: number) {
  return deg * Math.PI / 180
}

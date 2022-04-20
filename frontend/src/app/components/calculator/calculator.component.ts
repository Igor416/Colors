import { Component, OnInit } from '@angular/core';
import { Color } from '../../Color';
import { Equation } from '../../Equation';
import { ColorsService } from '../../services/colors/colors.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  equation!: Equation;
  pickedSignId: number;
  minColors: number;
  maxColors: number;

  constructor(private colors: ColorsService) {
    if (window.matchMedia("(max-width: 1080px)").matches) {
      window.location.replace('https://igor416.github.io/Colors/');
    }
    this.pickedSignId = 0
    this.minColors = 2;
    this.maxColors = 26;
  }

  ngOnInit(): void {
    this.equation = this.colors.loadEquation('calculator_colors');
  }

  getInvertedColor(id: number): string {
    let color = this.equation.colors[id];
    return color.semiInvert().hex.toString(); //to get the text color
  }

  invertColor(id: number) {
    let color = this.equation.colors[id];
    color = color.invert();
    this.equation.colors[id] = color;
    this.equation.hexs[id] = color.hex.toString();
  }

  getResult(): string {
    this.colors.saveEquation('calculator_colors', this.equation);
    return this.equation.getResult();
  }

  getPickedSign(): string {
    return this.equation.signes[this.pickedSignId];
  }

  changeSign(sign: string): void {
    this.equation.signes[this.pickedSignId] = sign;
    this.equation.row[this.pickedSignId * 2 + 1] = sign;
  }

  clear(): void {
    this.equation = new Equation();
  }

  add(): void {
    if (this.equation.colors.length < this.maxColors) {
      this.equation.add('#000000');
    }
  }

  remove(): void {
    if (this.equation.colors.length > this.minColors) {
      this.equation.remove();
    }
  }
}

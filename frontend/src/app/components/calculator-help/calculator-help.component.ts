import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator-help',
  templateUrl: './calculator-help.component.html',
  styleUrls: ['./calculator-help.component.css']
})
export class CalculatorHelpComponent implements OnInit {

  constructor() {
    if (window.matchMedia("(max-width: 1080px)").matches) {
      window.location.replace('https://colorsapiwebsite.pythonanywhere.com/');
    }
  }

  ngOnInit(): void {
  }
}

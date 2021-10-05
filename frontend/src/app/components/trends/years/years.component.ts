import { Component, OnInit } from '@angular/core';

import { TrendsService, YearColor } from '../../../services/trends/trends.service';

@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.css']
})

export class YearsComponent implements OnInit {
  colors: YearColor[];
  choosed_color: YearColor;

  constructor(private trends: TrendsService) {
    this.colors = this.trends.getYearColors();
    this.choosed_color = this.colors[0];
  }

  ngOnInit(): void {
  }

}

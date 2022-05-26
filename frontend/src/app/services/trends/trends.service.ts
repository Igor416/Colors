import { Injectable } from '@angular/core';

import { Color } from '../../Color';
import { HEX } from '../../Model';
import trends from './trends.json';

@Injectable({
  providedIn: 'root'
})
export class TrendsService {

  constructor() { }

  getYearColors(): YearColor[] {
    let years = []
    for (let year of trends.years) {
      years.push(new YearColor(year.name, year.hex, year.pantone, year.year))
    }
    return years
  }

  getDecadePallete(decade: string): DecadePallette | null {
    for (let dec of trends.decades) {
      if (dec.decade == decade) {
        return new DecadePallette(dec.decade, dec.names, dec.hexs, dec.description);
      }
    }

    return null;
  }
}

export class YearColor {
  name: string;
  color: Color;
  pantone: string;
  year: string

  constructor(name: string, hex: string, pantone: string, year: string) {
    this.name = name;
    this.color = Color.toColor(hex);
    this.pantone = pantone;
    this.year = year;
  }
}

export class DecadePallette {
  decade: string;
  names: string[];
  colors: Color[] = [];
  description: string;
  shortDesc: string;

  constructor(decade: string, names: string[], hexs: string[], description: string) {
    this.decade = decade;
    this.names = names;

    for (let hex of hexs) {
      this.colors.push(Color.toColor(hex));
    }

    this.description = description;
    this.shortDesc = description.split(' ').slice(0, 21).join(' ')
  }
}

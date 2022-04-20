import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TrendsService, DecadePallette } from '../../../services/trends/trends.service';

@Component({
  selector: 'app-decades',
  templateUrl: './decades.component.html',
  styleUrls: ['./decades.component.css']
})
export class DecadesComponent implements OnInit {
  colors!: HTMLCollectionOf<HTMLDivElement>;
  decade: DecadePallette;
  decades: string[];
  isMobile: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private trends: TrendsService) {
    let decade = this.route.snapshot.paramMap.get('decade') as string;
    this.decade = this.trends.getDecadePallete(decade) as DecadePallette;

    this.decades = []
    for (let i = 1920; i <= 2010; i += 10) {
      this.decades.push(i.toString())
    }
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
  }

  ngOnInit(): void {
    let colors = document.getElementsByClassName('color')
    this.colors = colors as HTMLCollectionOf<HTMLDivElement>;
  }

  navigateTo(value: any): boolean {
    /*
    the select value comes as an 'index: value' pair, so we split the string into '['index:', 'value']', so the true value is now separated and we can access it
    */
    if (value) {
      value = value.target.value.split(' ');
      this.router.navigate([`/trends/decades/${value[1]}`]).then(() => {
        window.location.reload();
      });
    }
    return false;
  }

  show(index: number): void {
    let barInfo = this.colors[index].children[0].children
    for (let i = 0; i < barInfo.length; i++) {
      let text = barInfo[i];
      text.classList.remove('text-hidden');
      text.classList.add('text-showen');
    }

    let bar = this.colors[index].children[1]
    bar.classList.remove('shade-hidden');
    bar.classList.add('shade-showen');
  }

  hide(index: number): void {
    let barInfo = this.colors[index].children[0].children
    for (let i = 0; i < barInfo.length; i++) {
      let text = barInfo[i];
      text.classList.remove('text-showen');
      text.classList.add('text-hidden');
    }

    let bar = this.colors[index].children[1]
    bar.classList.remove('shade-showen');
    bar.classList.add('shade-hidden');
  }
}

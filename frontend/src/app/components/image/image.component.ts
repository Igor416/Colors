import { Component, OnInit, Input } from '@angular/core';

import { isDevMode }  from '../../services/auth/auth.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() src = '';
  @Input() alt = '';
  @Input() style!: Style;/* = {
    width: '0vw',
    border: '0px',
    'border-radius': '0%',
  };*/
  @Input() widthSmall = '';

  isMobile: boolean = false;

  constructor() {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
  }

  ngOnInit(): void {
    if (!isDevMode) {
      this.src = 'static/' + this.src;
    }
    if (this.isMobile) {
      this.style.width = this.widthSmall;
    }
  }
}

type Style = {
  [key: string]: string;
};

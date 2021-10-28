import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  hrefs: Array<{
    name: string,
    link: string
  }> = [];
  route!: string;

  constructor(private titleService: Title, private auth: AuthService, private router: Router) {
    this.title = 'Colors';
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.route = event.url.substr(1);
        this.setTitle(this.route);
      }
    });
  }

  setTitle(title: string): void {
    if (title != '') {
      if (title.includes('/')) {
        title = title.split('/')[0]
        //'trends/years' -> 'trends'
      }
      let first = title.split('')[0]
      title = first.toUpperCase() + title.split('').slice(1).join('')
      //'trends' -> 'Trends'
    }
    this.titleService.setTitle(this.title);
  }
}

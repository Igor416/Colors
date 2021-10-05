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
  signedIn!: boolean;
  hrefs: Array<{
    name: string,
    link: string
  }> = [];
  route!: string;

  constructor(private titleService: Title, private auth: AuthService, private router: Router) {
    this.title = 'Colors';
    let names = ['picker', 'calculator', 'trends', 'schemes', 'models']
    let links = ['picker', 'calculator', 'trends/years', 'schemes/analogous', 'models']

    for (let i = 0; i < names.length; i++) {
      this.hrefs.push({
        name: names[i],
        link: links[i]
      })
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.route = event.url.substr(1);
        this.setTitle(this.route);
      }
    });
    this.signedIn = this.auth.isAuth();
  }

  exit(): void {
    this.auth.logout().subscribe((resp: any) => {
      this.auth.setAuth(false)
      window.location.href = `http://localhost:4200/`;
    },
    err => {
      console.log(err)
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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor() { }

  set(key: string, value: string, days=3): void {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`;
  }

  get(key: string): string {
    key += '=';
    let cookies = decodeURIComponent(document.cookie).split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(key) == 0) {
        return cookie.substring(key.length, cookie.length);
      }
    }
    return '';
  }
}

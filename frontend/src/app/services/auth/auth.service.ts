import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookiesService } from '../cookies/cookies.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = 'http://colorsapiwebsite.pythonanywhere.com/';
  headers = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient, private cookies: CookiesService) { }

  setAuth(value: boolean, remember_me?: boolean): void {
    this.cookies.set('auth', value.toString(), remember_me ? 3 : 1 / 24)
  }

  isAuth(): boolean {
    return this.cookies.get('auth') == 'true';
  }

  displayErrors(errors: Array<any>): void {
    for (let err of errors) {
      alert(`Error: ${err}`)
    }
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'login', this.encrypt(data), this.headers)
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'register', this.encrypt(data), this.headers)
  }

  restore(data: any) {
    return this.http.post<any>(this.api + 'restore', this.encrypt(data), this.headers)
  }

  get(): Observable<any> {
    return this.http.get<any>(this.api + 'user', this.headers)
  }

  edit(data: any): Observable<any> {
    return this.http.put<any>(this.api + 'user', data, this.headers)
  }

  logout(): Observable<any> {
    return this.http.post<any>(this.api + 'logout', this.headers)
  }

  encrypt(data: any): any {
    if ('password' in data) {
      let password = data.password;
      data.password = this.rot13(password) // "very" secure
    }
    return data;
  }

  private rot13(str: string) {
    var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    var output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm456789123';
    var index = (x: string) => input.indexOf(x);
    var translate = (x: string) => index(x) > -1 ? output[index(x)] : x;
    return str.split('').map(translate).join('');
  }
}

export class Field {
  value: string | undefined;
  password: boolean;
  error: string;
  original!: Field | undefined;

  constructor(value: string | undefined, password = false, original?: Field) {
    this.value = value;
    this.password = password;
    this.error = '';
    this.original = original;
  }

  validate(): void {
    let passwordMinLen = 6;

    if (this.value != undefined) {
      if (this.value == '') {
        this.error = 'Empty field.';
        return;
      }
      if (this.value.includes(' ')) {
        this.error = `Invalid symbol occured (space).`;
        return;
      }
      if (this.password && this.value.length < passwordMinLen) {
        this.error = `Min. length is ${passwordMinLen}.`;
        return;
      }
      if (this.original != undefined) {
        if (this.value != this.original.value) {
          this.error = `Passwords don't match.`;
          return;
        }
      }
    }
    this.error = '';
  }

  isValid(): boolean {
    return this.value != undefined && this.error == '';
  }

  getError(): string {
    this.validate();
    return this.error
  }
}

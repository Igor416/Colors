import { Component, OnInit } from '@angular/core';

import { Field, AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  name: Field;
  email: Field;
  password: Field;
  password2: Field;
  remember_me: boolean;

  constructor(private auth: AuthService) {
    if (this.auth.isAuth()) {
      window.history.back()
    }
    this.name = new Field(undefined); //user hasn't introduced anything yet, so it's undefined
    this.email = new Field(undefined);
    this.password = new Field(undefined, true);
    this.password2 = new Field(this.password.value, true, this.password); //value, isPassword, original (to compare with)
    this.password.original = this.password2; //(to compare with)
    this.remember_me = true;
  }

  ngOnInit(): void { }

  sendForm(e: Event) {
    let data = {
      'name': this.name.value,
      'email': this.email.value,
      'password': this.password.value,
      'remember_me': this.remember_me
    };

    if (this.name.isValid() && this.email.isValid() && this.password.isValid() && this.password2.isValid()) {
      this.auth.signup(data).subscribe((resp: any) => {
        this.auth.setAuth(true, this.remember_me);
        window.location.href = (`http://localhost:4200/profile`);
      },
      err => {
        this.auth.displayErrors(err.error);
      });
    }
  }
}

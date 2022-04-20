import { Component, OnInit } from '@angular/core';

import { Field, AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {
  step: number;
  email: Field;
  code: Field;
  password: Field;
  password2: Field;
  remember_me: boolean;

  constructor(private auth: AuthService) {
    this.step = 1;

    this.email = new Field(undefined); //user hasn't introduced anything yet, so it's undefined
    this.code = new Field(undefined);
    this.password = new Field(undefined, true);
    this.password2 = new Field(this.password.value, true, this.password); //value, isPassword, original (to compare with)
    this.password.original = this.password2; //(to compare with)

    this.remember_me = true;
  }

  ngOnInit(): void {
  }

  resendCode() {
    let data = {
      'code': 'null',
      'resend': true
    };

    this.auth.restore(data).subscribe((resp: any) => {
      this.step = Number(resp.step);
    },
    err => {
      this.auth.displayErrors(err.error);
    });
  }

  sendForm() {
    if (this.step == 1) {
      let data = {
        'email': this.email.value
      };

      if (this.email.isValid()) {
        this.auth.restore(data).subscribe((resp: any) => {
          this.step = Number(resp.step);
        },
        err => {
          this.auth.displayErrors(err.error);
        });
      }
    }
    if (this.step == 2) {
      let data = {
        'code': this.code.value
      };

      if (this.code.isValid()) {
        this.auth.restore(data).subscribe((resp: any) => {
          this.step = Number(resp.step);
        },
        err => {
          this.auth.displayErrors(err.error);
        });
      }
    }
    if (this.step == 3) {
      let data = {
        'password': this.password.value,
        'remember_me': this.remember_me
      };

      if (this.password.isValid() && this.password2.isValid()) {
        this.auth.restore(data).subscribe((resp: any) => {
          this.auth.setAuth(true, this.remember_me);
          window.location.href = (`https://colorsapiwebsite.pythonanywhere.com/profile`);
        },
        err => {
          this.auth.displayErrors(err.error);
        });
      }
    }
  }
}

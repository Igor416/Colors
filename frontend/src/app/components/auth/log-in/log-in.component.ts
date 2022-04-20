import { Component, OnInit } from '@angular/core';

import { Field, AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  email: Field;
  password: Field;
  remember_me: boolean;

  constructor(private auth: AuthService) {
    if (this.auth.isAuth()) {
      window.history.back()
    }
    this.email = new Field(undefined); //user hasn't introduced anything yet, so it's undefined
    this.password = new Field(undefined, true);
    this.remember_me = true; //by default
  }

  ngOnInit(): void { }

  sendForm() {
    let data = {
      'email': this.email.value,
      'password': this.password.value,
      'remember_me': this.remember_me
    };

    if (this.email.isValid() && this.password.isValid()) {
      this.auth.login(data).subscribe((resp: any) => {
        this.auth.setAuth(true, this.remember_me);
        window.location.href = (`https://igor416.github.io/Colors/profile`);
      },
      err => {
        this.auth.displayErrors(err.error);
      });
    }
  }
}

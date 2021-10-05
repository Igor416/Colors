import { Component, OnInit } from '@angular/core';

import { Color } from '../../Color';
import { HEX } from '../../Model';
import { Field, AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editing: boolean;
  loginText!: string;
  login!: Field;
  emailText!: string;
  email!: Field;
  categories: Array<{
    name: string;
    colors: Color[];
  }> = [];
  active: Array<any> = [-1, -1, false, true]; //category id, colors id, edit mode, isColor
  current!: string;

  constructor(private auth: AuthService) {
    /*
    You will see lots of comments about active field,
    because i didn't want to make variables: 'edit mode' and 'isColor'
    because the all are fields of class Active,
    though creating new class or type isn't necessary here :/
    */
    //deafulat values if the server returned an error
    this.login = new Field('login');
    this.loginText = 'login';
    this.email = new Field('email');
    this.emailText = 'email';

    if (!this.auth.isAuth()) {
      window.location.href = (`http://localhost:4200/sign_up/`);
    }
    this.editing = false;
  }

  ngOnInit(): void {
    this.auth.get().subscribe((resp: any) => {
      this.login = new Field(resp.name);
      this.loginText = resp.name;
      this.email = new Field(resp.email);
      this.emailText = resp.email;

      if (resp.colors.length == 0) {
        this.categories = []
      } else {
        this.categories = this.decodeColors(resp.colors.split(';'));
      }
    },
    err => {
      this.auth.displayErrors(err.error);
    });
  }

  discard(): void {
    if (this.editing) {
      this.login.value = this.loginText;
      this.email.value = this.emailText;
      this.editing = false;
    }
  }

  save(): void {
    if (this.editing) {
      this.loginText = this.login.value as string;
      this.emailText = this.email.value as string;

      let data = {
        'data': 'info',
        'name': this.login.value,
        'email': this.email.value
      };

      this.auth.edit(data).subscribe((resp: any) => {
        this.loginText = resp.name;
        this.emailText = resp.email;
      },
      err => {
        this.auth.displayErrors(err.error);
      });
    }
    this.editing = !this.editing;
  }

  isActive(type: string, i: number, j?: number) {
    if (type == 'category') {
      return this.active[0] /*category id*/ == i && !this.active[3]; // isColor
    }
    return this.active[0] == i && this.active[1] == j; //category id, colors id
  }

  modifyColorOrCategory(): void {
    if (this.active[3]) { //isColor
      let color = this.categories[this.active[0]].colors[this.active[1]]; //category id, colors id
      if (color.hex.toString() != this.current) {
        color = Color.toColor(this.current);
        this.categories[this.active[0]].colors[this.active[1]] = color;
      }
      return;
    }

    this.categories[this.active[0]].name = this.current; //category id
  }

  deleteColorOrCategory(type: string): void {
    if (type == 'category') {
      this.categories.splice(this.active[0], 1); //category id
    } else if (type == 'color') {
      this.categories[this.active[0]].colors.splice(this.active[1], 1); //category id, colors id
    }
    this.current = '';
    this.active = [-1, -1, false, true];

    let data = {
      'data': 'colors',
      'colors': this.encodeColors()
    }

    this.auth.edit(data).subscribe((resp: any) => {
      this.categories = this.decodeColors(resp.colors.split(';'));
    },
    err => {
      this.auth.displayErrors(err.error);
    });
  }

  saveCategories(): void {
    if (this.active[2]) { //edit mode
      let data = {
        'data': 'colors',
        'colors': this.encodeColors()
      }

      this.auth.edit(data).subscribe((resp: any) => {
        this.categories = this.decodeColors(resp.colors.split(';'));
      },
      err => {
        console.log(err);
        this.auth.displayErrors(err.error);
      });
    }
  }

  addCategory(): void {
    if (this.categories.length < 11) {
      let category = {
        name: 'Title',
        colors: []
      }
      this.categories.push(category);

      this.current = category.name;
      this.active = [this.categories.length - 1, -1, true, false];
    }
  }

  addColor(): void {
    let colors = this.categories[this.active[0]].colors;

    if (colors.length < 11) {
      let color = Color.toColor('#000000');
      colors.push(color);

      this.categories[this.active[0]].colors = colors;

      this.current = color.hex.toString();
      this.active = [this.active[0], colors.length - 1, true, true];
    }
  }

  decodeColors(colorArr: string): any {
    let categories = []
    let colors: Color[];

    for (let category of colorArr) {
      colors = []

      if (category.includes(':')) {
        for (let color of category.split(':')[1].split(',')) {
          colors.push(Color.toColor('#' + color));
        }
      }

      categories.push({
        'name': category.split(':')[0],
        'colors': colors
      });
    }

    return categories;
  }

  encodeColors(): string {
    let str = ''
    for (let category of this.categories) {
      str += category.name + ':';

      for (let color of category.colors) {
        str += color.hex.toString().slice(1, 7);
        str += ',';
      }
      str = str.slice(0, -1);
      str += ';'
    }

    return str.slice(0, -1);
  }
}

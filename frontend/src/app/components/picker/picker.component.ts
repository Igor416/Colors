import { Component, OnInit } from '@angular/core';
import { Color } from '../../Color';
import { IModel, RGB } from '../../Model';
import { IPrimitiveType } from '../../PrimitiveType';
import { ColorsService } from '../../services/colors/colors.service';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.css']
})
export class PickerComponent implements OnInit {
  picked_color!: Color;
  picked_model!: IModel;

  constructor(private colors: ColorsService) { }

  ngOnInit(): void {
    this.picked_color = this.colors.loadColor('picked_color');
    this.picked_model = this.picked_color.hsl;
  }

  representColor(): string {
    this.picked_color.update();
    this.colors.saveColor('picked_color', this.picked_color);
    return `hsl(${this.picked_color.hsl.toString()})`;
  }

  invertColor(): void {
    this.picked_color = this.picked_color.invert();
  }

  getInvertedColor(): string {
    let model = this.picked_color.semiInvert().hsl;
    return `hsl(${model.toString()})`;
  }

  getModelByName(name: string): IModel {
    return this.picked_color.get(name) as IModel;
  }

  getFieldByName(model: string, name: string): IPrimitiveType {
    let Model = this.getModelByName(model);
    let value = Model.get(name);
    return value as IPrimitiveType;
  }

  getModelsOrder(): string[] {
    let order = this.picked_color.models;
    let selected = this.picked_model.name;
    let i;
    for (i = 0; i < order.length; i++) {
      if (order[i] == selected) {
        break;
      }
    }
    order.splice(i, 1);
    order.unshift(selected);

    return order;
  }
}

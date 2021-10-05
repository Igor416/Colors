import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorHelpComponent } from './calculator-help.component';

describe('CalculatorHelpComponent', () => {
  let component: CalculatorHelpComponent;
  let fixture: ComponentFixture<CalculatorHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

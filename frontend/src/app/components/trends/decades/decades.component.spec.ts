import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecadesComponent } from './decades.component';

describe('DecadesComponent', () => {
  let component: DecadesComponent;
  let fixture: ComponentFixture<DecadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

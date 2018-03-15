import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoServiciosIniComponent } from './pago-servicios-ini.component';

describe('PagoServiciosIniComponent', () => {
  let component: PagoServiciosIniComponent;
  let fixture: ComponentFixture<PagoServiciosIniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoServiciosIniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoServiciosIniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

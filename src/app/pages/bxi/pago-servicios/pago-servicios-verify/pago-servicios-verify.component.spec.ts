import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoServiciosVerifyComponent } from './pago-servicios-verify.component';

describe('PagoServiciosVerifyComponent', () => {
  let component: PagoServiciosVerifyComponent;
  let fixture: ComponentFixture<PagoServiciosVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoServiciosVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoServiciosVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

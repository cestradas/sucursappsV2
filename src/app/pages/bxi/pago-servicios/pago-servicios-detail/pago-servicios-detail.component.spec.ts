import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoServiciosDetailComponent } from './pago-servicios-detail.component';

describe('PagoServiciosDetailComponent', () => {
  let component: PagoServiciosDetailComponent;
  let fixture: ComponentFixture<PagoServiciosDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoServiciosDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoServiciosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

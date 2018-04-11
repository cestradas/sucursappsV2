import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoDatosVerifyComponent } from './mantenimiento-datos-verify.component';

describe('MantenimientoDatosVerifyComponent', () => {
  let component: MantenimientoDatosVerifyComponent;
  let fixture: ComponentFixture<MantenimientoDatosVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoDatosVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoDatosVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

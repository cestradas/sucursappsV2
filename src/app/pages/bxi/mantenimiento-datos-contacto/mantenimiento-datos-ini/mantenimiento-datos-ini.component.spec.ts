import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoDatosIniComponent } from './mantenimiento-datos-ini.component';

describe('MantenimientoDatosIniComponent', () => {
  let component: MantenimientoDatosIniComponent;
  let fixture: ComponentFixture<MantenimientoDatosIniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoDatosIniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoDatosIniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

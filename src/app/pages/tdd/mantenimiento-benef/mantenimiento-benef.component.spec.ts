import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoBenefComponent } from './mantenimiento-benef.component';

describe('MantenimientoBenefComponent', () => {
  let component: MantenimientoBenefComponent;
  let fixture: ComponentFixture<MantenimientoBenefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoBenefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoBenefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

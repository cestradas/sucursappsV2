import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoBenefDetailComponent } from './mantenimiento-benef-detail.component';

describe('MantenimientoBenefDetailComponent', () => {
  let component: MantenimientoBenefDetailComponent;
  let fixture: ComponentFixture<MantenimientoBenefDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoBenefDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoBenefDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

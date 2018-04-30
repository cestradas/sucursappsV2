import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasSpeiDetailComponent } from './transferencias-spei-detail.component';

describe('TransferenciasSpeiDetailComponent', () => {
  let component: TransferenciasSpeiDetailComponent;
  let fixture: ComponentFixture<TransferenciasSpeiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciasSpeiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciasSpeiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

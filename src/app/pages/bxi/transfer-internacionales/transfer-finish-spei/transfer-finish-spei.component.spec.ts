import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFinishSpeiComponent } from './transfer-finish-spei.component';

describe('TransferFinishSpeiComponent', () => {
  let component: TransferFinishSpeiComponent;
  let fixture: ComponentFixture<TransferFinishSpeiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferFinishSpeiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFinishSpeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

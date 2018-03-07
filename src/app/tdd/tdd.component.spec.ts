import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TddComponent } from './tdd.component';

describe('TddComponent', () => {
  let component: TddComponent;
  let fixture: ComponentFixture<TddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoStageComponent} from './info-stage.component';

describe('InfoStageComponent', () => {
  let component: InfoStageComponent;
  let fixture: ComponentFixture<InfoStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoStageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

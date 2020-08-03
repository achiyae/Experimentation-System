import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ParticipantLoginComponent} from './participant-login.component';

describe('HomePageComponent', () => {
  let component: ParticipantLoginComponent;
  let fixture: ComponentFixture<ParticipantLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantLoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

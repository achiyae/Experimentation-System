import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExperimentEnvironmentComponent} from './experiment-environment.component';

describe('ExperimentEnvironmentComponent', () => {
  let component: ExperimentEnvironmentComponent;
  let fixture: ComponentFixture<ExperimentEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExperimentEnvironmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiChoiceQuestionComponent} from './multi-choice-question.component';

describe('AmericainQuestionComponent', () => {
  let component: MultiChoiceQuestionComponent;
  let fixture: ComponentFixture<MultiChoiceQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiChoiceQuestionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChoiceQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

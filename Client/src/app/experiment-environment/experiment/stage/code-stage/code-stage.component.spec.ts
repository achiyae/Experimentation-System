import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CodeStageComponent} from './code-stage.component';

describe('CodeStageComponent', () => {
  let component: CodeStageComponent;
  let fixture: ComponentFixture<CodeStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodeStageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

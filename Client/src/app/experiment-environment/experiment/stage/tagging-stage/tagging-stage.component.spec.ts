import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggingStageComponent } from './tagging-stage.component';

describe('TaggingStageComponent', () => {
  let component: TaggingStageComponent;
  let fixture: ComponentFixture<TaggingStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggingStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggingStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

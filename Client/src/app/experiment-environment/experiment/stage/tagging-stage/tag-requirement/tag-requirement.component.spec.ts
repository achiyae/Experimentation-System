import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRequirementComponent } from './tag-requirement.component';

describe('TagRequirementComponent', () => {
  let component: TagRequirementComponent;
  let fixture: ComponentFixture<TagRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

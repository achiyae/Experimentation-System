import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagementSystemComponent} from './management-system.component';

describe('ManagementSystemComponent', () => {
  let component: ManagementSystemComponent;
  let fixture: ComponentFixture<ManagementSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementSystemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

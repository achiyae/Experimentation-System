import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag, TagBorder} from '../tag.model';

@Component({
  selector: 'app-tag-requirement',
  templateUrl: './tag-requirement.component.html',
  styleUrls: ['./tag-requirement.component.css']
})
export class TagRequirementComponent implements OnInit {
  @Input() requirementNum: number;
  @Input() tagNum: number;
  @Input() tagBorder: TagBorder;
  @Input() tag: Tag;
  @Input() isEditable: boolean;
  from: TagBorder;
  to: TagBorder;
  @Output() tagDone = new EventEmitter<Tag>();
  @Output() tagRemoved = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
    if (this.tag) {
      this.from = this.tag.from;
      this.to = this.tag.to;

    } else {
      this.from = null;
      this.to = null;
    }
  }

  emitTag() {
    this.tagDone.emit(new Tag(this.from, this.to));
  }

  onSetStart() {
    if (this.to !== null && !TagBorder.greaterThan(this.to, this.tagBorder)) {
      alert('Start must be before end');
      return;
    }
    this.from = this.tagBorder.clone();
    this.emitTag();
  }

  onSetEnd() {
    if (this.from !== null && !TagBorder.greaterThan(this.tagBorder, this.from)) {
      alert('End must be after start');
      return;
    }
    this.to = this.tagBorder.clone();
    this.emitTag();
  }

  onResetStart() {
    this.from = null;
    this.emitTag();
  }

  onResetEnd() {
    this.to = null;
    this.emitTag();
  }

  onRemoveTag() {
    this.tagRemoved.emit();
  }
}

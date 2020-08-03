import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExperimentService} from '../experiment.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() stageNum: number;
  @Input() accessCode: string;
  @Output() previousStage = new EventEmitter<void>();
  @Output() nextStage = new EventEmitter<void>();
  @Output() submitStage = new EventEmitter<void>();

  constructor(private experimentService: ExperimentService) {
  }

  ngOnInit(): void {
  }

  isFirstStage() {
    return +this.stageNum === 1;
  }

  onNext() {
    this.nextStage.emit();
  }

  onPrevious() {
    this.previousStage.emit();
  }

  onSubmit() {
    this.submitStage.emit();
  }

  isCurrentStage() {
    return +this.stageNum === this.experimentService.getMaxStageNum &&
      !this.experimentService.isComplete;
  }

  isFinalStage() {
    return this.experimentService.isComplete &&
      this.experimentService.stages.length === +this.stageNum;
  }
}

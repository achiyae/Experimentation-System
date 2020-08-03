import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ordinalSuffix} from '../../../shared/util';
import {ExperimentService} from '../experiment.service';
import {Subscription} from 'rxjs';
import {Stage} from './stage.model';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, OnDestroy {
  @Input() stageNum: number;
  numOrdinal: string;
  stage: Stage;
  stageNumSub: Subscription;
  stageType: string;

  constructor(private experimentService: ExperimentService) {
  }

  ngOnInit(): void {
    this.stage = this.experimentService.getStage(this.stageNum);
    this.stageType = this.stage.getType();
    this.numOrdinal = ordinalSuffix(this.stageNum);
    this.stageNumSub = this.experimentService.stageNumSubject.subscribe(stageNum => {
      this.stage = this.experimentService.getStage(stageNum);
      this.stageType = this.stage.getType();
      this.numOrdinal = ordinalSuffix(stageNum);
    });
  }

  ngOnDestroy(): void {
    this.stageNumSub.unsubscribe();
  }

  isInfoStage() {
    return this.stageType === 'Info';
  }

  isQuestionnaireStage() {
    return this.stageType === 'Questionnaire';
  }

  isCodeStage() {
    return this.stageType === 'Code';
  }

  isTagging() {
    return this.stageType === 'Tag';
  }

  isComplete() {
    return false;
  }
}

import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {OpenQuestion} from '../../question.model';
import {ExperimentService} from '../../../../experiment.service';
import {QuestionnaireStage} from '../../../stage.model';

@Component({
  selector: 'app-open-question',
  templateUrl: './open-question.component.html',
  styleUrls: ['./open-question.component.css']
})
export class OpenQuestionComponent implements OnInit, DoCheck {
  @Input() stage: QuestionnaireStage;
  @Input() questionIndex: number;
  question: OpenQuestion;
  answer: string;

  constructor(private experimentService: ExperimentService) {
  }

  ngOnInit(): void {
    this.question = this.stage.getQuestion(this.questionIndex);
    this.answer = this.stage.getAnswer(this.questionIndex);
  }

  ngDoCheck(): void {
    if (this.answer) {
      this.stage.answers[this.questionIndex] = this.answer;
    }
  }

  isEditable() {
    return this.experimentService.isStageEditable(this.stage);
  }
}

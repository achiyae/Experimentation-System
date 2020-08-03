import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {QuestionnaireStage} from '../../../stage.model';
import {MultiChoiceQuestion} from '../../question.model';
import {ExperimentService} from '../../../../experiment.service';

@Component({
  selector: 'app-multi-choice-question',
  templateUrl: './multi-choice-question.component.html',
  styleUrls: ['./multi-choice-question.component.css']
})
export class MultiChoiceQuestionComponent implements OnInit, DoCheck {
  @Input() stage: QuestionnaireStage;
  @Input() questionIndex: number;
  question: MultiChoiceQuestion;
  answer: string;

  constructor(private experimentService: ExperimentService) {
  }

  ngOnInit(): void {
    this.question = this.stage.getQuestion(this.questionIndex) as MultiChoiceQuestion;
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

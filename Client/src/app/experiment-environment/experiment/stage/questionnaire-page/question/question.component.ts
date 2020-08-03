import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../question.model';
import {QuestionnaireStage} from '../../stage.model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() stage: QuestionnaireStage;
  @Input() questionIndex: number;
  question: Question;

  constructor() {
  }

  ngOnInit(): void {
    this.question = this.stage.getQuestion(this.questionIndex);
  }

  isOpen() {
    return this.question.getType() === 'Open';
  }

  isMultiChoice() {
    return this.question.getType() === 'MultiChoice';
  }
}

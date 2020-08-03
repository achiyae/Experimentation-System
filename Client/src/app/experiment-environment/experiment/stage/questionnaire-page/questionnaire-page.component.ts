import {Component, Input, OnInit} from '@angular/core';
import {QuestionnaireStage} from '../stage.model';

@Component({
  selector: 'app-questionnaire-page',
  templateUrl: './questionnaire-page.component.html',
  styleUrls: ['./questionnaire-page.component.css']
})
export class QuestionnairePageComponent implements OnInit {
  @Input() stage: QuestionnaireStage;

  constructor() {
  }

  ngOnInit(): void {
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {InfoStage} from '../stage.model';

@Component({
  selector: 'app-info-stage',
  templateUrl: './info-stage.component.html',
  styleUrls: ['./info-stage.component.css']
})
export class InfoStageComponent implements OnInit {
  @Input() stage: InfoStage;

  constructor() {
  }

  ngOnInit(): void {
  }
}

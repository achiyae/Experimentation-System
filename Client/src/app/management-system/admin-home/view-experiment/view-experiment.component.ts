import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Experiment} from '../../shared/experiment.model';
import {ManageableExperimentsService} from '../../manageable-experiments.service';
import {Stage} from '../../../experiment-environment/experiment/stage/stage.model';

@Component({
  selector: 'app-view-experiment',
  templateUrl: './view-experiment.component.html',
  styleUrls: ['./view-experiment.component.css']
})
export class ViewExperimentComponent implements OnInit {
  emails = '';
  experiment: Experiment;
  experimentees: { email: string, accessCode: string, isComplete: boolean }[] = [];

  constructor(private route: ActivatedRoute, private experimentService: ManageableExperimentsService) {
  }

  ngOnInit(): void {
    this.experiment = this.experimentService.getExperiment(this.route.snapshot.params.expName);
    this.experimentService.getExperimentees(this.experiment, response => {
      this.experimentees = response.experimentees.slice();
    });
  }

  onGenerateCodes() {
    this.experimentService.generateCodes(this.experiment, this.emails, response => {
      const emails: string[] = response.emails;
      const accessCodes: string[] = response.accessCodes;
      for (let i = 0; i < accessCodes.length; i++) {
        this.experimentees.push({
          email: emails[i],
          accessCode: accessCodes[i],
          isComplete: false
        });
      }
    });
  }

  getStageDescription(stage: Stage) {
    return stage.getDescription();
  }
}

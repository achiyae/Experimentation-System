import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../participant-login/user.service';
import {ExperimentService} from './experiment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit, OnDestroy {
  accessCode: string;
  expName: string;
  stageNum: number;
  maxStageNum: number;
  currStageSub: Subscription;

  constructor(private userService: UserService,
              private experimentService: ExperimentService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accessCode = params.accessCode;
      this.stageNum = params.stageNum;
      this.experimentService.setCurrentStageNum = this.stageNum;
    });
    this.expName = this.experimentService.getName;
    this.maxStageNum = this.experimentService.getMaxStageNum;
    this.currStageSub = this.experimentService.stageNumSubject.subscribe(stageNum => {
      this.router.navigate(['..', stageNum],
        {relativeTo: this.route}).then();
    });
  }

  onPrevious() {
    this.experimentService.navigateToPreviousStage();
  }

  onNext() {
    this.experimentService.navigateToNextStage();
  }

  onSubmit() {
    if (!this.experimentService.isDataValid()) {
      alert('Invalid result');
      return;
    }
    if (this.experimentService.isCurrentStageInfo() || confirm('Are you sure to submit this stage?')) {
      this.experimentService.submitStage(this.accessCode);
    }
  }

  ngOnDestroy(): void {
    this.currStageSub.unsubscribe();
  }
}

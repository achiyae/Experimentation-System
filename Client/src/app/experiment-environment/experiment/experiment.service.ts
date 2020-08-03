import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {CodeStage, InfoStage, Stage, StageData, TagStage} from './stage/stage.model';
import {ExperimentData} from '../../management-system/shared/experiment.model';
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class ExperimentService {
  name: string;
  stages: Stage[];
  currentStageNum: number;
  isComplete = false;
  stageNumSubject = new Subject<number>();
  stageNumPromiseSub: Subscription;
  stageFetchedPromise: Promise<boolean>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.stageFetchedPromise = new Promise<boolean>(resolve => {
      this.stageNumPromiseSub = this.stageNumSubject.subscribe(stageNum => {
        resolve(stageNum !== undefined && stageNum !== null);
        this.stageNumPromiseSub.unsubscribe();
      }, error => {
        resolve(false);
        this.stageNumPromiseSub.unsubscribe();
      });
    });
  }

  get getName() {
    return this.name;
  }

  get getMaxStageNum() {
    return this.stages.length;
  }

  get getCurrentStageNum() {
    return this.currentStageNum;
  }

  set setCurrentStageNum(value: number) {
    this.currentStageNum = +value;
  }

  getStage(stageNum: number) {
    return this.stages[stageNum - 1];
  }

  get getCurrentStage() {
    return this.getStage(this.getCurrentStageNum);
  }

  navigateToPreviousStage() {
    this.currentStageNum--;
    this.stageNumSubject.next(this.currentStageNum);
  }

  navigateToNextStage() {
    this.currentStageNum++;
    this.stageNumSubject.next(this.currentStageNum);
  }

  fetchStages(accessCode: string) {
    const url = environment.serverUrl + 'getStages/' + accessCode;
    this.http.get<ExperimentData>(url).pipe(map(response => {
      this.name = response.expName;
      const stages = [];
      let i = 1;
      for (const stage of response.stages) {
        const s = Stage.buildStageFromResponse(stage.type, stage.stage, stage.result, i++, stage.editable);
        stages.push(s);
      }
      this.isComplete = response.isComplete;
      return stages;
    }), tap(response => {
      this.stages = response;
      this.currentStageNum = response.length;
    })).subscribe(response => {
      this.stageNumSubject.next(this.currentStageNum);
    }, error => {
    });
  }

  private isSubmitLegal(): string {
    let errorMessage = '';
    if (this.currentStageNum !== this.getMaxStageNum) {
      errorMessage = 'Submit non current stage';
    } else if (this.isComplete) {
      errorMessage = 'Submit complete experiment';
    }
    return errorMessage;
  }

  submitStage(accessCode: string) {
    const errorMessage = this.isSubmitLegal();
    if (errorMessage !== '') {
      return;
    }
    const data = this.getCurrentStage.getSubmitData();
    const url = environment.serverUrl + 'submitStage/' + accessCode;
    const body = {data};
    type ResponseType = {
      type: string,
      stage: StageData,
      editable?: boolean
    };
    this.http.post<ResponseType>(url, body).pipe(map(response => {
      return response;
    })).subscribe(response => {
      if (response.type === 'complete') {
        this.isComplete = true;
        this.router.navigate(['/exp', accessCode, 'complete']).then();
        return;
      }
      const s = Stage.buildStageFromResponse(response.type,
        response.stage,
        null,
        this.currentStageNum + 1,
        response.editable);
      this.stages.push(s);
      this.currentStageNum++;
      this.stageNumSubject.next(this.currentStageNum);
    });
  }

  isCurrentStageInfo() {
    return this.getCurrentStage instanceof InfoStage;
  }

  isStageEditable(stage: Stage) {
    return !this.isComplete && (stage.editable || (stage.index === this.getMaxStageNum));
  }

  matchTagWithCode(stage: TagStage) {
    const s: Stage = this.getStage(stage.codeStageIndex);
    if (s instanceof CodeStage) {
      stage.codeStage = s;
    } else {
      throw new DOMException('What');
    }
  }

  isDataValid() {
    return this.getCurrentStage.isDataValid();
  }
}

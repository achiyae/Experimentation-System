import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {ExperimentService} from '../experiment/experiment.service';
import {tap} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class UserService {
  loginSubject = new Subject<boolean>();
  loginErrorSubject = new Subject<string>();
  private accessCode: string = null;

  constructor(private http: HttpClient,
              private router: Router,
              private experimentService: ExperimentService) {
  }

  get getAccessCode() {
    return this.accessCode;
  }

  get getMaxStage() {
    return this.experimentService.getMaxStageNum;
  }

  get isLoggedIn() {
    return this.accessCode !== null;
  }

  // Access code validator
  legalAccessCode(control: FormControl): { [s: string]: boolean } {
    const error = {codeIsIllegal: true};
    const accessCode: string = control.value;
    if (accessCode === null) {
      return error;
    }
    const UUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isLegal = UUIDRegex.test(control.value); // TODO: replace this with access code checker
    return !isLegal ? error : null;
  }

  logIn(accessCode: string) {
    if (this.isLoggedIn) {
      return;
    }
    const url = environment.serverUrl + 'login';
    this.http.post<boolean>(url, accessCode).pipe(tap(isValidLogin => {
      if (isValidLogin) {
        this.accessCode = accessCode;
        this.experimentService.fetchStages(accessCode);
      }
    })).subscribe(isValidLogin => {
      this.loginSubject.next(isValidLogin);
    }, error => {
      this.loginErrorSubject.next(error.message);
    });
  }

  navigateToExperiment() {
    if (!this.isLoggedIn) {
      return;
    }
    this.router.navigate(['/exp',
      this.accessCode]).then();
  }
}

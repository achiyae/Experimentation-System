import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Experiment, ExperimentData, isExperiment} from './shared/experiment.model';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CodeStage} from '../experiment-environment/experiment/stage/stage.model';
import {environment} from "../../environments/environment";


@Injectable({providedIn: 'root'})
export class ManageableExperimentsService {
  experimentsSubject = new Subject<Experiment[]>();
  private experiments: Experiment[] = [];
  private username: string;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  get getExperiments() {
    return this.experiments.slice();
  }

  fetchExperiments(username: string) {
    const url = environment.serverUrl + 'admin/getExperiments/' + username;
    this.http.get<{ experiments: ExperimentData[] }>(url).pipe(map(response => {
      const experiments: Experiment[] = [];
      for (const exp of response.experiments) {
        experiments.push(Experiment.buildExperiment(exp));
      }
      return experiments;
    })).subscribe(experiments => {
      this.experiments = experiments.slice();
      this.experimentsSubject.next(experiments);
    });
  }

  createExperiment(expStr: string, languages: string[]): string {
    let expData: ExperimentData;
    try {
      expData = JSON.parse(expStr);
    } catch (e) {
      return 'Invalid JSON';
    }
    const error = isExperiment(expData);
    if (error !== null) {
      return error;
    }
    const exp: Experiment = this.parseExperiment(expData);
    for (const stage of exp.stages) {
      if (stage.getType() === 'Code') {
        if (!languages.includes((stage as CodeStage).language)) {
          return 'Illegal programming language, choose from list';
        }
      }
    }
    if (this.exists(exp)) {
      return 'You already have an experiment with this name';
    }
    const url = environment.serverUrl + 'admin/addExperiment/' + this.username;
    const body = expData;
    this.http.post<{ response: string }>(url, body).subscribe(response => {
      this.addExperiment(exp);
      this.router.navigate(['/admin', 'admin-home']).then();
    });
    return null;
  }

  addExperiment(exp: Experiment) {
    this.experiments.push(exp);
  }

  parseExperiment(exp: ExperimentData) {
    return Experiment.buildExperiment(exp);
  }

  exists(exp: Experiment) {
    for (const e of this.experiments) {
      if (exp.name === e.name) {
        return true;
      }
    }
    return false;
  }

  getExperiment(expName: string): Experiment {
    for (const exp of this.experiments) {
      if (exp.name === expName) {
        return exp;
      }
    }
    return null;
  }

  setUsername(username: string) {
    this.username = username;
  }

  generateCodes(experiment: Experiment, emailsStr: string, continuation) {
    const emails: string[] = emailsStr.split(',');
    if (emails.length === 1 && emails[0] === '') {
      alert('Please enter experimentees emails to generate codes');
      return;
    }
    const parsedEmails: string[] = [];
    for (const email of emails) {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const parsedEmail = email.toLowerCase().trim();
      if (!emailRegex.test(parsedEmail)) {
        alert(email + ' is an invalid email');
        return;
      }
      parsedEmails.push(parsedEmail);
    }
    const url = environment.serverUrl + 'admin/addExperimentees/' + this.username + '/' + experiment.name;
    const body = {
      emails
    };
    this.http.post<{ accessCodes: string[] }>(url, body).pipe(map(response => {
        return {
          emails,
          accessCodes: response.accessCodes
        };
      }
    )).subscribe(continuation);
  }

  getExperimentees(experiment: Experiment, cont: (response) => void) {
    const url = environment.serverUrl + 'admin/getExperimentees/' + this.username + '/' + experiment.name;
    this.http.get<{
      experimentees: {
        email: string,
        accessCode: string,
        isComplete: boolean
      }[]
    }>(url).subscribe(cont);
  }
}

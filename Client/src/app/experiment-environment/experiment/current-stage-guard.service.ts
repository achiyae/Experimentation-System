import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserService} from '../participant-login/user.service';
import {ExperimentService} from './experiment.service';

@Injectable({providedIn: 'root'})
export class CurrentStageGuard implements CanActivate {

  constructor(private userService: UserService,
              private experimentService: ExperimentService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const accessCode = route.params.accessCode;
    const routerStageNum: number = !!route.firstChild ?
      route.firstChild.params.stageNum : undefined;
    return this.experimentService.stageFetchedPromise.then(isStageFetched => {
      if (!!routerStageNum) {
        return true;
      }
      return this.router.createUrlTree(['/exp',
        accessCode,
        'stage',
        this.experimentService.getCurrentStageNum]);
    });
  }
}

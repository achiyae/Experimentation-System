import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService} from '../../participant-login/user.service';
import {ExperimentService} from '../experiment.service';

@Injectable({providedIn: 'root'})
export class ValidStageGuard implements CanActivate {

  constructor(private userService: UserService,
              private experimentService: ExperimentService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routerStageNum: number = +route.params.stageNum;
    const accessCode: string = route.params.accessCode;
    if (routerStageNum < 1 || routerStageNum > this.experimentService.getMaxStageNum) {
      alert('You have not reached this stage!');
      this.router.navigate(['/exp', accessCode, 'stage', this.experimentService.getCurrentStageNum]).then();
    }
    return true;
  }

}

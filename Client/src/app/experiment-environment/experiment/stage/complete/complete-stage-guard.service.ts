import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ExperimentService} from '../../experiment.service';


@Injectable({providedIn: 'root'})
export class CompleteStageGuard implements CanActivate {
  constructor(private experimentService: ExperimentService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const accessCode: string = route.params.accessCode;
    if (!this.experimentService.isComplete) {
      this.router.navigate(['/exp', accessCode]).then();
      return false;
    }
    return true;
  }
}

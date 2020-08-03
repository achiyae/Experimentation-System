import {RouterModule, Routes} from '@angular/router';
import {ErrorComponent} from './experiment-environment/error/error.component';
import {NgModule} from '@angular/core';
import {ParticipantLoginComponent} from './experiment-environment/participant-login/participant-login.component';
import {ExperimentComponent} from './experiment-environment/experiment/experiment.component';
import {CurrentStageGuard} from './experiment-environment/experiment/current-stage-guard.service';
import {NotLoggedInGuard} from './experiment-environment/participant-login/not-logged-in-guard.service';
import {LoggedInGuard} from './experiment-environment/experiment/logged-in-guard.service';
import {ValidStageGuard} from './experiment-environment/experiment/stage/valid-stage-guard.service';
import {ManagementSystemComponent} from './management-system/management-system.component';
import {ExperimentEnvironmentComponent} from './experiment-environment/experiment-environment.component';
import {AdminLoginComponent} from './management-system/admin-login/admin-login.component';
import {AdminHomeComponent} from './management-system/admin-home/admin-home.component';
import {TempGuard} from './management-system/admin-home/admin-logged-in-guard.service';
import {AddExperimentComponent} from './management-system/admin-home/add-experiment/add-experiment.component';
import {CompleteComponent} from './experiment-environment/experiment/stage/complete/complete.component';
import {CompleteStageGuard} from './experiment-environment/experiment/stage/complete/complete-stage-guard.service';
import {ViewExperimentComponent} from './management-system/admin-home/view-experiment/view-experiment.component';

const appRoutes: Routes = [
  {
    path: 'admin', component: ManagementSystemComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: AdminLoginComponent},
      {path: 'admin-home', canActivate: [TempGuard], component: AdminHomeComponent},
      {path: 'add', canActivate: [TempGuard], component: AddExperimentComponent},
      {path: 'view-experiment/:expName', canActivate: [TempGuard], component: ViewExperimentComponent},
    ]
  },
  {
    path: '', component: ExperimentEnvironmentComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', canActivate: [NotLoggedInGuard], component: ParticipantLoginComponent},
      {
        path: 'exp/:accessCode',
        canActivate: [LoggedInGuard, CurrentStageGuard],
        children: [
          {
            path: 'stage/:stageNum',
            canActivate: [ValidStageGuard],
            component: ExperimentComponent,
          },
          {path: 'complete', canActivate: [CompleteStageGuard], component: CompleteComponent}
        ]
      },
      {path: 'error', component: ErrorComponent},
      {path: '**', redirectTo: '/error'},
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

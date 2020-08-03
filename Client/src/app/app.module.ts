import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ParticipantLoginComponent} from './experiment-environment/participant-login/participant-login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExperimentComponent} from './experiment-environment/experiment/experiment.component';
import {StageComponent} from './experiment-environment/experiment/stage/stage.component';
import {InfoStageComponent} from './experiment-environment/experiment/stage/info-stage/info-stage.component';
import {ErrorComponent} from './experiment-environment/error/error.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {FooterComponent} from './experiment-environment/experiment/footer/footer.component';
import {CompleteComponent} from './experiment-environment/experiment/stage/complete/complete.component';
import {CodeStageComponent} from './experiment-environment/experiment/stage/code-stage/code-stage.component';
import {QuestionnairePageComponent} from './experiment-environment/experiment/stage/questionnaire-page/questionnaire-page.component';
import {ManagementSystemComponent} from './management-system/management-system.component';
import {ExperimentEnvironmentComponent} from './experiment-environment/experiment-environment.component';
import {AdminLoginComponent} from './management-system/admin-login/admin-login.component';
import {AdminHomeComponent} from './management-system/admin-home/admin-home.component';
import {OpenQuestionComponent} from './experiment-environment/experiment/stage/questionnaire-page/question/open-question/open-question.component';
import {QuestionComponent} from './experiment-environment/experiment/stage/questionnaire-page/question/question.component';
import {MultiChoiceQuestionComponent} from './experiment-environment/experiment/stage/questionnaire-page/question/multi-choice-question/multi-choice-question.component';
import {TaggingStageComponent} from './experiment-environment/experiment/stage/tagging-stage/tagging-stage.component';
import {TagRequirementComponent} from './experiment-environment/experiment/stage/tagging-stage/tag-requirement/tag-requirement.component';
import {AddExperimentComponent} from './management-system/admin-home/add-experiment/add-experiment.component';
import {NgJsonEditorModule} from 'ang-jsoneditor';
import {ViewExperimentComponent} from './management-system/admin-home/view-experiment/view-experiment.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    AppComponent,
    ParticipantLoginComponent,
    ExperimentComponent,
    StageComponent,
    InfoStageComponent,
    ErrorComponent,
    FooterComponent,
    CompleteComponent,
    CodeStageComponent,
    QuestionnairePageComponent,
    ManagementSystemComponent,
    ExperimentEnvironmentComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    OpenQuestionComponent,
    QuestionComponent,
    MultiChoiceQuestionComponent,
    TaggingStageComponent,
    TagRequirementComponent,
    AddExperimentComponent,
    ViewExperimentComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgJsonEditorModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatInputModule,
        ClipboardModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

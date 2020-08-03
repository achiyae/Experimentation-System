import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ManageableExperimentsService} from '../manageable-experiments.service';
import {Subscription} from 'rxjs';
import {Experiment} from '../shared/experiment.model';
import {AdminService} from '../shared/admin.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  experiments: Experiment[] = [];
  private experimentSub: Subscription;

  constructor(private experimentsService: ManageableExperimentsService, private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.experiments = this.experimentsService.getExperiments;
    this.experimentSub = this.experimentsService.experimentsSubject.subscribe(stages => {
      this.experiments = stages.slice();
    });
  }

  ngOnDestroy(): void {
    this.experimentSub.unsubscribe();
  }

  onAddAdmin(f: NgForm) {
    const formControls = f.form.controls;
    this.adminService.addAdmin(formControls.email.value, formControls.password.value, response => {
    });
  }
}

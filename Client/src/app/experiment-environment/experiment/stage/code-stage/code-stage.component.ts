import {AfterViewInit, Component, DoCheck, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CodeStage} from '../stage.model';

import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/webpack-resolver';
import {ExperimentService} from '../../experiment.service';
import {aceMap, CodeService} from './code.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-code-stage',
  templateUrl: './code-stage.component.html',
  styleUrls: ['./code-stage.component.css']
})
export class CodeStageComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  @Input() stage: CodeStage;
  @ViewChild('codeEditor') codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
  row = 1;
  col = 0;
  runningSub: Subscription;
  stdout = '';

  constructor(private experimentService: ExperimentService,
              private codeService: CodeService) {
  }

  ngOnInit(): void {
    this.runningSub = this.codeService.runningSubject.subscribe(response => {
      this.stdout = response.stdout;
    });
  }

  ngAfterViewInit(): void {
    this.codeService.aceRequires();
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.codeService.getEditorOptions();
    this.codeEditor = this.codeService.createCodeEditor(element, editorOptions, this.stage.language);
    this.setContent(this.stage.code);
    this.codeEditor.setReadOnly(!this.experimentService.isStageEditable(this.stage));
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.codeEditor.getSelection().on('changeCursor', () => {
      this.setCurrPos();
    });
  }

  public getContent() {
    if (this.codeEditor) {
      return this.codeEditor.getValue();
    }
    return '';
  }

  public setContent(content: string): void {
    if (this.codeEditor) {
      this.codeEditor.setValue(content);
    }
  }

  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
      const session = this.codeEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  public OnContentChange(callback: (content: string, delta: ace.Ace.Delta) => void): void {
    this.codeEditor.on('change', (delta) => {
      const content = this.codeEditor.getValue();
      callback(content, delta);
    });
  }

  ngDoCheck(): void {
    if (!this.codeEditor || !this.stage) {
      return;
    }
    if (this.getContent() !== undefined && this.getContent() !== null) {
      this.stage.code = this.getContent();
    }
  }

  onReset() {
    if (confirm('Are you sure you want to reset your code to the template?')) {
      this.setContent(this.stage.template);
    }
  }

  onRun() {
    this.codeService.runCode(this.getContent(), this.stage.language);
  }

  public setCurrPos() {
    this.row = this.codeEditor.getCursorPosition().row + 1;
    this.col = this.codeEditor.getCursorPosition().column;
  }

  ngOnDestroy(): void {
    this.runningSub.unsubscribe();
  }

  isEditable() {
    return this.experimentService.isStageEditable(this.stage);
  }

  onClearStdout() {
    this.stdout = '';
  }
}

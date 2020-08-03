import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import {ExperimentData} from '../../shared/experiment.model';
import {Router} from '@angular/router';
import {ManageableExperimentsService} from '../../manageable-experiments.service';
import {CodeService} from '../../../experiment-environment/experiment/stage/code-stage/code.service';

const THEME = 'ace/theme/github';
const EXAMPLE_EXP: ExperimentData = {
  expName: 'My Experiment',
  stages: [
    {
      type: 'info',
      stage: {
        text: 'This is an example of info to put on an info stage'
      }
    },
    {
      type: 'questionnaire',
      stage: {
        questions: [
          {
            question: 'How are you today?',
            questionType: 'open'
          },
          {
            question: 'How do you like your meat?',
            questionType: 'multiChoice',
            possibleAnswers: [
              'Raw',
              'Medium well',
              'Well done'
            ]
          }
        ]
      }
    },
    {
      type: 'code',
      stage: {
        template: 'import x from y;',
        language: 'java',
        description: 'Write an impressive ascii art',
        requirements: [
          'It needs to be 5 lines long',
          'It needs to have Spongebob there'
        ]
      }
    },
    {
      type: 'tag',
      stage: {
        codeStageIndex: 3
      }
    },
  ]
};

@Component({
  selector: 'app-add-experiment',
  templateUrl: './add-experiment.component.html',
  styleUrls: ['./add-experiment.component.css']
})
export class AddExperimentComponent implements OnInit, AfterViewInit {
  @ViewChild('codeEditor') codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
  errorMessage = '';
  languages: string[] = [];
  totalPages: number;
  currPageNum = 1;
  pageArr: number[] = [1];


  constructor(private experimentService: ManageableExperimentsService, private codeService: CodeService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.codeService.getLanguages((languages: { id: number, name: string }[]) => {
      for (const lang of languages) {
        this.languages.push(lang.name);
      }
      this.totalPages = (languages.length / 5) + 1;
      this.pageArr = [];
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageArr.push(i);
      }
    });
  }

  ngAfterViewInit(): void {
    this.codeService.aceRequires();
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.codeService.getEditorOptions();
    this.codeEditor = this.createCodeEditor(element, editorOptions);
    this.setToExample();
    this.editorBeautify = ace.require('ace/ext/beautify');
  }

  setToExample() {
    this.codeEditor.setValue(JSON.stringify(EXAMPLE_EXP, null, '\t'));
  }

  private createCodeEditor(element: Element, options: any): ace.Ace.Editor {
    const editor = ace.edit(element, options);
    editor.setTheme(THEME);
    editor.getSession().setMode('ace/mode/json');
    editor.setShowFoldWidgets(true);
    return editor;
  }

  onReset() {
    if (confirm('Are you sure you want to clear your experiment')) {
      this.setToExample();
    }
  }

  getContent() {
    if (this.codeEditor) {
      return this.codeEditor.getValue();
    }
    return '';
  }

  onCreate() {
    const err = this.experimentService.createExperiment(this.getContent(), this.languages);
    if (err !== null) {
      this.errorMessage = err;
    }
  }

  pageRange(languages: string[]) {
    return this.languages.slice((this.currPageNum - 1) * 5, this.currPageNum * 5 );
  }

  onChangePage(i: number) {
    this.currPageNum = i;
  }
}

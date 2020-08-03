import {AfterViewInit, Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CodeStage, TagStage} from '../stage.model';
import * as ace from 'ace-builds';
import {CodeService} from '../code-stage/code.service';
import {ExperimentService} from '../../experiment.service';
import {Tag, TagBorder} from './tag.model';


@Component({
  selector: 'app-tagging-stage',
  templateUrl: './tagging-stage.component.html',
  styleUrls: ['./tagging-stage.component.css']
})
export class TaggingStageComponent implements OnInit, AfterViewInit, DoCheck {
  @ViewChild('codeEditor') codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
  b: TagBorder = new TagBorder(1, 0);
  @Input() stage: TagStage;
  codeStage: CodeStage;
  tags: Tag[][];

  constructor(private codeService: CodeService, private experimentService: ExperimentService) {
  }

  ngOnInit(): void {
    this.experimentService.matchTagWithCode(this.stage);
    this.codeStage = this.stage.codeStage;
    if (!this.stage.tags) {
      this.stage.tags = [];
      for (const req of this.codeStage.requirements) {
        this.stage.tags.push([new Tag(null, null)]);
      }
    }
    this.tags = this.stage.tags.slice();
  }

  ngAfterViewInit(): void {
    this.codeService.aceRequires();
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.codeService.getEditorOptions();
    this.codeEditor = this.codeService.createCodeEditor(element, editorOptions, this.codeStage.language);
    this.setContent(this.codeStage.code);
    this.codeEditor.setReadOnly(true);
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.codeEditor.getSelection().on('changeCursor', () => {
      this.setCurrPos();
    });
  }

  public setContent(content: string): void {
    if (this.codeEditor) {
      this.codeEditor.setValue(content);
    }
  }

  public setCurrPos() {
    this.b.row = this.codeEditor.getCursorPosition().row + 1;
    this.b.column = this.codeEditor.getCursorPosition().column;
  }

  onTag(tag: Tag, reqIndex: number, tagIndex: number) {
    this.tags[reqIndex][tagIndex] = tag;
  }

  onAddTag(reqIndex: number) {
    this.tags[reqIndex].push(new Tag(null, null));
  }

  OnRemoveTag(reqIndex: number, tagIndex: number) {
    this.tags[reqIndex].splice(tagIndex, 1);
  }

  ngDoCheck(): void {
    if (this.tags) {
      this.stage.tags = this.tags.slice();
    }
  }

  isEditable() {
    return this.experimentService.isStageEditable(this.stage);
  }
}

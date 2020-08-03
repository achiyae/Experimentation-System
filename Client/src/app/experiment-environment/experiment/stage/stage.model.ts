import {MultiChoiceQuestion, OpenQuestion, Question} from './questionnaire-page/question.model';
import {Tag, TagBorder} from './tagging-stage/tag.model';

type InfoData = {
  text: string
};
type QuestionnaireData = {
  questions: {
    question: string,
    questionType: string
    possibleAnswers?: string[]
  }[]
};
type CodeData = {
  template: string,
  language: string,
  description: string,
  requirements: string[]
};
type TagData = {
  codeStageIndex: number
};
export type StageData = InfoData | QuestionnaireData | CodeData | TagData;

function isInfo(stage: StageData): string {
  if (!stage) {
    return 'info error';
  }
  const infoStage = stage as InfoData;
  if (infoStage.text === undefined) {
    return 'No text property';
  }
  if (typeof infoStage.text !== 'string') {
    return 'text property should be string';
  }
  return null;
}

function isQuestionnaire(stage: StageData): string {
  if (!stage) {
    return 'questionnaire error';
  }
  const questionnaireStage = stage as QuestionnaireData;
  if (questionnaireStage.questions === undefined) {
    return 'No questions property';
  }
  for (const q of questionnaireStage.questions) {
    if (q === undefined) {
      return 'A';
    }
    if (q.question === undefined) {
      return 'No question property';
    }
    if (typeof q.question !== 'string') {
      return 'question property should be string';
    }
    if (q.questionType === undefined) {
      return 'No questionType property';
    }
    if (typeof q.questionType !== 'string') {
      return 'questionType property should be string';
    }
    switch (q.questionType) {
      case 'open':
        break;
      case 'multiChoice':
        if (q.possibleAnswers === undefined) {
          return 'No possibleAnswers property';
        }
        for (const answer of q.possibleAnswers) {
          if (answer === undefined) {
            return 'B';
          }
          if (typeof answer !== 'string') {
            return 'answer property should be string';
          }
        }
        break;
      default:
        return 'Question type "' + q.questionType + '" does\'nt exist';
    }
  }
  return null;
}

function isCode(stage: StageData): string {
  if (!stage) {
    return 'code error';
  }
  const codeStage = stage as CodeData;
  if (codeStage.language === undefined) {
    return 'No language property';
  }
  if (typeof codeStage.language !== 'string') {
    return 'language property should be string';
  }
  if (codeStage.template === undefined) {
    return 'No template property';
  }
  if (typeof codeStage.template !== 'string') {
    return 'template property should be string';
  }
  if (codeStage.description === undefined) {
    return 'No description property';
  }
  if (typeof codeStage.description !== 'string') {
    return 'description property should be string';
  }
  if (codeStage.requirements === undefined) {
    return 'No requirements property';
  }
  for (const req of codeStage.requirements) {
    if (typeof req !== 'string') {
      return 'requirements should be string';
    }
  }
  return null;
}

function isTag(stage: StageData): string {
  if (!stage) {
    return 'tag error';
  }
  const tagStage = stage as TagData;
  if (tagStage.codeStageIndex === undefined) {
    return 'No codeStageIndex property';
  }
  if (typeof tagStage.codeStageIndex !== 'number') {
    return 'codeStageIndex property should be number';
  }
  return null;
}

export function isStageData(stage: any, type: string): string {
  if (!stage) {
    return 'stage data error';
  }
  let isChecker: (stage: StageData) => string;
  isChecker = type === 'info' ? isInfo :
    type === 'questionnaire' ? isQuestionnaire :
      type === 'code' ? isCode :
        type === 'tag' ? isTag :
          null;
  if (isChecker === null) {
    return 'Stage type "' + type + '" does\'nt exist';
  }
  return isChecker(stage);
}

type InfoResultData = {};
type QuestionnaireResultData = {
  answers: string[];
};
type CodeResultData = {
  code: string
};
type TagResultData = {
  tags: Tag[][]
};
export type ResultData = InfoResultData | QuestionnaireResultData | CodeResultData | TagResultData;

export abstract class Stage {
  protected constructor(public index: number, public editable: boolean) {
  }

  public static buildStageFromResponse(stageType: string, stage: StageData,
                                       result: ResultData, index: number, editable: boolean): Stage {
    editable = !!editable;
    const stageConstructor: (data: StageData, result: ResultData, index: number, editable: boolean) => Stage =
      stageType === 'info' ? InfoStage.handle :
        stageType === 'questionnaire' ? QuestionnaireStage.handle :
          stageType === 'code' ? CodeStage.handle :
            stageType === 'tag' ? TagStage.handle :
              null;
    return stageConstructor ? stageConstructor(stage, result, index, editable) : null;
  }

  abstract getType(): string;

  abstract getSubmitData();

  abstract getDescription(): string;

  abstract isDataValid(): boolean;
}


export class InfoStage extends Stage {
  public info: string;

  constructor(index: number, editable: boolean, info: string) {
    super(index, editable);
    this.info = info;
  }

  static handle(data: InfoData, result: InfoResultData, index: number, editable: boolean): InfoStage {
    const text = data.text;
    return new InfoStage(index, editable, text);
  }

  getType(): string {
    return 'Info';
  }

  getSubmitData() {
    return {};
  }

  getDescription(): string {
    return 'Info:\n' + this.info;
  }

  isDataValid(): boolean {
    return true;
  }
}


export class QuestionnaireStage extends Stage {

  constructor(index: number, editable: boolean, questions: Question[], answers: string[]) {
    super(index, editable);
    this.questions = questions.slice();
    this.answers = answers.slice();
  }

  public questions: Question[];
  public answers: string[];

  static handle(data: QuestionnaireData, result: QuestionnaireResultData, index: number, editable: boolean): QuestionnaireStage {
    const qs: Question[] = [];
    for (const question of data.questions) {
      const q: Question = question.questionType === 'open' ? new OpenQuestion(question.question) :
        question.questionType === 'multiChoice' ? new MultiChoiceQuestion(question.question, question.possibleAnswers) :
          null;
      qs.push(q);
    }
    const emptyAnswers = [];
    for (const q of qs) {
      emptyAnswers.push('');
    }
    result = !!result ? result : {answers: emptyAnswers};
    return new QuestionnaireStage(index, editable, qs, result.answers);
  }

  getQuestion(index: number) {
    return this.questions[index];
  }

  getAnswer(index: number) {
    return this.answers[index];
  }

  getType(): string {
    return 'Questionnaire';
  }

  getSubmitData() {
    return {
      answers: this.answers.slice()
    };
  }

  getDescription(): string {
    let ret = 'Questions:\n';
    let i = 1;
    for (const q of this.questions) {
      ret += 'Q' + i + ':\n' + q.getDescription() + '\n';
      i++;
    }
    return ret;
  }

  isDataValid(): boolean {
    for (const answer of this.answers) {
      if (!answer || answer === '') {
        return false;
      }
    }
    return true;
  }
}


export class CodeStage extends Stage {
  public template: string;
  public language: string;
  public description: string;
  public requirements: string[];
  public code: string;

  constructor(index: number, editable: boolean,
              template: string, language: string,
              description: string, requirements: string[],
              code: string) {
    super(index, editable);
    this.template = template;
    this.language = language;
    this.description = description;
    this.requirements = requirements.slice();
    this.code = code;
  }

  static handle(data: CodeData, result: CodeResultData, index: number, editable: boolean): CodeStage {
    result = result ? result : {code: data.template};
    return new CodeStage(index,
      editable,
      data.template,
      data.language,
      data.description,
      data.requirements,
      result.code);
  }

  getType(): string {
    return 'Code';
  }

  getSubmitData() {
    return {
      code: this.code
    };
  }

  getDescription(): string {
    let ret = 'Description:\n' + this.description + '\n\nRequirments:';
    for (const req of this.requirements) {
      ret += '\n' + req;
    }
    ret += '\n\nLanguage:\n' + this.language + '\n\nTemplate:\n' + this.template;
    return ret;
  }

  isDataValid(): boolean {
    return this.code && this.code !== '';
  }
}


export class TagStage extends Stage {
  codeStageIndex: number;
  codeStage: CodeStage;
  tags: Tag[][];

  constructor(index: number, editable: boolean,
              codeStageIndex: number, tags: Tag[][]) {
    super(index, editable);
    this.codeStageIndex = codeStageIndex;
    this.tags = tags ? tags.slice() : null;
  }

  static handle(data: TagData, result: TagResultData, index: number, editable: boolean): TagStage {
    console.log(result);
    result = result ? result : {tags: null};
    return new TagStage(index, editable, data.codeStageIndex, result.tags);
  }

  getType(): string {
    return 'Tag';
  }

  getSubmitData() {
    return {
      tags: this.tags
    };
  }

  getDescription(): string {
    return 'Relevant code stage: ' + this.codeStageIndex;
  }

  isDataValid(): boolean {
    for (const tagsOfReq of this.tags) {
      if (!tagsOfReq || tagsOfReq.length === 0) {
        return false;
      }
      for (const tag of tagsOfReq) {
        if (tag.from === null || tag.to === null) {
          return false;
        }
        if (!TagBorder.greaterThan(tag.to, tag.from)) {
          return false;
        }
      }
    }
    return true;
  }
}

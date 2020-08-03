export abstract class Question {
  public question: string;

  protected constructor(question: string) {
    this.question = question;
  }

  abstract getType(): string;

  getDescription() {
    return this.question;
  }
}

export class OpenQuestion extends Question {
  constructor(question: string) {
    super(question);
  }

  getType(): string {
    return 'Open';
  }
}

export class MultiChoiceQuestion extends Question {
  public possibleAnswers: string[];

  constructor(question: string, possibleAnswers: string[]) {
    super(question);
    this.possibleAnswers = possibleAnswers.slice();
  }

  getType(): string {
    return 'MultiChoice';
  }

  getDescription(): string {
    let ret = super.getDescription() + '\nPossible answers:';
    for (const answer of this.possibleAnswers) {
      ret += '\n' + answer;
    }
    return ret;
  }
}

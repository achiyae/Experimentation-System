import {isStageData, ResultData, Stage, StageData} from '../../experiment-environment/experiment/stage/stage.model';

export type ExperimentData = {
  expName: string,
  stages: {
    type: string,
    stage: StageData,
    result?: ResultData,
    editable?: boolean
  }[],
  isComplete?: boolean
};

export function isStage(arg: any): string {
  if (!arg) {
    return 'stage error';
  }
  type CompleteStageData = {
    type: string;
    stage: StageData;
    result?: ResultData;
    editable?: boolean
  };
  const stage: CompleteStageData = arg as CompleteStageData;
  if (stage.type === undefined) {
    return 'No type property';
  }
  if (typeof stage.type !== 'string') {
    return 'expName property should be string';
  }
  if (stage.stage === undefined) {
    return 'No stage property';
  }
  return isStageData(stage.stage, stage.type);
}

export function isExperiment(arg: any): string {
  if (!arg) {
    return 'experiment error';
  }
  const exp: ExperimentData = arg as ExperimentData;
  if (exp.expName === undefined) {
    return 'No expName property';
  }
  if (typeof exp.expName !== 'string') {
    return 'expName property should be string';
  }
  if (exp.stages === undefined) {
    return 'No stages property';
  }
  for (const stage of exp.stages) {
    const x = isStage(stage);
    if (x) {
      return x;
    }
  }
  return null;
}

export class Experiment {
  name: string;
  stages: Stage[];

  constructor(name: string, stages: Stage[]) {
    this.name = name;
    this.stages = stages.slice();
  }

  public static buildExperiment(exp: ExperimentData): Experiment {
    const stages: Stage[] = [];
    let i = 1;
    for (const stage of exp.stages) {
      const s: Stage = Stage.buildStageFromResponse(stage.type, stage.stage, null, i++, false);
      stages.push(s);
    }
    return new Experiment(exp.expName, stages);
  }
}

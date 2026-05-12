export class StrategyParamVo {
  paramId!: number;
  name!: string;
  lightType!: string;
  round!: number;
  duration!: number;
  currentLight!: string;
}

export class StrategyScheduleVo {
  scheduleId!: number;
  scheduleName!: string;
  params!: StrategyParamVo[];
}

export class StrategyTypeVo {
  typeId!: number;
  typeName!: string;
  strategyType!: string;
  scheduleType!: string;
  schedules!: StrategyScheduleVo[];
}

export class StrategyOverviewGroupVo {
  groupId!: number;
  groupName!: string;
  strategyTypes!: StrategyTypeVo[];
}

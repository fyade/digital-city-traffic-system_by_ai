import { base, idUtils, timeUtils } from "@dcts/common";

export class SignalLightRunParamDParam {
  id: string
  start: number
  end: number
  color: base.SignalLightColorEnum
  lightType: base.SLSPLTTypeEnum[]
  // startRndStr: [Date, Date]
  // startRndStr2: [string, string]

  constructor(start?: number, end?: number, color?: base.SignalLightColorEnum, lightType?: base.SLSPLTTypeEnum[]) {
    this.id = idUtils.genId()
    this.start = start;
    this.end = end;
    this.color = color;
    this.lightType = lightType;
    // this.startRndStr = [new Date(start), new Date(end)]
    // this.startRndStr2 = [timeUtils.formatDate(this.startRndStr[0]), timeUtils.formatDate(this.startRndStr[1])]
  }
}

export class SignalLightRunParam {
  signalLightGroupId: number
  signalLightChildId: number
  runParam: SignalLightRunParamDParam[]
}

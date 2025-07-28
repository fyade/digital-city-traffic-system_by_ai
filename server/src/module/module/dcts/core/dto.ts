import { base } from "@dcts/common";
import { SignalLightColorEnum, SLSPLTTypeEnum } from "@dcts/common/dist/util/base";

export class SignalLightRunParam {
  signalLightGroupId: number
  signalLightChildId: number
  runParam: SignalLightRunParamDParam[]
}

export class SignalLightRunParamDParam {
  start: number
  end: number
  color: base.SignalLightColorEnum
  lightType: base.SLSPLTTypeEnum[]

  constructor(start?: number, end?: number, color?: SignalLightColorEnum, lightType?: SLSPLTTypeEnum[]) {
    this.start = start;
    this.end = end;
    this.color = color;
    this.lightType = lightType;
  }
}

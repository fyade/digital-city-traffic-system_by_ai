import { base } from "@dcts/common";

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
}

import { SignalLightColorEnum, SLSPLTTypeEnum } from "../../../../util/base";

export class SignalLightRunParam {
  signalLightGroupId: number
  signalLightChildId: number
  runParam: SignalLightRunParamDParam[]
}

export class SignalLightRunParamDParam {
  start: number
  end: number
  color: SignalLightColorEnum
  lightType: SLSPLTTypeEnum[]
}

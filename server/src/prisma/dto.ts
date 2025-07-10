// 生成的 prisma 查询参数
export class PrismaParam {
  select?: Record<string, boolean>;
  where!: {
    AND: any[];
  };
  skip!: number;
  take!: number;
  orderBy?: Record<string, string>;
}

// 查询参数的类型为 object 时的格式
export class SelectParamObj {
  in: SelectParamObjIn;
  between: SelectParamObjBetween;

  constructor({
                in: _in,
                between,
              }: {
                in?: SelectParamObjIn
                between?: SelectParamObjBetween
              } = {},
  ) {
    if (_in && _in.value) {
      this.in = new SelectParamObjIn(_in);
    } else {
      delete this.in;
    }
    if (between && between.value) {
      this.between = new SelectParamObjBetween(between);
    } else {
      delete this.between;
    }
  }
}

class SelectParamObjIn {
  type?: string;
  value: (string | number)[];

  constructor({
                type = 'string',
                value = [],
              }: {
                type?: string,
                value?: (string | number)[]
              } = {},
  ) {
    this.type = type;
    this.value = value;
  }
}

class SelectParamObjBetween {
  type?: string;
  value: (string | number)[];

  constructor({
                type = 'string',
                value = [],
              }: {
                type?: string,
                value?: (string | number)[]
              } = {},
  ) {
    this.type = type;
    this.value = value;
  }
}

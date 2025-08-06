export class Res<T> {
  code!: number;
  data!: T;
  msg!: string;
  time!: string;
  timestamp!: number;
  reqId!: string;
}

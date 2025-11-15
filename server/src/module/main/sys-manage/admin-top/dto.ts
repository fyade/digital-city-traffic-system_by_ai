import { BaseDto } from '../../../../common/dto/BaseDto';

export class AdminTopDto extends BaseDto {
  id: number;

  userId: string;

  remark: string;
}

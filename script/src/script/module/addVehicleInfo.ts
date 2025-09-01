import { Injectable } from "@nestjs/common";
import { request } from "../../api/request";
import { numberUtils } from "@dcts/common";

@Injectable()
export class AddVehicleInfoModule {
  async main() {
    const num = 100
    const plates: string[] = []
    for (let i = 0; i < num; i++) {
      plates.push(`${this.generatePlateNumber('blue')}$$$${this.generateRandomVehicleColor()}`)
    }
    await request({
      url: '/dcts/external/add-vehicle-info',
      method: 'POST',
      data: {
        plateNumbers: plates
      }
    })
  }

  private provinces = [
    '京', '津', '冀', '晋', '蒙', '辽', '吉', '黑',
    '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫',
    '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵',
    '云', '藏', '陕', '甘', '青', '宁', '新'
  ];
  private letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  private numbers = '0123456789';

  private generatePlateNumber(type: string) {
    switch (type) {
      case 'blue': // 普通蓝牌：省份+地区代码+5位数字字母组合
        return this.provinces[numberUtils.randomNumber(0, this.provinces.length - 1)] +
            this.letters[numberUtils.randomNumber(0, this.letters.length - 1)] +
            // '·' +
            this.generateRandomString(5, this.numbers + this.letters);

      case 'green': // 新能源绿牌：省份+地区代码+6位数字字母组合
        return this.provinces[numberUtils.randomNumber(0, this.provinces.length - 1)] +
            this.letters[numberUtils.randomNumber(0, this.letters.length - 1)] +
            this.generateRandomString(6, this.numbers + 'ABCDEFGHJK');

      case 'yellow': // 黄牌：省份+地区代码+5位数字字母组合
        return this.provinces[numberUtils.randomNumber(0, this.provinces.length - 1)] +
            this.letters[numberUtils.randomNumber(0, this.letters.length - 1)] +
            this.generateRandomString(5, this.numbers + this.letters);

      case 'black': // 黑牌：使馆或外资企业
        return '使' +
            this.letters[numberUtils.randomNumber(0, this.letters.length - 1)] +
            // '·' +
            this.generateRandomString(4, this.numbers) +
            this.letters[numberUtils.randomNumber(0, this.letters.length - 1)];

      case 'police': // 警用车牌
        return this.provinces[numberUtils.randomNumber(0, this.provinces.length - 1)] +
            this.letters[numberUtils.randomNumber(0, this.letters.length - 1)] +
            // '·' +
            this.generateRandomString(4, this.numbers) +
            '警';

      case 'military': // 军用车牌
        return this.generateRandomString(2, this.letters) +
            // '·' +
            this.generateRandomString(5, this.numbers + this.letters);

      default:
        return '未知类型';
    }
  }

  private generateRandomString(length: number, characters: string) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(numberUtils.randomNumber(0, characters.length - 1));
    }
    return result;
  }

  private VEHICLE_COLORS = [
    '白色', '黑色', '银色', '灰色', '红色', '蓝色', '绿色',
    '黄色', '橙色', '紫色', '棕色', '香槟色', '金色', '粉色',
    '深蓝色', '深灰色', '墨绿色', '咖啡色', '米色', '珍珠白',
    '金属黑', '金属银', '金属灰', '金属蓝', '金属红'
  ];

  private generateRandomVehicleColor() {
    return this.VEHICLE_COLORS[numberUtils.randomNumber(0, this.VEHICLE_COLORS.length - 1)];
  }
}

import { Injectable } from '@nestjs/common';
import { PostgresqlPrismaoService } from '../../../../infra/prisma/postgresql.prismao.service';
import { final } from '../../../../util/base';

@Injectable()
export class GenerateMockStrategyDataModule {
  constructor(
    private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {}

  async main() {
    const now = new Date().toISOString();
    console.info('开始生成信号灯策略模拟数据...');

    // 删除已有测试数据（避免重复）
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_strategy_schedule_strategy_param_mapping WHERE create_by = 'mock_script'`,
    );
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_strategy_type_strategy_schedule_mapping WHERE create_by = 'mock_script'`,
    );
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_group_strategy_type_mapping WHERE create_by = 'mock_script'`,
    );
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_strategy_param WHERE create_by = 'mock_script'`,
    );
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_strategy_schedule WHERE create_by = 'mock_script'`,
    );
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_strategy_type WHERE create_by = 'mock_script'`,
    );
    await this.pgsqlPrismao.$queryRawUnsafe(
      `DELETE FROM signal_light_group_info WHERE create_by = 'mock_script'`,
    );

    // 创建2个信号灯组
    const group1Result = await this.pgsqlPrismao.$queryRawUnsafe<{ id: number }[]>(
      `INSERT INTO signal_light_group_info (name, description, location, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES ('测试路口A', '模拟路口A', ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')
       RETURNING id`,
    );
    const group2Result = await this.pgsqlPrismao.$queryRawUnsafe<{ id: number }[]>(
      `INSERT INTO signal_light_group_info (name, description, location, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES ('测试路口B', '模拟路口B', ST_SetSRID(ST_MakePoint(116.5, 40.0), 4326), 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')
       RETURNING id`,
    );
    const groupId1 = group1Result[0].id;
    const groupId2 = group2Result[0].id;
    console.info(`信号灯组创建完成: ${groupId1}, ${groupId2}`);

    // 创建3个策略类型
    const typeRes = await this.pgsqlPrismao.$queryRawUnsafe<{ id: number }[]>(
      `INSERT INTO signal_light_strategy_type (name, description, strategy_type, schedule_type, if_disabled, order_num, start_time, end_time, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES
       ('固定策略-工作日', '工作日早晚高峰固定配时', 'custom', 'day', '${final.N}', 1,  '${now}', '2027-12-31T23:59:59.000Z', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('微调策略-雨天', '雨天绿灯时长微调', 'fineTuning', 'ftp', '${final.N}', 2, '${now}', '2027-12-31T23:59:59.000Z', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('紧急策略-消防通道', '消防车辆优先通行', 'top', 'ftp', '${final.N}', 0, '${now}', '2027-12-31T23:59:59.000Z', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')
       RETURNING id`,
    );
    const typeIds = typeRes.map(r => r.id);
    console.info(`策略类型创建完成: ${typeIds.join(', ')}`);

    // 创建3个调度
    const schedRes = await this.pgsqlPrismao.$queryRawUnsafe<{ id: number }[]>(
      `INSERT INTO signal_light_strategy_schedule (name, description, if_disabled, order_num, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES
       ('工作日早高峰', '7:00-9:00', '${final.N}', 1, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('工作日晚高峰', '17:00-19:00', '${final.N}', 2, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('消防应急', '消防车通过时触发', '${final.N}', 0, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')
       RETURNING id`,
    );
    const schedIds = schedRes.map(r => r.id);
    console.info(`调度创建完成: ${schedIds.join(', ')}`);

    // 创建8个策略参数
    const paramRes = await this.pgsqlPrismao.$queryRawUnsafe<{ id: number }[]>(
      `INSERT INTO signal_light_strategy_param (name, description, if_disabled, order_num, light_type, round, duration, current_light, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES
       ('直行绿灯', '直行方向放行', '${final.N}', 1, 'straight', 1, 45, 'green', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('直行黄灯', '直行警示', '${final.N}', 2, 'straight', 1, 3, 'yellow', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('直行左转绿灯', '直行+左转放行', '${final.N}', 3, 'straight-left', 2, 30, 'green', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('直行左转黄灯', '直行+左转警示', '${final.N}', 4, 'straight-left', 2, 3, 'yellow', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('左转绿灯', '左转方向放行', '${final.N}', 5, 'left', 3, 25, 'green', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('左转黄灯', '左转警示', '${final.N}', 6, 'left', 3, 3, 'yellow', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('全红清空', '路口清空', '${final.N}', 7, 'around-left-straight-right', 4, 5, 'red', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}'),
       ('消防全绿', '消防车全方向放行', '${final.N}', 0, 'around-left-straight-right', 0, 60, 'green', 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')
       RETURNING id`,
    );
    const paramIds = paramRes.map(r => r.id);
    console.info(`参数创建完成: ${paramIds.join(', ')}`);

    // 组→策略类型 关联
    for (const gid of [groupId1, groupId2]) {
      for (const tid of typeIds) {
        await this.pgsqlPrismao.$queryRawUnsafe(
          `INSERT INTO signal_light_group_strategy_type_mapping (group_id, strategy_type_id, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
           VALUES (${gid}, ${tid}, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')`,
        );
      }
    }
    console.info('组→策略类型关联完成');

    // 策略类型→调度 关联
    // type0(固定) → sched0(早高峰)+sched1(晚高峰)
    for (const sid of [schedIds[0], schedIds[1]]) {
      await this.pgsqlPrismao.$queryRawUnsafe(
        `INSERT INTO signal_light_strategy_type_strategy_schedule_mapping (strategy_type_id, strategy_schedule_id, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
         VALUES (${typeIds[0]}, ${sid}, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')`,
      );
    }
    // type2(紧急) → sched2(消防)
    await this.pgsqlPrismao.$queryRawUnsafe(
      `INSERT INTO signal_light_strategy_type_strategy_schedule_mapping (strategy_type_id, strategy_schedule_id, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES (${typeIds[2]}, ${schedIds[2]}, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')`,
    );
    console.info('策略类型→调度关联完成');

    // 调度→参数 关联
    // 早高峰: 参数0-6（完整周期）
    for (let i = 0; i < 7; i++) {
      await this.pgsqlPrismao.$queryRawUnsafe(
        `INSERT INTO signal_light_strategy_schedule_strategy_param_mapping (strategy_schedule_id, strategy_param_id, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
         VALUES (${schedIds[0]}, ${paramIds[i]}, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')`,
      );
    }
    // 晚高峰: 参数0-6（完整周期）
    for (let i = 0; i < 7; i++) {
      await this.pgsqlPrismao.$queryRawUnsafe(
        `INSERT INTO signal_light_strategy_schedule_strategy_param_mapping (strategy_schedule_id, strategy_param_id, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
         VALUES (${schedIds[1]}, ${paramIds[i]}, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')`,
      );
    }
    // 消防: 参数7（全绿）
    await this.pgsqlPrismao.$queryRawUnsafe(
      `INSERT INTO signal_light_strategy_schedule_strategy_param_mapping (strategy_schedule_id, strategy_param_id, create_by, create_role, update_by, update_role, create_time, update_time, deleted)
       VALUES (${schedIds[2]}, ${paramIds[7]}, 'mock_script', 'admin', 'mock_script', 'admin', '${now}', '${now}', '${final.N}')`,
    );
    console.info('调度→参数关联完成');
    console.info('模拟数据生成完毕！');
  }
}

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { serverConfig } from "@dcts/config";

const env = serverConfig.currentConfig();

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password,
      db: env.redis.database,
    });
  }

  getRedis(): Redis {
    return this.redis;
  }

  // 字符串操作

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(...keys: string[]): Promise<number> {
    return this.redis.del(...keys);
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    if (keys.length === 0) {
      return [];
    }
    return this.redis.mget(...keys);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.redis.setex(key, seconds, value);
  }

  // 集合操作

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.redis.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.redis.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.redis.srem(key, ...members);
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.redis.sismember(key, member);
  }

  async scard(key: string): Promise<number> {
    return this.redis.scard(key);
  }

  // 哈希操作

  async hset(key: string, field: string, value: string): Promise<number> {
    return this.redis.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field);
  }

  async hgetall(key: string): Promise<{ [field: string]: string }> {
    return this.redis.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.redis.hdel(key, ...fields);
  }

  async hkeys(key: string): Promise<string[]> {
    return this.redis.hkeys(key);
  }

  async hvals(key: string): Promise<string[]> {
    return this.redis.hvals(key);
  }

  async hlen(key: string): Promise<number> {
    return this.redis.hlen(key);
  }

  async hscan(hashKey: string, cursor: number, pageSize: number): Promise<{
    nextCursor: string;
    entries: { [key: string]: string }
  }> {
    const result = await this.redis.hscan(hashKey, cursor, 'COUNT', pageSize);
    const nextCursor = result[0]; // 下一个游标
    const entries = result[1]; // 当前页的键值对数组
    // 将键值对数组转换为对象
    const entriesObject: { [key: string]: string } = {};
    for (let i = 0; i < entries.length; i += 2) {
      const key = entries[i];
      const value = entries[i + 1];
      entriesObject[key] = value;
    }
    return { nextCursor, entries: entriesObject };
  }

  // 列表操作

  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.redis.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.redis.rpush(key, ...values);
  }

  async lpop(key: string): Promise<string | null> {
    return this.redis.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return this.redis.rpop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.lrange(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return this.redis.llen(key);
  }

  // 有序集合操作

  async zadd(key: string, ...args: (number | string)[]): Promise<number> {
    return this.redis.zadd(key, ...args);
  }

  async zrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    const arr: [string, number, number] = [key, start, stop];
    if (withScores) arr.push('WITHSCORES');
    return this.redis.zrange(...arr);
  }

  async zrevrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    const arr: [string, number, number] = [key, start, stop];
    if (withScores) arr.push('WITHSCORES');
    return this.redis.zrevrange(...arr);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return this.redis.zrem(key, ...members);
  }

  async zcard(key: string): Promise<number> {
    return this.redis.zcard(key);
  }
}

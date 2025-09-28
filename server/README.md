## 命令

### 启动命令：

```bash
$env:NODE_ENV="dev"; node ./main.js
```

### 其他命令：

初始化 prisma：

```bash
npx prisma init
```

prisma 迁移数据库：

```bash
$ npx prisma migrate dev --name gx --schema=./prisma/mysql.schema.prisma
```

prisma 重置数据库：

```bash
$ npx prisma migrate reset
```

prisma 生成 Prisma Client：

```bash
$ npx prisma generate
```

prisma 从数据库同步结构
```bash
$ npx prisma db pull --schema=./prisma/mysql.schema.prisma
```

nest 生成拦截器：

```bash
$ nest generate interceptor auth-token
```

nest 创建模块：

```bash
$ nest g mo module/name # 创建一个模块
$ nest g co module/name --no-spec # 创建不带测试文件的控制器
$ nest g s module/name --no-spec # 创建不带测试文件的服务层
```

nest 创建管道：

```bash
$ nest g pipe validation pipe # 管道
```

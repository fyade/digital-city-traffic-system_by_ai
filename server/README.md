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
$ npx prisma migrate dev --name gx
```

prisma 重置数据库：

```bash
$ npx prisma migrate reset
```

prisma 生成 Prisma Client：

```bash
$ npx prisma generate
```

nest 生成拦截器：

```bash
$ nest generate interceptor auth-token
```

nest 创建模块：

```bash
$ nest g mo module/name # 创建一个用户模块
$ nest g co module/name --no-spec # 创建不带测试文件的控制器
$ nest g s module/name --no-spec # 创建不带测试文件的服务层
```

nest 创建管道：

```bash
$ nest g pipe validation pipe # 管道
```

## 其他注意事项

菜单相关常量：

* mm 表示菜单
* mc 表示组件
* ma 表示接口组
* mb 表示接口

菜单 ip 限制相关常量：

* ip 表示 ip
* ho 表示 host

接口限流相关常量：

* ip 表示 以 ip 为单位限制

权限身份类型相关常量：

* ro 表示角色
* de 表示部门
* ug 表示用户组

数据表行(háng)权限管理相关常量：

* ALL 表示全部
* SELF_DEPT 表示本部门
* DEPT_ONE_SON 表示本部门及直属子部门
* DEPT_ALL_SON 表示本部门及全部子部门
* SELF_ROLE 表示本角色
* SELF 表示自己

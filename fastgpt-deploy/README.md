# FastGPT 本地部署指南

## 前置要求

- Docker Desktop 已安装并运行
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

## 快速开始

### 1. 启动 FastGPT 服务

```bash
cd /Users/ricky/playground/AgentAccess/fastgpt-deploy
docker-compose up -d
```

### 2. 查看服务状态

```bash
docker-compose ps
docker-compose logs -f fastgpt
```

### 3. 访问 FastGPT

- FastGPT 主界面: http://localhost:3000
- API 文档: http://localhost:3000/api/docs

## 配置 API Key

### 方法 1: 通过环境变量（推荐）

编辑 `docker-compose.yml` 文件，修改以下配置：

```yaml
environment:
  OPENAI_API_BASE_URL: https://api.openai.com/v1  # 或使用国内 API
  OPENAI_API_KEY: sk-your-actual-api-key-here      # 替换为你的 API Key
```

然后重启服务：

```bash
docker-compose down
docker-compose up -d
```

### 方法 2: 通过 Web 界面

1. 访问 http://localhost:3000
2. 登录后进入设置页面
3. 配置 OpenAI API Key

## 常用命令

```bash
# 查看日志
docker-compose logs -f fastgpt

# 重启服务
docker-compose restart fastgpt

# 停止所有服务
docker-compose down

# 停止并删除所有数据
docker-compose down -v

# 查看数据库
docker exec -it fastgpt-postgres psql -U myuser -d fastgpt
```

## 获取 API Key

### 使用 OpenAI

访问 https://platform.openai.com/api-keys

### 使用国内替代 API

**OneAPI / 中转 API:**
- 注册后获取 API Key
- 将 `OPENAI_API_BASE_URL` 改为提供的地址

**其他选择:**
- 智谱 AI (GLM)
- 百度文心
- 阿里通义千问

## 故障排查

### 端口冲突

如果 3000 端口被占用，修改 `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # 使用 3001 端口
```

### 数据库连接失败

检查 PostgreSQL 是否正常运行：

```bash
docker-compose ps postgres
docker-compose logs postgres
```

### 镜像拉取失败

如果 `labring/fastgpt:latest` 镜像拉取失败，可以尝试：

```bash
# 使用阿里云镜像加速
docker pull registry.cn-hangzhou.aliyuncs.com/labring_images/fastgpt:latest
```

然后修改 `docker-compose.yml` 中的镜像地址。

## 数据持久化

数据存储在 Docker volumes 中：

- `postgres_data`: PostgreSQL 数据
- `milvus_data`: Milvus 向量数据（如果启用）

备份命令：

```bash
docker run --rm -v fastgpt-deploy_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

## 生产环境部署建议

1. 修改默认密码和密钥
2. 配置 HTTPS（使用 Nginx 反向代理）
3. 启用 Milvus 向量数据库以获得更好的性能
4. 配置定期备份
5. 设置资源限制

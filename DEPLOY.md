# 管理后台部署到服务器

管理后台为 Vue 3 项目，需要先构建成静态文件，再通过 Web 服务器（如 Nginx）托管，并与后端 API 同域或通过代理访问。

---

## 一、本地构建

```bash
cd admin
npm install
npm run build
```

构建完成后会生成 `admin/dist/` 目录，内含 `index.html` 和 `assets/` 静态资源。

---

## 二、上传到服务器

将 `dist/` 目录内的所有文件上传到服务器，例如：

```bash
# 示例：用 scp 上传到 /opt/xuanyu/admin-dist/
scp -r dist/* user@服务器IP:/opt/xuanyu/admin-dist/
```

或使用 rsync、FTP 等工具。

---

## 三、Nginx 配置

管理后台需与后端 API 同域（或同站）访问，以便 `/api/admin` 请求能正确转发。推荐用 Nginx 同时托管前端和反代后端。

### 方式一：管理后台放在子路径 /mgmt/

需要先修改构建配置，让前端支持子路径。在 `admin/vite.config.js` 中增加 `base`：

```js
export default defineConfig({
  plugins: [vue()],
  base: '/mgmt/',
  server: { port: 5174, proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } } }
})
```

在 `admin/src/router/index.js` 中设置路由 base：

```js
createRouter({
  history: createWebHistory('/mgmt/'),
  routes: [ /* ... */ ],
})
```

然后重新 `npm run build`，将 `dist/` 上传到服务器。

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name 你的域名或IP;

    # 管理后台静态文件（子路径 /mgmt/）
    location /mgmt/ {
        alias /opt/xuanyu/admin-dist/;
        try_files $uri $uri/ /mgmt/index.html;
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 如需 HTTPS，可在此配置 ssl_certificate 等
}
```

访问：`http://你的域名/mgmt/`

---

### 方式二：管理后台单独域名或子域名（推荐）

例如使用 `mgmt.你的域名.com`，部署在站点根路径。

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name mgmt.你的域名.com;

    root /opt/xuanyu/admin-dist;
    index index.html;
    try_files $uri $uri/ /index.html;

    # 后端 API 反向代理（管理后台请求 /api/admin）
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

访问：`http://mgmt.你的域名.com`

无需修改 vite base 或 router，直接使用当前项目配置即可。

---

## 四、首次使用

1. 打开管理后台地址。
2. 进入「系统配置」，填写与服务器 `ADMIN_API_KEY` 一致的管理端密钥，保存。
3. 后端需已设置环境变量：`export ADMIN_API_KEY=你的密钥`，并重启 Gunicorn。

---

## 五、与 Django 同机部署时的目录示例

```
/opt/xuanyu/
├── server/          # Django 后端（监听 127.0.0.1:8000）
├── admin-dist/      # 管理后台构建产物（Nginx 托管）
```

Nginx 负责：
- 静态资源：从 `admin-dist/` 提供
- API：`/api/*` 转发到 `http://127.0.0.1:8000`

---

## 六、常见问题

- **401 未授权**：检查「系统配置」中的密钥是否与后端 `ADMIN_API_KEY` 一致。
- **刷新 404**：确认 Nginx 配置了 `try_files $uri $uri/ /index.html`（或 `/mgmt/index.html`），以便 SPA 路由生效。
- **接口跨域**：管理后台与 API 应在同一域名下，通过 Nginx 代理避免跨域。

import jsonServer from "json-server";
import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// 文件上传配置
const storage = multer.diskStorage({
  destination: join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// CORS 中间件
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// 文件上传路由
server.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({
    status: "done",
    url: `http://localhost:3000/uploads/${req.file.filename}`,
    name: req.file.originalname,
  });
});

// 静态文件服务
server.use(
  "/uploads",
  (req, res, next) => {
    const filePath = join(__dirname, "uploads", path.basename(req.path));
    if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
    
    const ext = path.extname(req.path).toLowerCase();
    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };
    if (mimeTypes[ext]) res.type(mimeTypes[ext]);
    next();
  },
  express.static(join(__dirname, "uploads"))
);

// 增强的 orders 查询中间件
server.use((req, res, next) => {
  if (req.method === "GET" && req.path === "/orders") {
    try {
      const db = router.db.getState();
      let results = [...db.orders]; // 创建副本避免修改原数据
      
      // 1. 处理 dataRange 查询（如果存在）
      if (req.query.dataRange) {
        const [min, max] = JSON.parse(decodeURIComponent(req.query.dataRange));
        results = results.filter(order => 
          Number(order.orderNum) >= Number(min) && 
          Number(order.orderNum) <= Number(max)
        );
      }
      
      // 2. 处理其他查询参数（排除分页参数）
      Object.entries(req.query).forEach(([key, value]) => {
        if (!["_page", "_limit", "page", "size", "dataRange"].includes(key) && value !== undefined) {
          results = results.filter(item => 
            String(item[key]) === String(value)
          );
        }
      });
      
      // 3. 处理分页
      const page = parseInt(req.query.page || req.query._page) || 1;
      const size = parseInt(req.query.size || req.query._limit) || 10;
      const paginatedResults = results.slice(
        (page - 1) * size,
        page * size
      );
      
      // 4. 设置响应头
      res.set({
        "X-Total-Count": results.length,
        "Access-Control-Expose-Headers": "X-Total-Count"
      });
      
      return res.json(paginatedResults);
    } catch (e) {
      console.error("查询处理错误:", e);
      return res.status(400).json({ error: "Invalid query parameters" });
    }
  }
  next();
});

// 默认中间件
server.use(middlewares);

// JSON Server 路由
server.use(router);

// 启动服务器
server.listen(3000, () => {
  if (!fs.existsSync(join(__dirname, "uploads"))) {
    fs.mkdirSync(join(__dirname, "uploads"));
  }
  console.log(`
  🚀 JSON Server 已启动
  ► 数据接口: http://localhost:3000
  ► 上传接口: POST http://localhost:3000/api/upload
  ► 文件访问: http://localhost:3000/uploads/[filename]
  ► 跨域已允许: http://localhost:5173
  `);
});
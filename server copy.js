import jsonServer from "json-server";
import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import fs from "fs";

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化服务器
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// 文件上传配置
const storage = multer.diskStorage({
  destination: join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // 生成带后缀的文件名
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// 自定义 CORS 中间件
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // 改为你的前端地址
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true"); // 允许携带凭证
  next();
});

// 添加文件上传路由 (适配antd Upload组件)
server.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // 返回antd Upload需要的格式
  res.json({
    status: "done",
    url: `http://localhost:3000/uploads/${req.file.filename}`,
    name: req.file.originalname,
  });
});

// 改进的静态文件服务（自动设置正确的Content-Type）
server.use(
  "/uploads",
  (req, res, next) => {
    const filePath = join(__dirname, "uploads", path.basename(req.path));

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Not found");
    }

    // 根据文件扩展名设置Content-Type
    const ext = path.extname(req.path).toLowerCase();
    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    if (mimeTypes[ext]) {
      res.type(mimeTypes[ext]);
    }

    next();
  },
  express.static(join(__dirname, "uploads"))
);

// 自定义中间件：处理 dataRange 查询
server.use((req, res, next) => {
  if (req.method === "GET" && req.query.dataRange) {
      try {
      // 1. 解码 URL 编码的字符串
      const decoded = decodeURIComponent(req.query.dataRange);
      // 2. 解析 JSON
      const [min, max] = JSON.parse(decoded);
      
      const db = router.db.getState();
      // 判断查询条件
      const filteredOrders = db.orders.filter(
        (order) => order.orderNum >= min && order.orderNum <= max
      );
      res.jsonp(filteredOrders);
      return;
    } catch (e) {
      console.error('解析 dataRange 失败:', e);
      res.status(400).jsonp({ error: 'Invalid dataRange format' });
    }
  }
  next();
});

// 自定义分页中间件
server.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    // 获取分页参数
    const page = parseInt(req.query.page || req.query._page) || 1;
    const limit = parseInt(req.query.size || req.query._limit) || 10;

    // 修改查询参数以适配json-server
    req.query._page = page;
    req.query._limit = limit;

    // 保存原始send方法
    const originalSend = res.send;

    // 重写send方法以添加分页信息
    res.send = function (body) {
      if (res.statusCode === 200 && Array.isArray(body)) {
        // 获取总记录数
        const db = router.db.getState();
        const resource = req.path.split("/")[1];
        const total = db[resource]?.length || 0;

        // 设置分页头信息
        res.setHeader("X-Total-Count", total);
        res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
      }
      originalSend.call(this, body);
    };
  }
  next();
});



// 默认中间件（如日志、静态文件等）
server.use(middlewares);

// 路由
server.use(router);

// 启动服务器
server.listen(3000, () => {
  // 确保上传目录存在
  if (!fs.existsSync(join(__dirname, "uploads"))) {
    fs.mkdirSync(join(__dirname, "uploads"));
  }

  console.log(`
  🚀 JSON Server 已启动
  ► 数据接口: http://localhost:3000
  ► 上传接口: POST http://localhost:3000/api/upload
  ► 文件访问: http://localhost:3000/uploads/[filename]
  ► 跨域已允许: http://localhost:5173
  ► 上传目录: ${join(__dirname, "uploads")}
  ► 分页支持: 使用 _page 和 _limit 参数
  `);
});

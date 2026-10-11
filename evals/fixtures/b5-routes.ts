// src/routes/files.ts (Express)
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({ storage: multer.memoryStorage() });

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const payload = jwt.decode(token);           // read user from token
  if (!payload) return res.status(401).end();
  req.user = payload;
  next();
}

router.post("/files", auth, upload.single("file"), (req, res) => {
  const dest = path.join(__dirname, "../../uploads", req.file.originalname);
  fs.writeFileSync(dest, req.file.buffer);
  res.json({ url: "/uploads/" + req.file.originalname });
});

router.get("/files/search", auth, async (req, res) => {
  const rows = await db.query(
    "SELECT * FROM files WHERE owner_id = " + req.user.id + " AND name LIKE '%" + req.query.q + "%'"
  );
  res.json(rows);
});

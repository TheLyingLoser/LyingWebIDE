import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Necesare pentru __dirname în ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Servește fișierele statice din folderul public
app.use(express.static(path.join(__dirname, "public")));

// 🔁 Redirecționează toate cererile către index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server pornit pe http://localhost:${port}`);
});

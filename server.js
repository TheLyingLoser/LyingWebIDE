const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servirea fișierelor statice din folderul 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servirea fișierelor Monaco Editor
app.use('/vs', express.static(path.join(__dirname, 'node_modules/monaco-editor/min/vs')));

app.listen(PORT, () => {
  console.log(`Serverul rulează la: http://localhost:${PORT}`);
});

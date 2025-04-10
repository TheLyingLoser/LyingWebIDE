let currentLang = 'html';
let editors = {};
let containers = {};
let code = { html: '', css: '', js: '' };

// Încarcă tipurile DOM pentru JS complet
function loadDOMTypes() {
  return fetch('https://unpkg.com/typescript@5.2.2/lib/lib.dom.d.ts')
    .then(res => res.text())
    .then(domTypes => {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(domTypes, 'ts:lib.dom.d.ts');
    });
}

require(['vs/editor/editor.main'], function () {
  const containerMain = document.getElementById('editor-container');

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    allowJs: true,
    noEmit: true
  });

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  });

  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  loadDOMTypes().then(() => {
    ['html', 'css', 'js'].forEach(lang => {
      const container = document.createElement('div');
      container.style.display = 'none';
      container.style.height = '100%';
      container.style.width = '100%';

      containerMain.appendChild(container);
      containers[lang] = container;

      const model = monaco.editor.createModel('', lang === 'js' ? 'javascript' : lang);

      const editor = monaco.editor.create(container, {
        model,
        theme: document.body.classList.contains('light') ? 'vs-light' : 'vs-dark',
        automaticLayout: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: true
      });

      editor.onDidChangeModelContent(updatePreview);
      editors[lang] = editor;
    });

    switchTab('html');

    document.querySelectorAll('.tab').forEach(tab =>
      tab.addEventListener('click', () => switchTab(tab.dataset.lang))
    );
  });

  monaco.languages.registerCompletionItemProvider('html', {
    provideCompletionItems: () => ({
      suggestions: [
        {
          label: 'div',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<div>\n\t$0\n</div>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Div container'
        },
        {
          label: 'h1',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<h1>$0</h1>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Header 1'
        }
      ]
    })
  });

  monaco.languages.registerCompletionItemProvider('css', {
    provideCompletionItems: () => ({
      suggestions: [
        {
          label: 'color',
          kind: monaco.languages.CompletionItemKind.Property,
          insertText: 'color: ;',
          documentation: 'Set text color'
        },
        {
          label: 'background',
          kind: monaco.languages.CompletionItemKind.Property,
          insertText: 'background: ;',
          documentation: 'Set background color'
        }
      ]
    })
  });
});

function switchTab(lang) {
  currentLang = lang;

  document.querySelectorAll('.tab').forEach(tab =>
    tab.classList.toggle('active', tab.dataset.lang === lang)
  );

  Object.keys(containers).forEach(key => {
    containers[key].style.display = key === lang ? 'block' : 'none';
    if (key === lang) editors[key].layout();
  });
}

function toggleTheme() {
  const body = document.body;
  const isNowLight = body.classList.toggle('light');
  const theme = isNowLight ? 'vs-light' : 'vs-dark';

  Object.values(editors).forEach(editor => monaco.editor.setTheme(theme));
}

function updatePreview() {
  code[currentLang] = editors[currentLang].getValue();
  const fullCode = `
    <html>
    <head><style>${code.css}</style></head>
    <body>
    ${code.html}
    <script>${code.js}<\/script>
    </body>
    </html>`;
  document.getElementById('preview').srcdoc = fullCode;
}

function startNewProject() {
  location.reload();
}

function donate() {
    window.open("https://ko-fi.com/thelyingloser", "_blank");
  }
  

// 🔁 Resizer ultra-fluid + protecție selectare text
const resizer = document.getElementById('resizer');
const leftPanel = document.querySelector('.editor-side');
const rightPanel = document.querySelector('.preview-side');
let isDragging = false;

resizer.addEventListener('pointerdown', function (e) {
  isDragging = true;
  document.body.setPointerCapture(e.pointerId);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none'; // ✅ oprește selectarea textului
});

document.addEventListener('pointermove', function (e) {
  if (!isDragging) return;

  requestAnimationFrame(() => {
    const containerWidth = document.querySelector('.main').offsetWidth;
    let newLeftWidth = e.clientX;

    if (newLeftWidth < 100) newLeftWidth = 100;
    if (newLeftWidth > containerWidth - 100) newLeftWidth = containerWidth - 100;

    leftPanel.style.width = `${newLeftWidth}px`;
    rightPanel.style.width = `${containerWidth - newLeftWidth}px`;
  });
});

document.addEventListener('pointerup', function (e) {
  if (isDragging) {
    isDragging = false;
    document.body.releasePointerCapture(e.pointerId);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = ''; // ✅ restabilește comportamentul normal
  }
});

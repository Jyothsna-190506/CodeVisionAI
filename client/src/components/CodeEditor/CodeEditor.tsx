import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language: 'cpp' | 'python' | 'java';
  activeLine?: number | null;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  activeLine = null,
  readOnly = false
}) => {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  // Map language string to Monaco mode
  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'cpp':
        return 'cpp';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      default:
        return 'cpp';
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom Pearl Code Lab Light Theme
    monaco.editor.defineTheme('pearl-code-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '858078', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'D85C32', fontStyle: 'bold' },
        { token: 'number', foreground: 'F28A3D' },
        { token: 'string', foreground: '799718' },
        { token: 'type', foreground: 'D85C32' },
        { token: 'identifier', foreground: '242321' },
      ],
      colors: {
        'editor.background': '#FFFDF8',
        'editor.foreground': '#242321',
        'editor.lineHighlightBackground': '#F5EFE6',
        'editorLineNumber.foreground': '#858078',
        'editorLineNumber.activeForeground': '#D85C32',
        'editorGutter.background': '#FFFDF8',
      }
    });

    monaco.editor.setTheme('pearl-code-light');
  };

  // Update line highlighting when activeLine changes
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    if (activeLine && activeLine > 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: activeLine,
            startColumn: 1,
            endLineNumber: activeLine,
            endColumn: 1000
          },
          options: {
            isWholeLine: true,
            className: 'myLineHighlight',
            glyphMarginClassName: 'myLineGlyph'
          }
        }
      ]);

      // Reveal line in center of editor
      editor.revealLineInCenter(activeLine);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLine]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border-pearl bg-[#FFFDF8] shadow-pearl-sm">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          tabSize: 4,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

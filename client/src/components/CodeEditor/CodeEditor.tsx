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

    // Custom dark theme configuration
    monaco.editor.defineTheme('codevision-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        { token: 'keyword', foreground: '818CF8', fontStyle: 'bold' },
        { token: 'number', foreground: '38BDF8' },
        { token: 'string', foreground: '34D399' },
        { token: 'type', foreground: 'F472B6' },
      ],
      colors: {
        'editor.background': '#0F172A',
        'editor.foreground': '#F8FAFC',
        'editor.lineHighlightBackground': '#1E293B',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#818CF8',
        'editorGutter.background': '#0F172A',
      }
    });

    monaco.editor.setTheme('codevision-dark');
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
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-inner">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
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

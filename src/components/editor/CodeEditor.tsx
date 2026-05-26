import Editor, { type OnChange } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { db } from '../../lib/db'
import { debounce } from '../../lib/utils'

interface Props {
  problemSlug: string
  value: string
  onChange: (val: string) => void
  height?: string | number
}

const DEFAULT_TEMPLATE = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // TODO: viết code của bạn ở đây
    return 0;
}
`

export function CodeEditor({ problemSlug, value, onChange, height = '60vh' }: Props) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    let cancelled = false
    db.savedCode
      .where('problemSlug')
      .equals(problemSlug)
      .first()
      .then((saved) => {
        if (cancelled) return
        if (saved) onChange(saved.code)
        else if (!value) onChange(DEFAULT_TEMPLATE)
        setHydrated(true)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemSlug])

  useEffect(() => {
    if (!hydrated) return
    const save = debounce(async (code: string) => {
      const existing = await db.savedCode.where('problemSlug').equals(problemSlug).first()
      if (existing) await db.savedCode.update(existing.id!, { code, updatedAt: new Date() })
      else await db.savedCode.add({ problemSlug, code, updatedAt: new Date() })
    }, 1000)
    save(value)
  }, [value, problemSlug, hydrated])

  const handleChange: OnChange = (v) => {
    onChange(v ?? '')
  }

  return (
    <Editor
      height={height}
      defaultLanguage="cpp"
      language="cpp"
      theme="vs"
      value={value}
      onChange={handleChange}
      options={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorSmoothCaretAnimation: 'on',
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'off',
        renderLineHighlight: 'gutter',
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme('chuyentin-light', {
          base: 'vs',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#ffffff',
            'editor.lineHighlightBackground': '#f3f5f8',
            'editorGutter.background': '#f6f7f9',
            'editor.selectionBackground': '#cfe2ff',
            'editorLineNumber.foreground': '#8a95a3',
            'editorLineNumber.activeForeground': '#15212e',
          },
        })
      }}
      onMount={(_editor, monaco) => {
        monaco.editor.setTheme('chuyentin-light')
      }}
    />
  )
}

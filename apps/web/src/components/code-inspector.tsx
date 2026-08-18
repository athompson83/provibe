'use client';
import { useState } from 'react';
import { codeLines, lineExplanations } from '../lib/demo-data';
export function CodeInspector() {
  const [selected, setSelected] = useState(3);
  return <div className="inspector-grid"><section className="code-panel" aria-label="Source code"><div className="panel-toolbar"><span>src/lib/workspaces.ts</span><span>TypeScript</span></div><ol className="code-lines">{codeLines.map((line,index) => <li key={`${line}-${index}`} className={selected===index?'selected-line':''}><button onClick={() => setSelected(index)} aria-label={`Explain line ${index+1}`}><code>{line}</code></button></li>)}</ol></section><aside className="explain-panel"><span className="eyebrow">Plain-English explanation</span><h3>Line {selected+1}</h3><p>{lineExplanations[selected]}</p><dl className="detail-list"><div><dt>Evidence</dt><dd>Selected source line + enclosing function</dd></div><div><dt>Confidence</dt><dd>High · deterministic context</dd></div><div><dt>Risk if changed</dt><dd>{selected===3?'High — writes application data':'Low to medium'}</dd></div></dl></aside></div>;
}

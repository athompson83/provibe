'use client';
import { FormEvent, useState } from 'react';
const suggestions = ['What could stop this app from being ready for beta?','Which files are highest risk to change?','Does production match the current GitHub branch?'];
export function AskPanel() {
  const [question,setQuestion] = useState(suggestions[0] ?? ''); const [answer,setAnswer] = useState('');
  function submit(event: FormEvent) { event.preventDefault(); setAnswer('The strongest current blocker is authenticated QA. GitHub and Vercel evidence show the latest commit is deployed successfully, but no verified evidence covers the signed-in billing workflow. Supabase also reports one RLS advisor warning that should be reviewed before beta.'); }
  return <div className="ask-layout"><div className="suggestion-list">{suggestions.map((item)=><button key={item} onClick={()=>setQuestion(item)}>{item}</button>)}</div><form className="ask-box" onSubmit={submit}><label htmlFor="question">Ask about this application</label><textarea id="question" value={question} onChange={(e)=>setQuestion(e.target.value)} rows={4}/><button className="button button-primary" type="submit">Ask with evidence</button></form>{answer&&<section className="answer-card"><span className="eyebrow">Evidence-backed answer</span><p>{answer}</p><div className="source-row"><span>GitHub checks</span><span>Vercel deployment</span><span>Supabase advisor</span></div></section>}</div>;
}

export function parseRecommendation(value: unknown) {
  if (!value || typeof value !== 'object') throw new Error('Invalid response');
  const result=value as Record<string,unknown>;
  if(result.status!=='completed'||!Array.isArray(result.output))throw new Error('Response incomplete');
  const texts:string[]=[];
  for(const item of result.output){if(!item||item.type!=='message'||!Array.isArray(item.content))continue;for(const content of item.content){if(content.type==='refusal')throw new Error('Response refused');if(content.type==='output_text'&&typeof content.text==='string')texts.push(content.text);}}
  const p=JSON.parse(texts.join('')) as Record<string,unknown>;
  if(!['GO','CONDITIONAL GO','NO-GO'].includes(String(p.decision))||typeof p.confidence!=='number'||p.confidence<0||p.confidence>100||!Number.isFinite(p.confidence)||typeof p.executiveSummary!=='string')throw new Error('Invalid recommendation');
  for(const k of ['keyRisks','nextActions','evidenceGaps']){const a=p[k];if(!Array.isArray(a)||a.length<(k==='evidenceGaps'?1:3)||a.length>5||a.some(x=>typeof x!=='string'||!x.trim()))throw new Error('Invalid '+k);}
  return p;
}

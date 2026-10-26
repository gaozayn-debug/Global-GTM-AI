import {test} from 'node:test';import assert from 'node:assert/strict';import {parseRecommendation} from '../lib/ai-response';
const good={decision:'NO-GO',confidence:20,executiveSummary:'test',keyRisks:['a','b','c'],nextActions:['a','b','c'],evidenceGaps:['a']};
const wrap=(text:string)=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text}]}]});
test('REST nested output parsed',()=>assert.deepEqual(parseRecommendation(wrap(JSON.stringify(good))),good));
test('incomplete rejected',()=>assert.throws(()=>parseRecommendation({status:'incomplete',output:[]})));
test('refusal rejected',()=>assert.throws(()=>parseRecommendation({status:'completed',output:[{type:'message',content:[{type:'refusal'}]}]})));
test('bad JSON rejected',()=>assert.throws(()=>parseRecommendation(wrap('bad'))));
test('schema violation rejected',()=>assert.throws(()=>parseRecommendation(wrap(JSON.stringify({...good,keyRisks:[1]})))));
test('missing text rejected',()=>assert.throws(()=>parseRecommendation({status:'completed',output:[]})));

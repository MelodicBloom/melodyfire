export type EvidenceClass = 'observed' | 'declared' | 'derived' | 'hypothesis' | 'proposed' | 'demonstration';
export type Confidence = 'high' | 'medium' | 'low' | 'not-applicable';
export interface EvidenceRecord { id:string; claim:string; evidenceClass:EvidenceClass; sourceIds:string[]; confidence:Confidence; limitations:string[]; status:'verified'|'working'|'proposed'|'example' }
export interface RoleProof { signal:string; evidence:string; project:string; proofType:string; confidence:Confidence; transferability:string; gap:string }
export const operatingLoop=['Discover','Observe','Synthesize','Align','Test','Implement','Learn'];
export const reasoningLoop=['Problem signal','Context','Observation','Evidence','Synthesis','Opportunity','Alternatives','Decision','Pilot','Validation'];
export const roleProofs:RoleProof[]=[
 ['Human-centered design','Context-first service framing','Philly Civic AI','Portfolio primary','high','Service-design method transfers','Direct legal-practice fieldwork'],
 ['Qualitative research','Behavioral analysis, journey and touchpoint mapping','Professional practice','Declared experience','medium','Methods transfer across domains','No Reed Smith fieldwork claimed'],
 ['Ethnographic-method fluency','Observation, walkthrough and artifact-analysis protocol','Research specimen','Proposed method','not-applicable','METHOD FLUENCY / NOT YET PRIMARY FIELDWORK IN LEGAL PRACTICE','Formal law-firm ethnography'],
 ['Research synthesis','Evidence, inference and contradiction traceability','Seed Loom','Portfolio primary','high','Defensible reasoning pattern','Domain validation required'],
 ['Facilitation','Maker-space workshops for 100+ youth and adults','Professional practice','Declared experience','medium','Mixed-experience facilitation','Legal workshop not claimed'],
 ['Stakeholder collaboration','Community-as-co-author service framing','Philly Civic AI','Portfolio primary','high','Participatory principles transfer','Stakeholder access unknown'],
 ['Project execution','Explicit stages, gates and QA','Omni-Loom','Portfolio primary','high','Governed delivery transfers','Law-firm tenure: TRANSFERABLE / NOT CLAIMED'],
 ['Implementation','Auditing and documented efficiency improvement up to 30%','Professional practice','Declared experience','medium','Workflow discipline transfers','Context and baseline vary'],
 ['Knowledge sharing','Canonical/working knowledge lifecycle','NSE Knowledge Base','Portfolio primary','high','Reusable operating model','Adoption not measured here'],
 ['AI / emerging technology','Confidential AI-data and workflow contracts','Professional practice','Declared experience','medium','AI-system literacy transfers','No legal AI deployment claimed'],
 ['Quality and judgment','More than 98% documented annotation/labeling accuracy','Professional practice','Declared metric','medium','Evidence-quality practice transfers','Metric is context-specific'],
].map(([signal,evidence,project,proofType,confidence,transferability,gap])=>({signal,evidence,project,proofType,confidence:confidence as Confidence,transferability,gap}));
export const projects=[
 {name:'Seed Loom',href:'https://github.com/qt314wink/seed-loom',signal:'Defensible research-to-decision reasoning',chain:['source','evidence claim','interpretation','inference','assumption','contradiction','resolution','decision','validation','outcome','learning']},
 {name:'Philly Civic AI',href:'https://github.com/MelodicBloom/philly-civic-ai',signal:'Contextual service design and public-language translation',chain:['community','geography','language','policy','institutional constraints','lived knowledge','service behavior']},
 {name:'Omni-Loom',href:'https://github.com/MelodicBloom/omni-loom-case-study',signal:'Bounded transition from intent to implementation',chain:['ambiguous intent','explicit requirements','candidate paths','constraints','review','approved pilot','validation']},
 {name:'NSE Knowledge Base',href:'https://github.com/MelodicBloom/nse-kb',signal:'Knowledge sharing as operational infrastructure',chain:['research','working knowledge','decision','canonical knowledge','review','supersession']},
];

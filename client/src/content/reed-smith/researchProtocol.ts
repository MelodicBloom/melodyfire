export const phases=[
 {name:'Frame',items:['decision to inform','stakeholders','known constraints','unknowns','assumptions','access','confidentiality','success criteria']},
 {name:'Observe',items:['semi-structured interview','contextual observation','workflow walkthrough','artifact analysis','decision-point mapping']},
 {name:'Synthesize',items:['evidence records','affinity clusters','tensions','unmet needs','workarounds','uncertainty','opportunity areas']},
 {name:'Co-design',items:['evidence','friction','professional judgment','client impact','constraints','alternatives']},
 {name:'Prioritize',items:['user desirability','client value','operational feasibility','judgment preservation','confidentiality / risk','evidence confidence','reversibility','learning value']},
 {name:'Pilot',items:['owner','hypothesis','evidence basis','intervention','affected workflow','human-in-loop','success / quality / risk measures','stop condition','review date','scale / revise / stop']},
];
export const interviewPrompts=[
 'Walk me through the last time this process worked especially well. What made that possible?',
 'Where do you stop, switch tools, wait for someone else, or reconstruct context?',
 'Which decisions require professional judgment that should remain visible even if part of the workflow is automated?',
 'What information do you repeatedly recreate because the current system does not carry it forward?',
 'What workaround have you developed that the formal process does not capture?',
 'Where does a client experience the downstream effect of this workflow?',
 'What would make a new workflow trustworthy enough to use in real work?',
 'What evidence would convince you that the proposed change was not helping?',
];
export const workshop=[
 ['00–10','Shared Evidence Wall','Enforce anti-solutioning; distinguish observation from interpretation.'],
 ['10–25','Tension Mapping','Mark disagreement, contradictions and unresolved evidence.'],
 ['25–45','How-Might-We + Alternatives','Widen options; capture parking-lot questions.'],
 ['45–60','Constraint Test','Test judgment, confidentiality, client impact and feasibility.'],
 ['60–75','Pilot Contract','Confirm decision owner, stop conditions and next evidence.'],
];
export const pilotFields=['Opportunity','Hypothesis','Evidence basis','Intervention','Alternatives considered','Users / stakeholders','Professional judgment boundary','Confidentiality considerations','Success measures','Quality measures','Risk measures','Owner','Duration','Review gate','Stop condition','Scale condition','Next evidence required'];

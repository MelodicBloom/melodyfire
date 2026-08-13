import type { EvidenceRecord } from './caseStudy';
export const evidenceChain: EvidenceRecord[] = [
 {id:'source',claim:'A bounded source is retained with scope and identity.',evidenceClass:'observed',sourceIds:['seed-loom'],confidence:'high',limitations:['A source does not establish an interpretation.'],status:'verified'},
 {id:'observation',claim:'A descriptive record captures what the source supports.',evidenceClass:'observed',sourceIds:['source'],confidence:'high',limitations:['Limited to the recorded context.'],status:'verified'},
 {id:'interpretation',claim:'A possible meaning is kept separate from description.',evidenceClass:'derived',sourceIds:['observation'],confidence:'medium',limitations:['Alternative readings remain possible.'],status:'working'},
 {id:'inference',claim:'A testable implication connects evidence to action.',evidenceClass:'derived',sourceIds:['interpretation'],confidence:'medium',limitations:['Requires validation.'],status:'working'},
 {id:'assumption',claim:'An unverified dependency is made visible.',evidenceClass:'hypothesis',sourceIds:['inference'],confidence:'low',limitations:['Could be falsified by contextual evidence.'],status:'working'},
 {id:'alternatives',claim:'Competing explanations and actions are preserved.',evidenceClass:'derived',sourceIds:['observation','interpretation'],confidence:'medium',limitations:['Set may be incomplete.'],status:'working'},
 {id:'decision',claim:'A human-approved path records its evidence basis.',evidenceClass:'derived',sourceIds:['inference','assumption','alternatives'],confidence:'medium',limitations:['Approval does not guarantee outcome.'],status:'working'},
 {id:'validation',claim:'A defined check tests the decision in context.',evidenceClass:'proposed',sourceIds:['decision'],confidence:'not-applicable',limitations:['Measure must be set before a pilot.'],status:'proposed'},
 {id:'outcome',claim:'Results are recorded without rewriting the original rationale.',evidenceClass:'proposed',sourceIds:['validation'],confidence:'not-applicable',limitations:['No Reed Smith outcome is claimed.'],status:'proposed'},
 {id:'learning',claim:'New evidence updates—not erases—the decision history.',evidenceClass:'proposed',sourceIds:['outcome'],confidence:'not-applicable',limitations:['Requires recurring review.'],status:'proposed'},
];
export const exampleWall:EvidenceRecord[]=[
 {id:'ex-observation',claim:'EXAMPLE OBSERVATION — A participant pauses to locate the current version of a shared artifact.',evidenceClass:'demonstration',sourceIds:[],confidence:'not-applicable',limitations:['Neutral demonstration; not observed at Reed Smith.'],status:'example'},
 {id:'ex-interpretation',claim:'EXAMPLE INTERPRETATION — Version status may not be visible at the decision point.',evidenceClass:'demonstration',sourceIds:['ex-observation'],confidence:'low',limitations:['One of several possible explanations.'],status:'example'},
 {id:'ex-theme',claim:'EXAMPLE THEME — Context continuity at handoffs.',evidenceClass:'demonstration',sourceIds:['ex-observation','ex-interpretation'],confidence:'low',limitations:['Would require multiple records.'],status:'example'},
 {id:'ex-opportunity',claim:'EXAMPLE OPPORTUNITY — Test a visible handoff record before considering automation.',evidenceClass:'demonstration',sourceIds:['ex-theme'],confidence:'not-applicable',limitations:['Potential intervention, not recommendation or outcome.'],status:'example'},
];

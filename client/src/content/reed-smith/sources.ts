export type SourceClass='PUBLIC PRIMARY'|'PORTFOLIO PRIMARY'|'DERIVED INTERPRETATION'|'PROPOSED METHOD'|'DEMONSTRATION DATA';
export const sources=[
 {id:'role',title:'Innovation Lab Strategist posting (public search record; availability may change)',href:'https://www.linkedin.com/jobs/search/?keywords=Reed%20Smith%20Innovation%20Lab%20Strategist',kind:'PUBLIC PRIMARY' as SourceClass,note:'Role framing only; no internal-practice inference.'},
 {id:'lab',title:'Reed Smith — Innovation',href:'https://www.reedsmith.com/en/innovation',kind:'PUBLIC PRIMARY' as SourceClass,note:'Public firm context, including Innovation Lab leadership references.'},
 {id:'solutions',title:'Reed Smith — news and insights',href:'https://www.reedsmith.com/en/news',kind:'PUBLIC PRIMARY' as SourceClass,note:'Public index for the stated July 2026 Legal Solutions launch; verify the final article URL when published.'},
 {id:'seed-loom',title:'Seed Loom',href:'https://github.com/qt314wink/seed-loom',kind:'PORTFOLIO PRIMARY' as SourceClass,note:'Evidence and decision provenance.'},
 {id:'philly',title:'Philly Civic AI',href:'https://github.com/MelodicBloom/philly-civic-ai',kind:'PORTFOLIO PRIMARY' as SourceClass,note:'Contextual service design.'},
 {id:'omni',title:'Omni-Loom',href:'https://github.com/MelodicBloom/omni-loom-case-study',kind:'PORTFOLIO PRIMARY' as SourceClass,note:'Governed implementation architecture.'},
 {id:'nse',title:'NSE Knowledge Base',href:'https://github.com/MelodicBloom/nse-kb',kind:'PORTFOLIO PRIMARY' as SourceClass,note:'Institutional memory lifecycle.'},
 {id:'specimen',title:'Research sprint specimen on this page',href:'#research-specimen',kind:'PROPOSED METHOD' as SourceClass,note:'Not completed client work.'},
 {id:'demo',title:'Evidence wall and scoring examples',href:'#evidence-wall',kind:'DEMONSTRATION DATA' as SourceClass,note:'Neutral examples, not findings.'},
];

import { interviewPrompts } from '../../content/reed-smith/researchProtocol';
export function InterviewGuide(){return <details className="rs-details"><summary>Open the semi-structured interview guide <span>8 prompts</span></summary><ol>{interviewPrompts.map(x=><li key={x}>{x}</li>)}</ol></details>}

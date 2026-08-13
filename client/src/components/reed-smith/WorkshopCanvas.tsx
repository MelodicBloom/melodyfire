import { workshop } from '../../content/reed-smith/researchProtocol';
export function WorkshopCanvas(){return <section aria-labelledby="workshop"><h3 id="workshop">75-minute workshop architecture</h3><ol className="rs-workshop">{workshop.map(([time,title,duty])=><li key={time}><time>{time}</time><div><b>{title}</b><p>{duty}</p></div></li>)}</ol></section>}

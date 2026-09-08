"use client";
import {useEffect,useState} from 'react';
import {ArrowUpRight,ArrowDown,Menu,X,Play,Phone,Mail,Warehouse,Route,Droplets} from 'lucide-react';
import ArchitectureScene from './scene';
import {Hero34} from '@/components/hero34';
const phases=['Fundație','Structură','Arhitectură','Clădire'];
export default function Home(){
 const[menu,setMenu]=useState(false),[phase,setPhase]=useState(0),[ready,setReady]=useState(false),[unavailable,setUnavailable]=useState(false),[command,setCommand]=useState({step:0,id:0});
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 const choose=(step:number)=>setCommand(c=>({step,id:c.id+1}));
 return <>
  <a className="skip-link" href="#continut">Sari la conținut</a>
  <main id="continut">
   <section className="assembly-story" aria-label="Din idee în construcție">
    <div className="assembly-sticky">
     <div className="contact-strip"><div><a href="tel:+40740225554"><Phone size={13}/> 0740 225 554</a><a href="mailto:office@tomorogaconstruct.ro"><Mail size={14}/> office@tomorogaconstruct.ro</a></div><span>Idei. Teren. Realitate.</span></div>
     <header className="site-header">
      <a href="#" className="brand" aria-label="Tomoroga Construct — Antrepriză generală"><img src="/tomoroga-logo.png" alt="Tomoroga Construct — Antrepriză generală"/></a>
      <nav className={menu?'navigation is-open':'navigation'} aria-label="Navigare principală"><a href="#expertiza" onClick={()=>setMenu(false)}>Ce construim</a><a href="#compania" onClick={()=>setMenu(false)}>Despre noi</a><a href="#contact" onClick={()=>setMenu(false)}>Ai un proiect? <ArrowUpRight size={17}/></a></nav>
      <button className="menu-toggle" aria-label={menu?'Închide meniul':'Deschide meniul'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
     </header>
     <Hero34 className="construction-hero" badge={undefined} heading={<>Construcții civile<br/>și industriale.</>} description="De la prima linie pe plan, la ultimul detaliu pus în operă. Construim cu grijă, din 2004." buttons={{primary:{text:'Discută un proiect',url:'#contact'},secondary:{text:'Descoperă serviciile',url:'#expertiza'}}} details={<div className="hero-services"><span><Warehouse/> Construcții<br/>industriale</span><span><Route/> Lucrări de<br/>infrastructură</span><span><Droplets/> Rețele de apă<br/>și canalizare</span></div>} media={
      <div className="architecture-stage" data-ready={ready}>
       <ArchitectureScene command={command} onPhase={setPhase} onReady={()=>setReady(true)} onUnavailable={()=>{setUnavailable(true);setReady(false)}}/>
       {unavailable&&<p className="webgl-message">Explorarea 3D necesită un browser cu WebGL activ. Descoperă mai jos ce construim.</p>}
       <div className="scene-caption"><span>O viziune. Fiecare detaliu.</span><span>Studiu 3D interactiv</span></div>
      </div>
     }/>
     <div className="construction-controls"><span><ArrowDown size={17}/> Derulează pentru a explora straturile</span><div className="stage-controls" role="group" aria-label="Etapele construcției">{phases.map((label,i)=><button key={label} onClick={()=>choose(i)} disabled={!ready} aria-pressed={phase===i} className={phase===i?'is-active':''}>{label}</button>)}<button className="play-assembly" onClick={()=>choose(4)} disabled={!ready}><Play size={14}/> Vezi asamblarea</button></div></div>

    </div>
   </section>
   <section className="expertise content-wrap" id="expertiza"><div className="section-intro"><h2>Solid, în esență.<br/><span>Atent, în fiecare detaliu.</span></h2><p>Suntem Tomoroga Construct.<br/>Antrepriză generală din 2004.</p></div><div className="services"><a href="https://www.tomorogaconstruct.ro/constructii-civile/" target="_blank" rel="noreferrer"><h3>Construcții civile</h3><span>Locuri pentru oameni.</span><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/constructii-industriale/" target="_blank" rel="noreferrer"><h3>Construcții industriale</h3><span>Spații pentru ceea ce urmează.</span><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/" target="_blank" rel="noreferrer"><h3>Reabilitare</h3><span>Un nou capitol pentru clădiri existente.</span><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/lucrari-de-infrastructura/" target="_blank" rel="noreferrer"><h3>Infrastructură</h3><span>Legăturile care fac totul posibil.</span><ArrowUpRight/></a></div></section>
   <section className="company" id="compania"><div className="content-wrap"><p>De la prima linie pe plan<br/>până la ultimul detaliu<br/><span>pus în operă.</span></p><div className="company-bottom"><span>Tomoroga Construct</span><div>Construcții civile și industriale, reabilitări și infrastructură. Experiență construită din 2004.<a href="https://www.facebook.com/tomorogaconstruct2004/" target="_blank" rel="noreferrer">Urmărește activitatea noastră <ArrowUpRight size={17}/></a></div></div></div></section>
   <footer className="contact content-wrap" id="contact"><h2>Ce construim<br/><a href="mailto:office@tomorogaconstruct.ro">împreună? <ArrowUpRight/></a></h2><div className="contact-details"><a href="mailto:office@tomorogaconstruct.ro">office@tomorogaconstruct.ro</a><a href="tel:+40740225554">0740 225 554</a><span>Luni – Vineri, 9:00 – 17:00</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Tomoroga Construct</span><span>Prototip de prezentare</span><a href="#">Înapoi sus ↑</a></div></footer>
  </main>
 </>;
}

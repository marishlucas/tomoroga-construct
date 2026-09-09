"use client";
import {useEffect,useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import ArchitectureScene from './scene';
import {Hero8} from '@/components/hero8';
import HomeSections from '@/components/home-sections';
import PageMotion from '@/components/page-motion';
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
     <header className="site-header">
      <a href="#" className="brand" aria-label="Tomoroga Construct — Antrepriză generală"><img src="/tomoroga-logo.png" alt="Tomoroga Construct — Antrepriză generală"/></a>
      <nav className={menu?'navigation is-open':'navigation'} aria-label="Navigare principală"><a href="#expertiza" onClick={()=>setMenu(false)}>Ce construim</a><a href="#compania" onClick={()=>setMenu(false)}>Despre noi</a><a href="#contact" onClick={()=>setMenu(false)}>Ai un proiect? <ArrowUpRight size={17}/></a></nav>
      <button className="menu-toggle" aria-label={menu?'Închide meniul':'Deschide meniul'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
     </header>
     <Hero8 media={
      <div className="architecture-stage" data-ready={ready}>
       <ArchitectureScene command={command} onPhase={setPhase} onReady={()=>setReady(true)} onUnavailable={()=>{setUnavailable(true);setReady(false)}}/>
       {unavailable&&<p className="webgl-message">Explorarea 3D necesită un browser cu WebGL activ. Descoperă mai jos ce construim.</p>}
      </div>
     } controls={
      <div className="hero8-controls">
       <span className="model-label">O viziune. Fiecare detaliu.</span>
       <div className="stage-controls" role="group" aria-label="Etapele construcției">{phases.map((label,i)=><button key={label} onClick={()=>choose(i)} disabled={!ready} aria-pressed={phase===i} className={phase===i?'is-active':''}>{label}</button>)}</div>
      </div>
     }/>

    </div>
   </section>
   <HomeSections />
   <PageMotion sceneReady={ready} />
  </main>
 </>;
}

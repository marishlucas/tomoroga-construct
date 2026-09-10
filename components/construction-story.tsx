'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUpRight,Menu,X} from 'lucide-react';
import gsap from 'gsap';
import Image from 'next/image';
import {SplitText} from 'gsap/SplitText';
import ArchitectureScene from '@/app/scene';
import {storyChapters} from '@/lib/construction-story';

export default function ConstructionStory(){
 const [menu,setMenu]=useState(false),[phase,setPhase]=useState(0),[ready,setReady]=useState(false),[unavailable,setUnavailable]=useState(false);
 const [command,setCommand]=useState({step:0,id:0});
 const root=useRef<HTMLElement>(null),copy=useRef<HTMLDivElement>(null),initial=useRef(true);
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[]);
 useLayoutEffect(()=>{
  if(!ready && !unavailable)return;
  gsap.registerPlugin(SplitText);
  let disposed=false;const media=gsap.matchMedia();
  void document.fonts.ready.then(()=>{
   if(disposed)return;
   media.add('(prefers-reduced-motion:no-preference)',()=>{
    const panel=copy.current;if(!panel)return;
    const first=initial.current;initial.current=false;
    const split=SplitText.create(panel.querySelector('.story-title')!,{type:'words,chars',aria:'auto'});
    gsap.fromTo(split.chars,{yPercent:28,opacity:0},{yPercent:0,opacity:1,duration:.2,delay:first?.25:0,stagger:{amount:.1},ease:'power2.out'});
    gsap.fromTo(panel.querySelectorAll('p,a'),{y:8,opacity:0},{y:0,opacity:1,duration:.2,delay:first?.35:.07,stagger:.035,ease:'power2.out'});
    delete document.documentElement.dataset.heroIntro;
    return()=>split.revert();
   });
   delete document.documentElement.dataset.heroIntro;
  });
  return()=>{disposed=true;media.revert()};
 },[phase,ready,unavailable]);
 useLayoutEffect(()=>{
  if(!ready)return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion:no-preference)',()=>{
   gsap.fromTo(root.current?.querySelector('.story-scene')??null,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.2,delay:.45,ease:'power2.out',clearProps:'clipPath'});
   gsap.fromTo(root.current?.querySelectorAll('.story-bottom button,.story-scroll')??[],{y:8,opacity:0},{y:0,opacity:1,duration:.2,delay:.55,stagger:.035,clearProps:'transform,opacity'});
  });return()=>media.revert();
 },[ready]);
 const chapter=storyChapters[phase];
 const choose=(step:number)=>setCommand(c=>({step,id:c.id+1}));
 return <section className="construction-story" ref={root} data-ready={ready} data-unavailable={unavailable} aria-label="Povestea unei construcții">
  <div className="story-sticky">
   <div className="story-scene"><ArchitectureScene command={command} onPhase={setPhase} onReady={()=>setReady(true)} onUnavailable={()=>setUnavailable(true)}/></div>
   <header className="site-header story-header">
    <a href="#continut" className="brand" aria-label="Tomoroga Construct — Antrepriză generală"><Image src="/tomoroga-logo.png" alt="Tomoroga Construct — Antrepriză generală" width={179} height={179} priority/></a>
    <nav id="story-navigation" className={menu?'navigation is-open':'navigation'} aria-label="Navigare principală"><a href="#contact" onClick={()=>setMenu(false)}>Proiectul tău</a><a href="#compania" onClick={()=>setMenu(false)}>Despre noi</a><a href="#contact" onClick={()=>setMenu(false)}>Ai un proiect? <ArrowUpRight size={17}/></a></nav>
    <button className="menu-toggle" aria-label={menu?'Închide meniul':'Deschide meniul'} aria-expanded={menu} aria-controls="story-navigation" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
   </header>
   <div className="story-content">
    <div className="story-copy" key={phase} ref={copy}>
     {phase===0?<h1 className="story-title">{chapter.title}<br/><span>{chapter.accent}</span></h1>:<><h1 className="sr-only">Din idee, în realitate.</h1><h2 className="story-title">{chapter.title}<br/><span>{chapter.accent}</span></h2></>}
     <p className="story-description">{chapter.text}</p>
     <a className="story-cta" href="#contact">Să discutăm proiectul tău <ArrowUpRight size={18}/></a>
     {phase>0&&phase<6&&<p className="story-detail">{chapter.detail}</p>}
    </div>
   </div>
   {unavailable&&<p className="story-fallback">Explorarea 3D nu este disponibilă în acest browser. <a href="#contact">Discută proiectul tău <ArrowDown size={15}/></a></p>}
   <div className="story-bottom">
    <a className="story-scroll" href="#contact"><ArrowDown size={16}/><span>{phase===6?'Spune-ne despre proiectul tău':'Derulează. Construim pas cu pas.'}</span></a>
    <nav className="story-chapters" aria-label="Etapele construcției">{storyChapters.map((item,i)=><button key={item.label} onClick={()=>choose(i)} disabled={!ready||unavailable} aria-current={phase===i?'step':undefined}>{item.label}</button>)}</nav>
    <span className="story-illustration">Model ilustrativ</span>
   </div>
  </div>
 </section>;
}

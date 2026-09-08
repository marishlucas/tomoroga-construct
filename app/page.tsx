"use client";
import { useEffect, useState } from 'react';
import { ArrowUpRight, RotateCcw, Move, Menu, X } from 'lucide-react';
import ArchitectureScene from './scene';
import { buttonVariants } from '@/components/ui/button';

export default function Home(){
 const [menu,setMenu]=useState(false),[view,setView]=useState(0),[ready,setReady]=useState(false),[unavailable,setUnavailable]=useState(false);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 return <>
  <a className="skip-link" href="#continut">Sari la conținut</a>
  <header className="site-header wrap">
   <a href="#" className="brand" aria-label="Tomoroga Construct — Antrepriză generală"><img src="/tomoroga-logo.png" alt="Tomoroga Construct — Antrepriză generală"/></a>
   <nav className={menu?'navigation is-open':'navigation'} aria-label="Navigare principală"><a href="#proiecte" onClick={()=>setMenu(false)}>Proiecte</a><a href="#expertiza" onClick={()=>setMenu(false)}>Expertiză</a><a href="#compania" onClick={()=>setMenu(false)}>Despre noi</a><a className="nav-contact" href="#contact" onClick={()=>setMenu(false)}>Hai să discutăm <ArrowUpRight size={17}/></a></nav>
   <button className="menu-toggle" aria-label={menu?'Închide meniul':'Deschide meniul'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="continut">
   <section className="hero" aria-labelledby="hero-title">
    <div className="hero-intro wrap"><h1 id="hero-title">Construim viitorul.<br/><span>Păstrăm caracterul.</span></h1><div className="hero-copy"><p>Construcții civile, industriale și reabilitare.<br/>Din 2004, de la proiect la execuție.</p><a className={buttonVariants({size:"lg",className:"hero-cta"})} href="#contact">Să discutăm proiectul tău <ArrowUpRight size={19}/></a></div></div>
    <figure id="proiecte" className="architecture-model" aria-label="Model arhitectural tridimensional">
     <div className="architecture-stage"><ArchitectureScene view={view} onReady={()=>setReady(true)} onUnavailable={()=>{setReady(false);setUnavailable(true)}}/>{unavailable&&<p className="webgl-message">Modelul 3D necesită WebGL. Deschide pagina într-un browser cu accelerare grafică activată.</p>}</div>
     <figcaption className="model-caption wrap"><div><h2>Caracterul stă în detalii.</h2><span>Studiu 3D inspirat de arhitectura proiectelor noastre</span></div><div className="model-actions"><span><Move size={16}/> Trage pentru a explora</span><button disabled={!ready} onClick={()=>setView(n=>n+1)} aria-label="Schimbă perspectiva modelului"><RotateCcw size={18}/> Schimbă perspectiva</button></div></figcaption>
    </figure>
   </section>
   <section className="expertise wrap" id="expertiza"><div className="section-heading"><h2>De la fundație,<br/>la identitatea unui loc.</h2><p>Construim clădiri noi și intervenim asupra celor existente. Fiecare lucrare pornește de la cerințele sale, cu atenție la structură, funcțiune și detaliu.</p></div><div className="expertise-body"><div className="services"><a href="https://www.tomorogaconstruct.ro/constructii-civile/" target="_blank" rel="noreferrer"><h3>Construcții civile</h3><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/constructii-industriale/" target="_blank" rel="noreferrer"><h3>Construcții industriale</h3><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/" target="_blank" rel="noreferrer"><h3>Reabilitare</h3><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/lucrari-de-infrastructura/" target="_blank" rel="noreferrer"><h3>Infrastructură & rețele</h3><ArrowUpRight/></a><a href="https://www.tomorogaconstruct.ro/inchirieri-utilaje/" target="_blank" rel="noreferrer"><h3>Închirieri utilaje</h3><ArrowUpRight/></a></div></div></section>
   <section className="company" id="compania"><div className="wrap company-grid"><h2>Continuitatea<br/>se construiește.</h2><div><p>Tomoroga Construct este o companie de construcții civile și industriale, activă din 2004. Lucrările noastre includ construcții noi, reabilitări și infrastructură.</p><a className="text-link" href="https://www.facebook.com/tomorogaconstruct2004/" target="_blank" rel="noreferrer">Urmărește activitatea noastră <ArrowUpRight size={19}/></a></div></div></section>
   <footer id="contact" className="contact wrap"><div className="contact-top"><h2>Orice proiect începe<br/>cu o conversație.</h2><a className="contact-cta" href="mailto:office@tomorogaconstruct.ro">Să discutăm <ArrowUpRight size={24}/></a></div><div className="contact-details"><a href="mailto:office@tomorogaconstruct.ro">office@tomorogaconstruct.ro</a><a href="tel:+40740225554">0740 225 554</a><span>Luni – Vineri, 9:00 – 17:00</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Tomoroga Construct</span><a href="https://www.facebook.com/tomorogaconstruct2004/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14}/></a><span>Prototip de prezentare</span></div></footer>
  </main>
 </>;
}

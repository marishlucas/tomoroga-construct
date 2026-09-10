'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {createHouse} from '@/lib/house-model';
import {chapterStops} from '@/lib/construction-story';

type Props={command:{step:number;id:number};onPhase:(n:number)=>void;onReady:()=>void;onUnavailable:()=>void};
export default function ArchitectureScene({command,onPhase,onReady,onUnavailable}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);
 const select=useRef<((n:number)=>void)|null>(null);
 const callbacks=useRef({onPhase,onReady,onUnavailable});
 useEffect(()=>{callbacks.current={onPhase,onReady,onUnavailable}},[onPhase,onReady,onUnavailable]);
 useEffect(()=>{if(command.id)select.current?.(command.step)},[command]);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas:el,antialias:true,alpha:false,powerPreference:'low-power'})}catch{callbacks.current.onUnavailable();return}
  gsap.registerPlugin(ScrollTrigger);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.toneMapping=THREE.NoToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#f5f3ec');
  const camera=new THREE.OrthographicCamera(-20,20,10,-10,.1,180);
  scene.add(new THREE.AmbientLight(0xffffff,.24));
  const sun=new THREE.DirectionalLight(0xffffff,3.5);sun.position.set(-13,22,13);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-22,right:22,top:24,bottom:-24,near:.5,far:95});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;scene.add(sun);
  const house=createHouse(scene);
  const state={floor:0,upper:0,roof:0,land:1,pipeBuild:0,groundBuild:1,upperBuild:1,roofBuild:1,cx:17,cy:13,cz:22,tx:0,ty:3,tz:0,zoom:1};
  let alive=true,visible=true,raf=0,lastPhase=-1,aspect=1,mobile=false;
  const story=el.closest<HTMLElement>('.construction-story')!;
  const render=()=>{if(!alive||raf||!visible||document.hidden)return;raf=requestAnimationFrame(()=>{raf=0;renderer.render(scene,camera)})};
  const update=()=>{
   [house.layers[1].position.y,house.layers[2].position.y,house.layers[3].position.y]=[state.floor,state.upper,state.roof];
   house.layers.slice(1).forEach(g=>{g.visible=g.position.y<32});
   // Move the trees fully beyond the camera before hiding; reverse brings them back down.
   house.landscape.position.y=(1-state.land)*32;
   house.landscape.visible=state.land>.001;
   for(const part of house.parts){
    const build=part.layer===0?state.pipeBuild:part.layer===1?state.groundBuild:part.layer===2?state.upperBuild:state.roofBuild;
    const fraction=THREE.MathUtils.clamp((build-part.start)/part.duration,0,1);
    const eased=1-Math.pow(1-fraction,3);
    part.object.visible=fraction>0;
    part.object.position.y=part.baseY+(1-eased)*part.drop;
    const fade=THREE.MathUtils.smoothstep(fraction,0,.42);
    for(const {material,opacity} of part.fadeMaterials){
     material.opacity=opacity*fade;
     material.transparent=material.opacity<1;
     material.depthWrite=fade>=.99;
    }
    // Windows grow subtly from their opening; walls and slabs retain their real dimensions.
    if(part.kind==='window')part.object.scale.setScalar(.92+.08*eased);
   }
   house.world.rotation.y=-.08;
   camera.position.set(state.cx,state.cy,state.cz);camera.lookAt(state.tx,state.ty,state.tz);
   const half=mobile?9/aspect:8.6;
   const shiftX=mobile?0:half*aspect*.34;
   const shiftY=mobile?half*(.26+Math.max(0,.85-state.zoom)*.7):0;
   camera.left=-half*aspect-shiftX;camera.right=half*aspect-shiftX;
   camera.top=half+shiftY;camera.bottom=-half+shiftY;
   camera.zoom=mobile?Math.min(state.zoom,1.5):state.zoom*.9;
   camera.updateProjectionMatrix();render();
  };
  // Holds alternate with camera/build moves. Everything scrubs from one clock.
  const timeline=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'},onUpdate:update});
  timeline.to(state,{duration:.1},0)
   .to(state,{floor:2.8,upper:6.4,roof:10.2,cx:18,cy:17,cz:23,ty:9,zoom:.6,land:0,duration:.1},.1)
   .to(state,{floor:38,upper:44,roof:50,cx:12,cy:17,cz:18,ty:0,zoom:1.25,duration:.09},.23)
   .to(state,{pipeBuild:1,duration:.095,ease:'none'},.305)
   .to(state,{cx:8,cy:10,cz:15,tx:1,ty:.1,tz:2.3,zoom:1.85,duration:.05},.32)
   .set(state,{groundBuild:0,upperBuild:0,roofBuild:0},.32)
   .to(state,{floor:0,cx:17,cy:14,cz:23,tx:0,ty:1.6,tz:0,zoom:1.08,duration:.055},.41)
   .to(state,{groundBuild:1,duration:.12,ease:'none'},.43)
   .to(state,{upper:0,cx:21,cy:14,cz:19,ty:3,zoom:1.05,duration:.055},.56)
   .to(state,{upperBuild:1,duration:.12,ease:'none'},.58)
   .to(state,{roof:0,cx:14,cy:17,cz:23,ty:4,zoom:1.12,duration:.055},.71)
   .to(state,{roofBuild:1,duration:.14,ease:'none'},.73)
   .to(state,{cx:17,cy:13,cz:22,ty:3,zoom:1,land:1,duration:.09},.88)
   .to(state,{duration:.03},.97);
  const phaseAt=(progress:number)=>{
   const bounds=[0,.12,.28,.43,.58,.73,.91];
   let phase=0;bounds.forEach((p,i)=>{if(progress>=p)phase=i});
   if(phase!==lastPhase){lastPhase=phase;callbacks.current.onPhase(phase)}
   story.style.setProperty('--story-progress',String(progress));el.dataset.progress=progress.toFixed(3);
  }
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;mobile=w<=700;aspect=w/h;renderer.setSize(w,h,false);update()};
  const ro=new ResizeObserver(resize);ro.observe(el);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render()});io.observe(el);
  const onVisibility=()=>render();document.addEventListener('visibilitychange',onVisibility);
  const media=gsap.matchMedia();
  media.add({motion:'(prefers-reduced-motion:no-preference)',reduced:'(prefers-reduced-motion:reduce)'},context=>{
   if(context.conditions?.reduced){
    timeline.progress(0);phaseAt(0);
    select.current=n=>{timeline.progress(chapterStops[n]);phaseAt(chapterStops[n])};return;
   }
   const driver={p:0};
   const animation=gsap.to(driver,{p:1,duration:1,ease:'none',paused:true,onUpdate:()=>{timeline.progress(driver.p);phaseAt(driver.p)}});
   const trigger=ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',animation,scrub:.45,invalidateOnRefresh:true});
   select.current=n=>window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*chapterStops[n],behavior:'smooth'});
   return()=>{trigger.kill();animation.kill()};
  });
  const lost=(event:Event)=>{event.preventDefault();callbacks.current.onUnavailable()};
  el.addEventListener('webglcontextlost',lost);
  resize();phaseAt(0);renderer.render(scene,camera);callbacks.current.onReady();
  return()=>{alive=false;select.current=null;media.revert();timeline.kill();cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',onVisibility);el.removeEventListener('webglcontextlost',lost);house.dispose();renderer.dispose();sun.shadow.map?.dispose()};
 },[]);
 return <canvas className="architecture-canvas" ref={canvas} aria-label="Casă 3D ilustrativă: fundație, instalații, parter, etaj și acoperiș, construite pe măsură ce derulezi."/>;
}

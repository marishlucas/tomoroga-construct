"use client";
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
type Props={command:{step:number;id:number};onPhase:(n:number)=>void;onReady:()=>void;onUnavailable:()=>void};
export default function ArchitectureScene({command,onPhase,onReady,onUnavailable}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),select=useRef<((n:number)=>void)|null>(null),cb=useRef({onPhase,onReady,onUnavailable});cb.current={onPhase,onReady,onUnavailable};
 useEffect(()=>{if(command.id)select.current?.(command.step)},[command]);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas:el,antialias:true,alpha:false,powerPreference:'low-power'})}catch{cb.current.onUnavailable();return}
  gsap.registerPlugin(ScrollTrigger);const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.NoToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#dedcc8');
  const camera=new THREE.OrthographicCamera(-12,12,10,-10,.1,180);camera.position.set(17,13,22);camera.lookAt(0,3,0);
  scene.add(new THREE.AmbientLight(0xffffff,.24));const sun=new THREE.DirectionalLight(0xffffff,3.5);sun.position.set(-13,22,13);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-23,right:23,top:23,bottom:-23,near:.5,far:85});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;scene.add(sun);
  const materials:THREE.Material[]=[],geos:THREE.BufferGeometry[]=[],cache=new Map<string,THREE.BufferGeometry>();
  function inkMaterial(paper:string,shadow:string,grain=.065){
   const mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0});const light=new THREE.Color(paper),shade=new THREE.Color(shadow);
   mat.onBeforeCompile=shader=>{shader.uniforms.inkLight={value:light};shader.uniforms.inkShadow={value:shade};shader.uniforms.grainStrength={value:grain};shader.fragmentShader='uniform vec3 inkLight;\nuniform vec3 inkShadow;\nuniform float grainStrength;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`float illumination = dot(reflectedLight.directDiffuse, vec3(0.2126,0.7152,0.0722));
     float lightMask=smoothstep(0.035,0.13,illumination);
     vec3 midtone=mix(inkShadow,inkLight,0.64);
     outgoingLight=mix(inkShadow,mix(midtone,inkLight,smoothstep(0.15,0.75,illumination)),lightMask);
     #include <opaque_fragment>`).replace('#include <dithering_fragment>',`#include <dithering_fragment>
     float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453)-0.5;
     gl_FragColor.rgb += grain*grainStrength;`)};
   mat.customProgramCacheKey=()=>paper+shadow;materials.push(mat);return mat;
  }
  const concrete=inkMaterial('#e9e5d2','#285741'),stone=inkMaterial('#d7d3bd','#376149'),metal=inkMaterial('#e6e6d4','#183f2d'),dark=inkMaterial('#769477','#16432f'),glass=inkMaterial('#b4c5aa','#204b37',.045),wood=inkMaterial('#ccc6a4','#45654b'),foliage=inkMaterial('#9bae88','#245039');
  const outline=new THREE.LineBasicMaterial({color:0x274431,transparent:true,opacity:.55});materials.push(outline);
  const world=new THREE.Group();scene.add(world);const layers=Array.from({length:4},()=>{const g=new THREE.Group();world.add(g);return g});
  const geo=(key:string,fn:()=>THREE.BufferGeometry)=>{let g=cache.get(key);if(!g){g=fn();cache.set(key,g);geos.push(g)}return g};
  function mesh(parent:THREE.Object3D,g:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,lined=false){const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(lined){const e=geo('edge'+g.uuid,()=>new THREE.EdgesGeometry(g,28));m.add(new THREE.LineSegments(e,outline))}return m}
  const box=(p:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material=concrete,lined=false)=>mesh(p,geo(`b${w},${h},${d}`,()=>new THREE.BoxGeometry(w,h,d)),mat,x,y,z,lined);
  const cyl=(p:THREE.Object3D,r:number,h:number,x:number,y:number,z:number,mat:THREE.Material=metal)=>mesh(p,geo(`c${r},${h}`,()=>new THREE.CylinderGeometry(r,r,h,12)),mat,x,y,z);
  function beam(p:THREE.Object3D,a:number[],b:number[],width=.08,mat:THREE.Material=metal){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);const m=box(p,width,delta.length(),width,...from.clone().add(to).multiplyScalar(.5).toArray() as [number,number,number],mat);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m}
  // Excavated site with retaining walls and layered ground, not a floating display plinth.
  box(layers[0],19,.75,15.5,.2,-.65,.3,stone,true);box(layers[0],18.6,.15,15.2,.2,-.19,.3,stone);
  box(layers[0],12,.9,9.8,0,-.28,0,concrete,true);box(layers[0],11.5,.15,9.3,0,.21,0,stone,true);
  for(const x of[-5.9,5.9])for(let z=-4.5;z<4.8;z+=.75)box(layers[0],.10,.65,.045,x,-.16,z,metal);
  const xs=[-4.9,-2.45,0,2.45,4.9],zs=[-3.8,0,3.8];
  for(const x of xs)for(const z of zs){box(layers[0],.72,.4,.72,x,.38,z,concrete,true);for(const dx of[-.15,.15])for(const dz of[-.15,.15])cyl(layers[0],.016,.55,x+dx,.55,z+dz,metal)}
  // Three occupied structural floors. The right bays remain exposed during construction.
  for(let f=0;f<3;f++){
   const parent=layers[f+1],y=.52+f*2.64;
   box(parent,10.8,.24,8.4,0,y,0,concrete,true);
   for(const x of xs)for(const z of zs){box(parent,.28,2.40,.32,x,y+1.32,z,concrete,true);box(parent,.41,.12,.45,x,y+2.46,z,stone)}
   for(const z of zs)box(parent,10.3,.28,.3,0,y+2.41,z,concrete,true);
   for(const x of xs)box(parent,.28,.3,8.0,x,y+2.42,0,concrete);
   // Dark inset glazing, slim mullions, concrete reveals and sills.
   if(f<2)for(const x of[-3.67,-1.22,1.22]){
    box(parent,2.13,1.93,.065,x,y+1.29,3.82,glass);
    for(const dx of[-1.09,0,1.09])box(parent,.038,2.15,.10,x+dx,y+1.32,3.89,metal);
    for(const dy of[.25,1.45,2.37])box(parent,2.2,.035,.11,x,y+dy,3.88,metal);
    box(parent,2.23,.095,.2,x,y+.24,3.88,stone,true);
   }
   // Ribbed industrial wall on the left and back, each panel has depth.
   box(parent,.13,2.20,7.7,-5.08,y+1.32,0,stone);
   for(let z=-3.72;z<=3.8;z+=.2)box(parent,.075,2.2,.035,-5.17,y+1.32,z,metal);
   box(parent,7.30,2.2,.12,-1.25,y+1.32,-3.98,stone);
   for(let x=-4.9;x<2.4;x+=.22)box(parent,.038,2.2,.07,x,y+1.32,-4.08,metal);
   // Visible workspace furnishings make the building legible at human scale.
   for(const x of[-3.2,.4])for(const z of[-1.8,1.5]){
    box(parent,1.5,.085,.66,x,y+.83,z,wood,true);for(const dx of[-.62,.62])for(const dz of[-.23,.23])box(parent,.04,.67,.04,x+dx,y+.46,z+dz,metal);
    box(parent,.40,.045,.4,x,y+.50,z-.6,metal);box(parent,.40,.48,.045,x,y+.72,z-.77,metal);
    for(const dx of[-.14,.14])box(parent,.025,.44,.025,x+dx,y+.26,z-.6,metal);
    if(f===0)box(parent,.36,.26,.035,x,y+.99,z,glass,true);
   }
   // Floor-to-floor stair and landing in the open right-hand bay.
   for(let i=0;i<14;i++)box(parent,1.12,.095,.21,3.55,y+.13+i*.177,-2.9+i*.215,concrete,true);
   for(const x of[2.95,4.15]){beam(parent,[x,y+.75,-2.9],[x,y+3.04,-.05],.038);for(let i=0;i<7;i++)beam(parent,[x,y+.25+i*.354,-2.8+i*.43],[x,y+.95+i*.354,-2.8+i*.43],.025)}
   // Balustrade across the open terrace bay.
   for(let x=2.5;x<5;x+=.31)box(parent,.025,.88,.025,x,y+.68,3.93,metal);
   box(parent,2.55,.04,.055,3.75,y+1.14,3.93,metal);
  }
  // Roof trusses, diagonal bracing, purlins, partially installed standing-seam covering.
  const roof=layers[3],roofY=8.68;
  for(const z of[-3.8,-1.9,0,1.9,3.8]){
   beam(roof,[-5.05,roofY,z],[0,roofY+1.83,z],.13);beam(roof,[0,roofY+1.83,z],[5.05,roofY,z],.13);beam(roof,[-5.05,roofY,z],[5.05,roofY,z],.10);
   for(let x=-4;x<=4;x+=1.0){const height=1.83*(1-Math.abs(x)/5.05);beam(roof,[x,roofY,z],[x,roofY+height,z],.055);beam(roof,[x,roofY,z],[Math.min(x+1,5),roofY+1.83*(1-Math.abs(Math.min(x+1,5))/5.05),z],.055)}
  }
  for(let x=-4.8;x<5;x+=1.2)beam(roof,[x,roofY+1.83*(1-Math.abs(x)/5.05),-4.1],[x,roofY+1.83*(1-Math.abs(x)/5.05),4.1],.07);
  const roofPanel=box(roof,5.36,.08,8.4,-2.52,roofY+.98,0,stone,true);roofPanel.rotation.z=Math.atan2(1.83,5.05);
  for(let z=-4.1;z<4.2;z+=.20){const rib=box(roof,5.37,.035,.028,-2.52,roofY+1.04,z,metal);rib.rotation.z=Math.atan2(1.83,5.05)}
  // External scaffolding, tied back to the slab edge with diagonal braces.
  for(const z of[-3.7,-1.2,1.3,3.8])for(const x of[5.5,6.35])cyl(layers[0],.025,8.3,x,4.30,z,metal);
  for(const y of[1.1,3.7,6.3,8.25]){for(const x of[5.5,6.35])beam(layers[0],[x,y,-3.8],[x,y,3.9],.03);for(const z of[-2.5,0,2.5])box(layers[0],.9,.07,2.4,5.92,y,z,wood);for(const z of[-3.7,-1.2,1.3])beam(layers[0],[6.35,y,z],[6.35,Math.min(y+2.6,8.7),z+2.5],.025)}
  // Timber stacks, concrete pipes and stored blocks around the active site.
  for(const [x,z]of[[-6.8,3.9],[6.7,5.5],[-3.0,5.8]]){
   for(let l=0;l<5;l++)for(let k=0;k<4;k++)box(layers[0],1.5,.12,.16,x,.03+l*.13,z+k*.2,wood,l===4);
   for(const dx of[-.6,.6])box(layers[0],.12,.1,.95,x+dx,-.03,z+.3,metal);
  }
  const pipeG=geo('pipe',()=>{const s=new THREE.Shape();s.absarc(0,0,.42,0,Math.PI*2,false);const hole=new THREE.Path();hole.absarc(0,0,.32,0,Math.PI*2,true);s.holes.push(hole);return new THREE.ExtrudeGeometry(s,{depth:2.45,bevelEnabled:false,curveSegments:24})});
  for(const [x,y]of[[3.0,.32],[3.85,.32],[3.43,1.03]])mesh(layers[0],pipeG,concrete,x,y,5.0,true);
  for(let k=0;k<12;k++)box(layers[0],.42,.24,.55,-6.9+(k%3)*.45,.06+Math.floor(k/6)*.26,-3.5+Math.floor((k%6)/3)*.6,stone,true);
  // Sparse trees frame the architecture, with deterministic irregular crowns.
  function tree(x:number,z:number,size:number){cyl(layers[0],.09,size*.72,x,size*.34,z,dark);for(let i=0;i<7;i++){const a=i*2.4,r=.55+(i%3)*.16;const m=mesh(layers[0],geo('leaf',()=>new THREE.IcosahedronGeometry(1,1)),foliage,x+Math.cos(a)*r,size*.7+(i%3)*.32,z+Math.sin(a)*r);m.scale.set(size*.35,size*.39,size*.33)}}
  tree(-7.2,-5.1,3.6);tree(-8,0,2.5);tree(7.4,-5.3,3.3);tree(-5.3,6.4,1.6);
  // Survey pegs, retaining-wall seams and scattered site aggregate.
  for(const x of[-8.6,8.6])for(const z of[-6.6,6.8]){box(layers[0],.08,.6,.08,x,.19,z,dark);box(layers[0],.11,.07,.11,x,.52,z,concrete)}
  let seed=731;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const rubbleG=geo('rubble',()=>new THREE.IcosahedronGeometry(.12,0));const rubble=new THREE.InstancedMesh(rubbleG,stone,170),matrix=new THREE.Matrix4();for(let i=0;i<170;i++){let x=(rand()-.5)*18,z=(rand()-.5)*14;if(Math.abs(x)<6&&Math.abs(z)<4.8)x=6.5+rand()*2;matrix.compose(new THREE.Vector3(x,-.025,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(),rand(),rand())),new THREE.Vector3(1+rand(),.5+rand(),1+rand()));rubble.setMatrixAt(i,matrix)}rubble.castShadow=true;rubble.receiveShadow=true;layers[0].add(rubble);
  // The background also receives the same green shadows and printed grain.
  const ground=mesh(scene,geo('ground',()=>new THREE.PlaneGeometry(150,150)),concrete,0,-1.055,0);ground.rotation.x=-Math.PI/2;
  const state={progress:0,orbit:0};let alive=true,visible=true,raf=0,lastPhase=-1;
  const render=()=>{if(!alive||raf||!visible||document.hidden)return;raf=requestAnimationFrame(()=>{raf=0;renderer.render(scene,camera)})};
  const update=()=>{const p=state.progress;for(let i=1;i<4;i++){const value=THREE.MathUtils.smoothstep(p,(i-1)*.24,.4+(i-1)*.24);layers[i].position.y=(1-value)*i*1.8;layers[i].rotation.y=(1-value)*(i%2?-.045:.045)}world.rotation.y=-.08+state.orbit+(1-p)*.10;camera.zoom=.87+p*.26;camera.lookAt(0,3.7+(1-p)*2.5,0);camera.updateProjectionMatrix();const phase=Math.min(3,Math.floor(p*3.99));if(lastPhase!==phase){lastPhase=phase;cb.current.onPhase(phase)}el.dataset.progress=p.toFixed(3);render()};
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h,half=Math.max(8.9,10/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();update()};
  const ro=new ResizeObserver(resize);ro.observe(el);const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)render()});io.observe(el);const vis=()=>render();document.addEventListener('visibilitychange',vis);
  const context=gsap.matchMedia();
  context.add({desktop:'(min-width:701px)',mobile:'(max-width:700px)',reducedMotion:'(prefers-reduced-motion:reduce)'},media=>{
   if(media.conditions?.reducedMotion)return;
   const story=el.closest('.assembly-story') as HTMLElement;
   ScrollTrigger.create({
    trigger:story,start:'top top',
    // Mobile has no pinned section: complete while the model is still on screen.
    end:media.conditions?.desktop?'bottom bottom':()=>`+=${Math.max(el.clientHeight,el.getBoundingClientRect().top-story.getBoundingClientRect().top)}`,
    onUpdate:self=>gsap.to(state,{progress:self.progress,duration:.5,overwrite:true,ease:'power2.out',onUpdate:update}),
   });
   return()=>{gsap.killTweensOf(state)};
  });
  select.current=n=>{if(n===4){state.progress=0;update()}gsap.to(state,{progress:n===4?1:n/3,duration:reduced.matches?0:n===4?3.8:1.7,ease:n===4?'none':'power3.inOut',overwrite:true,onUpdate:update})};
  let dragging=false,start=0,initial=0;const down=(e:PointerEvent)=>{if(e.pointerType==='touch')return;dragging=true;start=e.clientX;initial=state.orbit;el.setPointerCapture(e.pointerId)};const move=(e:PointerEvent)=>{if(dragging){state.orbit=initial+(e.clientX-start)*.004;update()}};const up=()=>{dragging=false};const lost=(e:Event)=>{e.preventDefault();cb.current.onUnavailable()};
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('webglcontextlost',lost);resize();renderer.render(scene,camera);cb.current.onReady();
  return()=>{alive=false;select.current=null;context.revert();gsap.killTweensOf(state);cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',vis);el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('webglcontextlost',lost);geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose()};
 },[]);
 return <canvas className="architecture-canvas" ref={canvas} aria-label="Șantier 3D detaliat: clădire industrială, structură, schele și materiale"/>;
}

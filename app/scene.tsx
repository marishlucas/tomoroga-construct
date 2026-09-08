"use client";
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
type Props={view:number;onReady:()=>void;onUnavailable:()=>void};
export default function ArchitectureScene({view,onReady,onUnavailable}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),change=useRef<(()=>void)|null>(null),last=useRef(view);
 const ready=useRef(onReady),unavailable=useRef(onUnavailable);ready.current=onReady;unavailable.current=onUnavailable;
 useEffect(()=>{if(view!==last.current){last.current=view;change.current?.()}},[view]);
 useEffect(()=>{
  const element=canvas.current;if(!element)return;
  let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({canvas:element,alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true})}catch{unavailable.current();return}
  gsap.registerPlugin(ScrollTrigger);const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)');
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-20,20,8,-8,.1,150);camera.position.set(15,10,29);camera.lookAt(0,3.0,0);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.05);scene.environment=env.texture;scene.environmentIntensity=.35;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0x858174,2.0));const sun=new THREE.DirectionalLight(0xfff9ed,3.3);sun.position.set(-12,23,16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:.5,far:65});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;sun.shadow.radius=4;scene.add(sun);const fill=new THREE.DirectionalLight(0xeef3ff,.8);fill.position.set(17,10,-12);scene.add(fill);
  const stone=new THREE.MeshStandardMaterial({color:0xcac4b5,roughness:.88});
  const trim=new THREE.MeshStandardMaterial({color:0xe2ded3,roughness:.78});
  const shadowStone=new THREE.MeshStandardMaterial({color:0xaba697,roughness:.9});
  const roofMat=new THREE.MeshStandardMaterial({color:0x69534a,metalness:.42,roughness:.53});
  const seamMat=new THREE.LineBasicMaterial({color:0x493e39});
  const glass=new THREE.MeshPhysicalMaterial({color:0x3b4542,metalness:.36,roughness:.18,envMapIntensity:.9});
  const iron=new THREE.MeshStandardMaterial({color:0x393e37,roughness:.65,metalness:.3});
  const baseMat=new THREE.MeshStandardMaterial({color:0xe9e7df,roughness:1});
  const model=new THREE.Group();scene.add(model);const house=new THREE.Group();model.add(house);
  const geometries:THREE.BufferGeometry[]=[],cache=new Map<string,THREE.BufferGeometry>();
  const geom=(key:string,create:()=>THREE.BufferGeometry)=>{let g=cache.get(key);if(!g){g=create();cache.set(key,g);geometries.push(g)}return g};
  function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material=trim){const g=geom(`b${w},${h},${d}`,()=>new THREE.BoxGeometry(w,h,d));const m=new THREE.Mesh(g,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  function cylinder(parent:THREE.Object3D,rt:number,rb:number,h:number,x:number,y:number,z:number,mat:THREE.Material=trim,segments=16){const g=geom(`c${rt},${rb},${h},${segments}`,()=>new THREE.CylinderGeometry(rt,rb,h,segments));const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  // Solid masses, coursed masonry, raised end pavilions and central risalit.
  box(model,23,.25,12.3,0,-.28,.3,baseMat);box(model,22.2,.13,11.5,0,-.10,.3,trim);
  box(house,18.7,.55,6.9,0,.26,0,shadowStone);
  box(house,18.3,5.8,6.2,0,3.43,0,stone);
  box(house,4.8,5.93,7.0,0,3.47,.30,stone);
  for(const x of [-6.75,6.75])box(house,4.8,5.90,6.8,x,3.46,.13,stone);
  const fronts=[{x:0,w:4.9,z:3.86},{x:-6.75,w:4.92,z:3.59},{x:6.75,w:4.92,z:3.59},{x:-3.48,w:2.03,z:3.15},{x:3.48,w:2.03,z:3.15}];
  for(const f of fronts){
   for(const[y,h,d]of [[.56,.13,.15],[3.10,.14,.18],[3.27,.09,.25],[6.28,.15,.26],[6.43,.11,.38],[6.52,.07,.46]])box(house,f.w,h,d,f.x,y,f.z,trim);
   for(let y=.85;y<3;y+=.27)box(house,f.w,.018,.014,f.x,y,f.z-.042,shadowStone);
   for(const side of [-1,1])for(let y=.73;y<6.15;y+=.34)box(house,(Math.round(y*100)%2===0)?.4:.49,.255,.12,f.x+side*(f.w/2-.21),y,f.z+.015,trim);
  }
  // Side and rear cornices continue around the building; geometry works from every angle.
  for(const x of [-9.22,9.22])for(const[y,h,w]of [[.58,.12,.22],[3.11,.14,.18],[3.28,.09,.24],[6.28,.15,.26],[6.43,.11,.36]])box(house,w,h,6.9,x,y,.05,trim);
  for(const[y,h,d]of [[.57,.13,.15],[3.1,.14,.18],[3.27,.09,.25],[6.28,.15,.26],[6.43,.11,.38]])box(house,18.7,h,d,0,y,-3.14,trim);
  // Mansard roofs: four sloping metal faces with individual standing seams.
  function mansard(x:number,z:number,w:number,d:number,bottom:number,height:number){
   const tw=w*.61,td=d*.68;const vs=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2],[-tw/2,height,-td/2],[tw/2,height,-td/2],[tw/2,height,td/2],[-tw/2,height,td/2]];
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vs.flat(),3));g.setIndex([0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0,4,7,6,4,6,5]);g.computeVertexNormals();geometries.push(g);const mesh=new THREE.Mesh(g,roofMat);mesh.position.set(x,bottom,z);mesh.castShadow=true;mesh.receiveShadow=true;house.add(mesh);
   const points:number[]=[];for(let k=1;k<18;k++){const t=k/18;for(const side of[-1,1]){points.push(x-w/2+w*t,bottom+.01,z+side*d/2,x-tw/2+tw*t,bottom+height+.01,z+side*td/2);points.push(x+side*w/2,bottom+.01,z-d/2+d*t,x+side*tw/2,bottom+height+.01,z-td/2+td*t)}}
   const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geometries.push(lineGeo);house.add(new THREE.LineSegments(lineGeo,seamMat));
   box(house,tw+.06,.12,td+.06,x,bottom+height,z,roofMat);
   for(const sx of[-1,1])for(const sz of[-1,1])cylinder(house,.025,.04,.38,x+sx*(tw/2-.05),bottom+height+.21,z+sz*(td/2-.05),iron,8);
  }
  mansard(-6.75,.13,5.05,7.08,6.55,1.98);mansard(6.75,.13,5.05,7.08,6.55,1.98);mansard(0,.15,5.05,7.24,6.55,1.76);
  for(const x of[-3.48,3.48])mansard(x,-.03,2.08,6.38,6.43,1.01);
  // Glazing set behind thick sculpted surrounds, with muntins and projecting sills.
  function windowShape(w:number,h:number,arched:boolean){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);if(arched){s.lineTo(w/2,h-w/2);s.absarc(0,h-w/2,w/2,0,Math.PI,false)}else{s.lineTo(w/2,h);s.lineTo(-w/2,h)}s.lineTo(-w/2,0);return s}
  function windowAt(x:number,y:number,z:number,w=.70,h=1.58,arch=false,rotation=0){const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=rotation;house.add(group);
   const key=`window${w},${h},${arch}`;const paneG=geom(key,()=>new THREE.ShapeGeometry(windowShape(w,h,arch),20));const pane=new THREE.Mesh(paneG,glass);pane.position.z=.021;group.add(pane);
   const frameG=geom('frame'+key,()=>{const s=windowShape(w+.20,h+.16,arch);const hole=windowShape(w,h-.015,arch);s.holes.push(new THREE.Path(hole.getPoints(24)));return new THREE.ExtrudeGeometry(s,{depth:.095,bevelEnabled:false,curveSegments:20})});const frame=new THREE.Mesh(frameG,trim);frame.position.set(0,-.055,.015);frame.castShadow=true;group.add(frame);
   box(group,.039,h-.03,.06,0,h/2,.087,trim);box(group,w,.04,.06,0,h*.47,.087,trim);if(arch)box(group,w,.04,.06,0,h-w/2,.087,trim);
   box(group,w+.29,.095,.27,0,-.07,.10,trim);box(group,w+.27,.075,.18,0,h+.11,.06,trim);
  }
  for(const cx of[-6.75,6.75])for(const dx of[-1.23,0,1.23]){windowAt(cx+dx,.99,3.56,.70,1.64);windowAt(cx+dx,3.83,3.56,.70,1.75)}
  for(const x of[-3.47,3.47]){windowAt(x,1.00,3.12,.70,1.6);windowAt(x,3.83,3.12,.70,1.73)}
  for(const x of[-1.35,0,1.35]){windowAt(x,3.72,3.84,.83,2.05,true);windowAt(x,.73,3.84,.86,2.00,x===0)}
  for(const side of[-1,1])for(const z of[-2.0,-.2,1.6]){windowAt(side*9.155,1.0,z,.70,1.62,false,side*Math.PI/2);windowAt(side*9.155,3.84,z,.70,1.74,false,side*Math.PI/2)}
  for(let x=-8.1;x<8.5;x+=1.35){windowAt(x,.99,-3.112,.70,1.62,false,Math.PI);windowAt(x,3.83,-3.112,.70,1.72,false,Math.PI)}
  // The central pediment is a solid triangular extrusion, with a recessed tympanum.
  function pediment(w:number,h:number,y:number,z:number,mat:THREE.Material){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:.15,bevelEnabled:false});geometries.push(g);const m=new THREE.Mesh(g,mat);m.position.set(0,y,z);m.castShadow=true;house.add(m)}
  pediment(5.32,1.34,6.37,3.90,trim);pediment(4.66,1.06,6.50,4.065,shadowStone);pediment(4.23,.86,6.56,4.22,stone);
  box(house,5.50,.12,.52,0,6.40,4.00,trim);box(house,5.34,.09,.45,0,6.54,4.01,trim);
  // Four entrance columns, entablature and stone balcony balustrades.
  for(const x of[-1.98,-.71,.71,1.98]){box(house,.43,.15,.43,x,.68,4.79,trim);cylinder(house,.22,.23,.12,x,.81,4.79);cylinder(house,.145,.178,2.25,x,1.99,4.79);cylinder(house,.21,.16,.14,x,3.16,4.79);box(house,.47,.15,.46,x,3.28,4.79,trim)}
  box(house,5.47,.19,1.57,0,3.45,4.44,trim);box(house,5.62,.095,1.69,0,3.59,4.44,trim);
  for(let i=0;i<17;i++){const x=-2.48+i*.31;cylinder(house,.041,.055,.52,x,3.98,5.19,trim,8);cylinder(house,.073,.061,.18,x,3.98,5.19,trim,8)}
  box(house,5.31,.10,.16,0,4.29,5.19,trim);for(const x of[-2.58,2.58]){box(house,.18,.67,.18,x,3.98,5.17,trim);box(house,.23,.10,.23,x,4.33,5.17,trim);box(house,.10,.10,1.38,x,4.28,4.48,trim)}
  for(let i=0;i<5;i++)box(model,5.7+i*.22,.11*(5-i),.37,0,.055*(5-i),5.02+i*.35,trim);
  // Downpipes, rooftop chimneys and ridge details complete the silhouette.
  for(const x of[-8.98,8.98,-2.4,2.4])cylinder(house,.036,.036,5.88,x,3.43,x===-2.4||x===2.4?3.96:3.70,roofMat,8);
  for(const x of[-4.8,4.8]){box(house,.49,1.05,.52,x,7.23,-1.7,stone);box(house,.61,.13,.64,x,7.80,-1.7,trim)}
  const groundG=new THREE.PlaneGeometry(160,160);geometries.push(groundG);const groundM=new THREE.ShadowMaterial({color:0x555345,opacity:.17});const ground=new THREE.Mesh(groundG,groundM);ground.rotation.x=-Math.PI/2;ground.position.y=-.415;ground.receiveShadow=true;scene.add(ground);
  let alive=true,visible=true,raf=0,drag=false,startX=0,startAngle=0;
  const render=()=>{if(!alive||raf||!visible||document.hidden)return;raf=requestAnimationFrame(()=>{raf=0;renderer.render(scene,camera)})};
  const resize=()=>{const w=element.clientWidth,h=element.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;const half=mobile.matches?13/aspect:6.4;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();render()};
  const ro=new ResizeObserver(resize);ro.observe(element);resize();const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)render()},{rootMargin:'100px'});io.observe(element);
  const docVisibility=()=>{if(!document.hidden)render()};document.addEventListener('visibilitychange',docVisibility);
  const animation=gsap.context(()=>{if(!reduced.matches){gsap.from(house.position,{y:-.35,duration:1.5,ease:'power3.out',onUpdate:render});gsap.from(model.rotation,{y:-.14,duration:2,ease:'power3.out',onUpdate:render})}});
  change.current=()=>{gsap.to(model.rotation,{y:model.rotation.y+Math.PI/2,duration:reduced.matches?0:1.7,ease:'power3.inOut',overwrite:true,onUpdate:render})};
  const down=(e:PointerEvent)=>{if(e.pointerType==='touch')return;drag=true;startX=e.clientX;startAngle=model.rotation.y;gsap.killTweensOf(model.rotation);element.setPointerCapture(e.pointerId)};
  const move=(e:PointerEvent)=>{if(drag){model.rotation.y=startAngle+(e.clientX-startX)*.006;render()}};
  const up=()=>{drag=false};const lost=(e:Event)=>{e.preventDefault();element.style.visibility='hidden';unavailable.current()};
  element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('webglcontextlost',lost);
  renderer.render(scene,camera);ready.current();
  return()=>{alive=false;change.current=null;animation.revert();gsap.killTweensOf(model.rotation);cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',docVisibility);element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());[stone,trim,shadowStone,roofMat,seamMat,glass,iron,baseMat,groundM].forEach(m=>m.dispose());env.dispose();renderer.dispose()};
 },[]);
 return <canvas className="architecture-canvas" ref={canvas} aria-label="Model 3D al unei clădiri clasice cu mansardă, coloane și ferestre arcuite"/>;
}

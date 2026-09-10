import * as THREE from 'three';

/** Original two-tone ink shader, applied to individually animated construction layers. */
export function createHouse(scene: THREE.Scene) {
  type Kind='pipe'|'slab'|'wall'|'stair'|'window'|'truss'|'roof'|'trim';
  const pieces:Array<{object:THREE.Object3D;kind:Kind;layer:number}>=[];
  let kind:Kind='wall';
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
  const landscape=new THREE.Group();world.add(landscape);
  const geo=(key:string,fn:()=>THREE.BufferGeometry)=>{let g=cache.get(key);if(!g){g=fn();cache.set(key,g);geos.push(g)}return g};
  function mesh(parent:THREE.Object3D,g:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,lined=false){const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);const layer=layers.indexOf(parent as THREE.Group);if(layer>0)pieces.push({object:m,kind,layer});if(lined){const e=geo('edge'+g.uuid,()=>new THREE.EdgesGeometry(g,28));m.add(new THREE.LineSegments(e,outline))}return m}
  const box=(p:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material=concrete,lined=false)=>mesh(p,geo(`b${w},${h},${d}`,()=>new THREE.BoxGeometry(w,h,d)),mat,x,y,z,lined);
  const cyl=(p:THREE.Object3D,r:number,h:number,x:number,y:number,z:number,mat:THREE.Material=metal)=>mesh(p,geo(`c${r},${h}`,()=>new THREE.CylinderGeometry(r,r,h,12)),mat,x,y,z);
  function beam(p:THREE.Object3D,a:number[],b:number[],width=.08,mat:THREE.Material=metal){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);const m=box(p,width,delta.length(),width,...from.clone().add(to).multiplyScalar(.5).toArray() as [number,number,number],mat);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m}
  const [foundation,parter,etaj,roof]=layers;
  // A cut ground section makes the strip footings and service runs readable.
  box(foundation,13,.66,16,0,-.61,2.5,stone,true);
  box(foundation,12.8,.1,15.8,0,-.33,2.5,stone);
  for(const x of[-4.7,0,4.7])box(foundation,.65,.9,7.8,x,.12,0,concrete,true);
  box(foundation,10,.9,.65,0,.12,-3.7,concrete,true);
  // Service penetrations leave clearance through the front footing, with concrete above and below.
  const penetrations=[[-4.25,-3.5],[-2.85,-2.15],[1.82,2.58]];
  let edge=-5;
  for(const [left,right] of penetrations){
   box(foundation,left-edge,.9,.65,(left+edge)/2,.12,3.7,concrete,true);
   box(foundation,right-left,.19,.65,(left+right)/2,.475,3.7,concrete,true);
   box(foundation,right-left,.18,.65,(left+right)/2,-.24,3.7,concrete,true);
   edge=right;
  }
  box(foundation,5-edge,.9,.65,(edge+5)/2,.12,3.7,concrete,true);
  for(const x of[-4.7,0,4.7])for(const z of[-3.7,0,3.7]){
   box(foundation,.95,.3,.95,x,-.1,z,concrete,true);
   for(const dx of[-.15,.15])for(const dz of[-.15,.15])cyl(foundation,.018,.55,x+dx,.45,z+dz,metal);
  }
  function pipe(p:THREE.Object3D,a:number[],b:number[],r=.095){
   const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);
   const m=mesh(p,geo(`tube${r},${delta.length()}`,()=>new THREE.CylinderGeometry(r,r,delta.length(),16)),dark,...from.clone().add(to).multiplyScalar(.5).toArray() as [number,number,number]);
   m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
   for(const t of[.05,.5,.95]){const pos=from.clone().lerp(to,t);const collar=cyl(p,r*1.2,.075,pos.x,pos.y,pos.z,metal);collar.quaternion.copy(m.quaternion)}
  }
  // Swept bends keep the service runs connected; each fitting is a laying unit.
  const pipePaths:Array<{name:string;points:number[][];radius:number}>=[];
  function service(name:string,points:number[][],radius=.10){
   pipePaths.push({name,points,radius});
   const vertices=points.map(p=>new THREE.Vector3(...p));
   const curves:THREE.Curve<THREE.Vector3>[]=[];
   let cursor=vertices[0];
   for(let i=1;i<vertices.length-1;i++){
    const prev=vertices[i-1],corner=vertices[i],next=vertices[i+1];
    const cut=Math.min(.30,prev.distanceTo(corner)*.35,next.distanceTo(corner)*.35);
    const before=corner.clone().add(prev.clone().sub(corner).normalize().multiplyScalar(cut));
    const after=corner.clone().add(next.clone().sub(corner).normalize().multiplyScalar(cut));
    if(cursor.distanceTo(before)>.001)curves.push(new THREE.LineCurve3(cursor,before));
    curves.push(new THREE.QuadraticBezierCurve3(before,corner,after));cursor=after;
   }
   curves.push(new THREE.LineCurve3(cursor,vertices.at(-1)!));
   for(const [index,curve] of curves.entries()){
    const unit=new THREE.Group();unit.name=`service:${name}:${index}`;foundation.add(unit);
    pieces.push({object:unit,kind:'pipe',layer:0});
    const geometry=new THREE.TubeGeometry(curve,curve instanceof THREE.LineCurve3?1:12,radius,12,false);geos.push(geometry);
    mesh(unit,geometry,name.startsWith('supply')?metal:dark,0,0,0);
    // Saddles meet the ground beneath raised runs and keep crossings visibly supported.
    if(curve instanceof THREE.LineCurve3&&curve.getLength()>.45&&Math.abs(curve.getTangent(.5).y)<.1){
     const mid=curve.getPoint(.5),height=mid.y-radius+.28;
     if(height>0)box(unit,radius*2.8,height,radius*2.8,mid.x,-.28+height/2,mid.z,stone);
    }
    // Couplings follow the actual tangent, including curved transitions and risers.
    for(const t of[0,1]){
     const pos=curve.getPoint(t),axis=curve.getTangent(t).normalize();
     const ring=cyl(unit,radius*1.26,.075,pos.x,pos.y,pos.z,concrete);
     ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axis);
    }
   }
  }
  // A collector with offset branches, swept elbows, cleanouts and vertical connections.
  service('collector',[[2.4,.04,5.8],[2.4,.04,4.1],[1.9,.04,3.1],[1.9,.04,1.9],[2.5,.04,1.25],[2.5,.04,-2.8]],.13);
  service('left-collector',[[2.4,.04,4.8],[-2.5,.04,4.8],[-2.5,.04,2.9],[-3.1,.04,2.3],[-3.1,.04,-2.6]],.105);
  service('bathroom',[[2.5,.04,-1.9],[3.4,.04,-1.9],[3.85,.04,-2.35],[3.85,.04,-2.8],[3.85,.48,-2.8]],.09);
  service('utility',[[1.9,.04,2.4],[3.45,.04,2.4],[3.85,.04,1.9],[3.85,.48,1.9]],.085);
  service('kitchen',[[-3.1,.04,-1.7],[-1.6,.04,-1.7],[-1.25,.04,-1.1],[-1.25,.48,-1.1]],.085);
  service('left-riser',[[-3.1,.04,1.25],[-3.8,.04,1.25],[-3.8,.48,1.25]],.08);
  service('supply-feed',[[-4.0,.30,5.4],[-4.0,.30,3.0],[-4.15,.30,2.6],[-4.15,.30,-2.7],[-3.65,.30,-2.7]],.055);
  service('supply-return',[[-3.75,.30,5.4],[-3.75,.30,3.0],[-3.9,.30,2.6],[-3.9,.30,-2.45],[-3.65,.30,-2.45]],.045);
  service('supply-kitchen',[[-4.15,.30,-.7],[-3.4,.30,-.7],[-3.1,.30,-.3],[-1.45,.30,-.3],[-1.45,.48,-.3]],.045);
  // Small manifold and shut-off handwheels are grouped so fittings land together.
  const manifold=new THREE.Group();foundation.add(manifold);pieces.push({object:manifold,kind:'pipe',layer:0});
  pipe(manifold,[-3.65,.30,-2.9],[-3.65,.30,-1.9],.085);
  for(const z of[-2.7,-2.45,-2.2]){
   cyl(manifold,.033,.16,-3.65,.41,z,metal);
   const wheel=geo('valve-wheel',()=>new THREE.TorusGeometry(.10,.018,6,16));
   const m=mesh(manifold,wheel,dark,-3.65,.50,z);m.rotation.x=Math.PI/2;
   box(manifold,.18,.022,.024,-3.65,.50,z,metal);
  }
  const cleanout=new THREE.Group();foundation.add(cleanout);pieces.push({object:cleanout,kind:'pipe',layer:0});
  pipe(cleanout,[2.4,.04,5.1],[2.4,.43,5.1],.105);
  cyl(cleanout,.14,.055,2.4,.45,5.1,concrete);box(cleanout,.13,.045,.045,2.4,.50,5.1,metal);
  // Open outlet with a visible inner wall at the end of the collection run.
  const opening=geo('openpipe',()=>{const s=new THREE.Shape();s.absarc(0,0,.18,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(0,0,.13,0,Math.PI*2,true);s.holes.push(h);return new THREE.ExtrudeGeometry(s,{depth:.3,bevelEnabled:false,curveSegments:20})});
  mesh(cleanout,opening,concrete,2.4,.04,5.7,true);
  for(let f=0;f<2;f++){
   const p=f===0?parter:etaj,y=.65+f*2.9;
   kind='slab';
   if(f===0)for(let i=0;i<5;i++)box(p,2.04,.24,8.1,-4.08+i*2.04,y,0,concrete,true);
   else{
    // Four connected slab regions leave a real opening over the stair flight.
    for(let i=0;i<4;i++)box(p,2,.24,8.1,-4.1+i*2,y,0,concrete,true);
    box(p,1,.24,8.1,4.6,y,0,concrete,true);
    box(p,1.2,.24,1.1,3.5,y,-3.5,concrete,true);
    box(p,1.2,.24,2.83,3.5,y,2.635,concrete,true);
   }
   kind='wall';
   for(const x of[-4.7,0,4.7])for(const z of[-3.7,3.7])box(p,.3,2.65,.3,x,y+1.44,z,concrete,true);
   for(const z of[-3.7,3.7])box(p,10,.26,.32,0,y+2.64,z,concrete,true);
   // Plaster walls, inset glazing and timber reveals; openings are actual holes.
   for(const z of[-3.8,3.8]){
    box(p,10,.46,.24,0,y+.34,z,concrete);
    box(p,10,.38,.24,0,y+2.61,z,concrete);
    for(const x of[-4.83,-1.65,1.65,4.83])box(p,.38,2.68,.26,x,y+1.45,z,concrete,true);
    for(const x of[-3.23,0,3.23]){
     const window=new THREE.Group();p.add(window);pieces.push({object:window,kind:'window',layer:f+1});
     box(window,2.98,1.97,.06,x,y+1.49,z,glass);
     for(const dx of[-1.47,0,1.47])box(window,.048,1.96,.12,x+dx,y+1.47,z+.05,metal);
     for(const dy of[.48,2.44])box(window,2.94,.055,.15,x,y+dy,z+.06,metal);
     box(window,2.98,.09,.35,x,y+.46,z+.1,stone,true);
    }
   }
   for(const x of[-4.85,4.85]){
    box(p,.24,2.68,3.04,x,y+1.45,-2.3,concrete,true);
    box(p,.24,2.68,2.36,x,y+1.45,2.66,concrete,true);
    box(p,.24,.46,2.34,x,y+.34,.35,concrete);
    box(p,.24,.38,2.34,x,y+2.61,.35,concrete);
    const window=new THREE.Group();p.add(window);pieces.push({object:window,kind:'window',layer:f+1});
    box(window,.06,1.98,2.34,x,y+1.48,.35,glass);
    for(const z of[-.78,.35,1.48])box(window,.16,1.98,.045,x,y+1.48,z,metal);
   }
   kind='stair';
   // A continuous concrete stair flight, with closed risers and a supported landing.
   if(f===0){
    const rise=2.9/15,run=.23,base=y+.12;
    for(let i=0;i<15;i++){
     const top=base+(i+1)*rise;
     box(p,1.16,top-base,.235,3.5,(top+base)/2,-2.8+i*run,concrete,true);
    }
    box(p,1.16,.24,.8,3.5,y+2.9,.82,concrete,true);
    for(const x of[3.04,3.96])box(p,.12,2.68,.12,x,y+1.45,1.12,concrete);
   }
   if(f===0){beam(p,[2.88,y+1.02,-2.8],[2.88,y+3.72,.42],.045);
   for(let i=0;i<8;i++)beam(p,[2.88,y+.3+i*.386,-2.8+i*.46],[2.88,y+1.02+i*.386,-2.8+i*.46],.025);}
   kind='wall';
   // One interior partition defines the rooms without hiding the construction.
   box(p,.18,2.68,5.4,-.8,y+1.45,-1.12,stone);
   if(f===1){
    kind='slab';
    box(p,7.1,.18,1.55,-1.25,y,4.55,concrete,true);
    kind='trim';
    for(let x=-4.7;x<2.3;x+=.24)box(p,.026,1.0,.03,x,y+.61,5.24,metal);
    box(p,7.2,.05,.055,-1.2,y+1.12,5.24,metal);
    for(const x of[-4.75,2.3]){box(p,.04,1.03,1.4,x,y+.60,4.55,metal);}
   }else{
    // The porch and every tread extend to the site grade, so no slab floats.
    kind='slab';
    const grade=-.29,deckTop=y-.02;
    box(p,10.4,deckTop-grade,2.2,0,(deckTop+grade)/2,4.85,stone,true);
    kind='stair';
    const stepRise=(deckTop-grade)/5;
    for(let i=0;i<4;i++){
     const top=deckTop-(i+1)*stepRise;
     box(p,3.3,top-grade,.36,-2,(top+grade)/2,6.12+i*.35,concrete,true);
    }
    kind='wall';
    for(const x of[-4.65,2.2])box(p,.15,2.75,.15,x,y+1.38,5.12,wood,true);
   }
  }
  const roofY=6.38,rise=2.02,slope=Math.atan2(rise,5.35);
  kind='slab';
  for(let i=0;i<5;i++)box(roof,2.04,.14,8.1,-4.08+i*2.04,roofY-.05,0,concrete,true);
  kind='truss';
  for(let z=-4.05;z<=4.1;z+=1.02){
   beam(roof,[-5.35,roofY,z],[0,roofY+rise,z],.13,wood);
   beam(roof,[0,roofY+rise,z],[5.35,roofY,z],.13,wood);
   beam(roof,[-5.05,roofY,z],[5.05,roofY,z],.10,wood);
   beam(roof,[0,roofY,z],[0,roofY+rise,z],.09,wood);
   for(const x of[-2.6,2.6])beam(roof,[x,roofY,z],[0,roofY+rise,z],.07,wood);
  }
  // Separate standing-seam roof bays settle after the deck and timber frame.
  for(const side of[-1,1]){
   for(let bay=0;bay<9;bay++){
    const z=-4+bay,cover=new THREE.Group();roof.add(cover);
    pieces.push({object:cover,kind:'roof',layer:3});
    const panel=box(cover,5.75,.09,1.01,side*2.67,roofY+rise/2+.08,z,metal,true);panel.rotation.z=-side*slope;
    for(let seam=0;seam<4;seam++){
     const rib=box(cover,5.76,.042,.026,side*2.67,roofY+rise/2+.14,z-.375+seam*.25,dark);rib.rotation.z=-side*slope;
    }
   }
   kind='trim';
   box(roof,.14,.18,9.0,side*5.4,roofY-.04,0,dark,true);
   pipe(roof,[side*5.35,roofY,-3.9],[side*5.35,.7,-3.9],.075);
  }
  kind='truss';
  const gable=geo('gable',()=>{
   const shape=new THREE.Shape();shape.moveTo(-4.9,0);shape.lineTo(0,rise-.12);shape.lineTo(4.9,0);shape.closePath();
   return new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false});
  });
  for(const z of[-3.95,3.9])mesh(roof,gable,concrete,0,roofY,z,true);
  kind='trim';
  box(roof,.14,.12,9,0,roofY+rise+.16,0,dark);
  box(roof,.75,1.6,.75,2.2,roofY+rise-.1,-1.9,concrete,true);
  box(roof,.95,.12,.95,2.2,roofY+rise+.74,-1.9,metal,true);
  // Quiet site context uses the same duotone palette as the building.

  function tree(x:number,z:number,size:number){
   cyl(landscape,.09,size*.7,x,size*.33-.25,z,dark);
   for(let i=0;i<6;i++){const a=i*2.4;const m=mesh(landscape,geo('leaf',()=>new THREE.IcosahedronGeometry(1,1)),foliage,x+Math.cos(a)*.5,size*.65+(i%3)*.27,z+Math.sin(a)*.5);m.scale.set(size*.32,size*.4,size*.32)}
  }
  tree(-6.8,-3.8,3.2);tree(6.6,-4.8,4.0);

  // Keep the original ink treatment, but blend its lit ground into the page paper.
  const groundMat=inkMaterial('#f5f3ec','#285741',.022);
  const ground=mesh(scene,geo('ground',()=>new THREE.PlaneGeometry(250,250)),groundMat,0,-.94,0);ground.rotation.x=-Math.PI/2;
  // Timing is shared by a whole window/roof bay, so frames and glazing travel together.
  const timing:Record<Kind,[number,number,number,number]>={
   pipe:[0,.78,.18,.85],slab:[0,.18,.19,1.4],wall:[.16,.29,.22,2.2],stair:[.32,.3,.14,.65],
   window:[.68,.12,.18,.22],truss:[.22,.2,.25,1.5],roof:[.51,.23,.22,1.2],trim:[.81,.04,.15,.15],
  };
  const counts=new Map<string,number>(),indices=new Map<string,number>();
  pieces.forEach(p=>{const key=p.layer+p.kind;counts.set(key,(counts.get(key)??0)+1)});
  const parts=pieces.map(p=>{
   const key=p.layer+p.kind,index=indices.get(key)??0;indices.set(key,index+1);
   const [start,spread,duration,drop]=timing[p.kind];
   // Each assembly unit owns opacity; shared geometry and shader programs stay cached.
   const fadeMaterials:Array<{material:THREE.Material;opacity:number}>=[];
   const copies=new Map<THREE.Material,THREE.Material>();
   p.object.traverse(node=>{
    if(!(node instanceof THREE.Mesh||node instanceof THREE.LineSegments))return;
    const copy=(original:THREE.Material)=>{
     let material=copies.get(original);
     if(!material){
      material=original.clone();material.onBeforeCompile=(shader,renderer)=>original.onBeforeCompile(shader,renderer);
      material.customProgramCacheKey=()=>original.customProgramCacheKey();
      copies.set(original,material);materials.push(material);
      fadeMaterials.push({material,opacity:original.opacity});
     }
     return material;
    };
    node.material=Array.isArray(node.material)?node.material.map(copy):copy(node.material);
   });
   return {...p,baseY:p.object.position.y,start:start+spread*index/Math.max(1,(counts.get(key)??1)-1),duration,drop,fadeMaterials};
  });
  return {world,layers,landscape,parts,pipePaths,dispose:()=>{geos.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())}};
}

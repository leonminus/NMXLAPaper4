import type { Box, Point, Scene } from './types';
export function seeded(seed: number) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function makeScene(which: number): Scene {
  const rnd = seeded(2026 + which * 7919); const points: Point[] = [];
  function add(x: number, y: number, z: number, object = 'road', r = .3) { points.push({ x: x + (rnd()-.5)*.018, y: y + (rnd()-.5)*.018, z: z + (rnd()-.5)*.018, r: Math.min(1, Math.max(0, r + (rnd()-.5)*.12)), object }); }
  // Road returns, with a distance-dependent density and brighter lane markings.
  for (let i=0;i<6100;i++) { const x=rnd()*24-12, y=rnd()*16-8; if(rnd()>.92-Math.max(x,0)*.022) continue; const lane=Math.abs(y)<.06 || Math.abs(Math.abs(y)-3.4)<.07; add(x,y,Math.abs(y)>5.4?.14:0,'road',lane?.9:.18); }
  for (let x=-11.8;x<12;x+=.09) { for(const y of [-5.4,5.4]) add(x,y,.14,'curb',.6); if(Math.floor((x+12)/1.7)%2===0) for(const y of [-1.7,1.7]) add(x,y,.015,'marking',.8); }
  const boxes: Box[]=[];
  function surface(cx:number,cy:number,cz:number,l:number,w:number,h:number,theta:number,id:string,n:number,r:number) {
    for(let i=0;i<n;i++) { const face=rnd(); let a=(rnd()-.5)*l,b=(rnd()-.5)*w,c=(rnd()-.5)*h;
      // Visible roof and the two faces facing a sensor at negative x/y.
      if(face<.35)c=h/2; else if(face<.7)b=-w/2; else a=-l/2;
      add(cx+Math.cos(theta)*a-Math.sin(theta)*b,cy+Math.sin(theta)*a+Math.cos(theta)*b,cz+c,id,r);
    }
  }
  function ring(cx:number,cy:number,cz:number,radius:number,id:string,n=80) { for(let i=0;i<n;i++){const a=rnd()*Math.PI*2;add(cx+Math.cos(a)*radius,cy,cz+Math.sin(a)*radius,id,.4);} }
  function car(id:string,x:number,y:number,theta:number,sparse=false) { boxes.push({id,label:'Car',x,y,z:.85,w:1.85,l:4.15,h:1.7,theta}); const n=sparse?180:1150; surface(x,y,.58,4.1,1.82,.85,theta,id,n,.72); surface(x-.22*Math.cos(theta),y-.22*Math.sin(theta),1.22,2.15,1.65,.72,theta,id,n*.6,.9); for(const a of [-1.35,1.35])for(const b of [-.94,.94])ring(x+a*Math.cos(theta)-b*Math.sin(theta),y+a*Math.sin(theta)+b*Math.cos(theta),.36,.35,id,sparse?15:65); }
  function human(id:string,x:number,y:number,cyclist=false,sparse=false){ const n=sparse?50:330; for(let i=0;i<n;i++){ const a=rnd()*Math.PI*2,z=.65+rnd()*.75;add(x+Math.cos(a)*.21,y+Math.sin(a)*.18,z,id,.78); } for(let i=0;i<n*.35;i++){const a=rnd()*Math.PI*2,b=rnd()*Math.PI;add(x+.17*Math.sin(b)*Math.cos(a),y+.17*Math.sin(b)*Math.sin(a),1.57+.17*Math.cos(b),id,.9);}for(const side of [-1,1])for(let i=0;i<n*.4;i++){const z=rnd()*.73;add(x+side*.13+(rnd()-.5)*.1,y+(rnd()-.5)*.13,z,id,.7);} if(!cyclist)boxes.push({id,label:'Pedestrian',x,y,z:.9,w:.65,l:.65,h:1.8,theta:Math.PI/2}); }
  if(which===0){car('car-01',-2.7,-2.8,.08);car('car-02',4.6,2.5,-.15);human('ped-01',-.7,4.7);human('ped-02',6.8,-4.5);}
  if(which===1){car('car-01',-5,-2.7,.1);human('cyclist-01',1.4,1.9,true);ring(.75,1.9,.4,.4,'cyclist-01',160);ring(2.05,1.9,.4,.4,'cyclist-01',160);for(let i=0;i<260;i++){const t=rnd();add(.75+t*1.3,1.9,.42+Math.sin(t*Math.PI)*.4,'cyclist-01',.75);}boxes.push({id:'cyclist-01',label:'Cyclist',x:1.4,y:1.9,z:.9,w:.7,l:1.9,h:1.8,theta:0});human('ped-01',-2,4.8);for(let i=0;i<440;i++){const a=rnd()*Math.PI*2;add(5+Math.cos(a)*.09,4.8+Math.sin(a)*.09,rnd()*4.6,'lamp',.65);}for(let i=0;i<100;i++)add(5-rnd()*1.1,4.8,4.6,'lamp',.8);}
  if(which===2){car('near-car',-4,-2.3,.14);car('far-car',8,1.4,-.1,true);human('far-ped',9,-4.3,false,true);surface(5.6,.6,.7,.3,2,1.4,0,'occluder',400,.45); // Remove hidden returns behind the barrier, preserving the visible upper car.
    for(let i=points.length-1;i>=0;i--)if(points[i].object==='far-car'&&points[i].z<1.25&&points[i].y<1.8)points.splice(i,1);
  }
  return {name:['Đường phố đô thị','Xe đạp & cột đèn','Xa & che khuất'][which],points,boxes};
}

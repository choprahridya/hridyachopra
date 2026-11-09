/* Original procedural sculptures. Monospace is used only to draw the artwork. */
window.createHeroArt = function(canvas,variant){
  const context=canvas.getContext('2d');
  const startedAt=performance.now();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let disposed=false,frame=0,last=0,visible=true,width=0,height=0;
  let pointer={x:0,y:0},hover=false,dragging=false,down=null,open=false;
  let turn={x:0,y:0},rotation={x:0,y:0},openAmount=0,pulseStarted=-Infinity,heartLit=false;
  const points=[];
  const normalize=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return [x/l,y/l,z/l];};
  function point(x,y,z,nx,ny,nz,tone=1,wing=0,bird=0){points.push({x,y,z,n:normalize(nx,ny,nz),tone,wing,bird});}
  function ellipsoid(cx,cy,cz,rx,ry,rz,tone=1,bird=0){
    for(let v=0;v<=Math.PI;v+=.055)for(let u=0;u<Math.PI*2;u+=.055){
      const x=Math.sin(v)*Math.cos(u),y=Math.cos(v),z=Math.sin(v)*Math.sin(u);
      point(cx+x*rx,cy+y*ry,cz+z*rz,x/rx,y/ry,z/rz,tone,0,bird);
    }
  }
  if(variant==='heart'){
    // A clean valentine silhouette with a rounded front/back surface.
    for(let a=0;a<Math.PI*2;a+=.018)for(let r=.012;r<=1;r+=.012){
      const sx=Math.pow(Math.sin(a),3);
      const sy=(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/16;
      const daX=3*Math.sin(a)*Math.sin(a)*Math.cos(a);
      const daY=(-13*Math.sin(a)+10*Math.sin(2*a)+6*Math.sin(3*a)+4*Math.sin(4*a))/16;
      const bulge=Math.sqrt(Math.max(.001,1-r*r));
      for(const side of [-1,1]){
        const x=sx*r,y=(sy+.12)*r-.12,z=side*.48*bulge*(1+.06*Math.cos(2*a));
        const dr=[sx,sy+.12,-side*.48*r/bulge*(1+.06*Math.cos(2*a))];
        const dt=[daX*r,daY*r,-side*.0576*bulge*Math.sin(2*a)];
        let nx=dr[1]*dt[2]-dr[2]*dt[1],ny=dr[2]*dt[0]-dr[0]*dt[2],nz=dr[0]*dt[1]-dr[1]*dt[0];
        if(nz*side<0){nx=-nx;ny=-ny;nz=-nz;}
        point(x,y,z,nx,ny,nz,1);
      }
    }
  }else if(variant==='butterfly'){
    const bezier=(a,b,c,d,t)=>{const q=1-t;return [q*q*q*a[0]+3*q*q*t*b[0]+3*q*t*t*c[0]+t*t*t*d[0],q*q*q*a[1]+3*q*q*t*b[1]+3*q*t*t*c[1]+t*t*t*d[1]];};
    const boundary=(segments)=>segments.flatMap(segment=>Array.from({length:25},(_,i)=>bezier(...segment,i/24)));
    const upperShape=boundary([[[.07,.32],[.34,.8],[.88,1.48],[1.28,1.14]],[[1.28,1.14],[1.72,.77],[1.1,.13],[.11,-.1]],[[.11,-.1],[.1,.03],[.09,.22],[.07,.32]]]);
    const lowerShape=boundary([[[.1,.02],[.58,-.02],[1.2,-.18],[1.03,-.72]],[[1.03,-.72],[.85,-1.19],[.3,-1.07],[.08,-.28]],[[.08,-.28],[.08,-.18],[.09,-.06],[.1,.02]]]);
    function inside(x,y,shape){let hit=false;for(let i=0,j=shape.length-1;i<shape.length;j=i++){const a=shape[i],b=shape[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
    function edgeDistance(x,y,shape){let distance=9;for(const a of shape)distance=Math.min(distance,Math.hypot(x-a[0],y-a[1]));return distance;}
    for(const side of [-1,1])for(const upper of [true,false]){
      const shape=upper?upperShape:lowerShape;
      for(let x=.055;x<1.55;x+=.017)for(let y=upper?-.1:-1.15;y<(upper?1.35:.03);y+=.017){
        if(!inside(x,y,shape))continue;
        const r=Math.hypot(x,y-.12),angle=Math.atan2(y-.12,x);
        const z=.12*Math.sin(x*2)+.045*Math.cos(y*3);
        const edge=edgeDistance(x,y,shape);
        const eye=Math.hypot((x-(upper?.98:.59))/(upper?.23:.19),(y-(upper?.67:-.57))/(upper?.28:.21));
        const vein=Math.pow(Math.max(0,Math.cos(angle*10+r*1.7)),24);
        let tone=.93-vein*.38;
        if(edge<.055)tone=.34;
        if(edge>.055&&edge<.09)tone=1.12;
        if(eye<1.12)tone=eye>.8?.3:eye>.48?1.17:.28;
        point(side*x,y,z,side*.06,-.04,1,tone,side);
      }
    }
    ellipsoid(0,-.05,.08,.09,.73,.1,.8);
    ellipsoid(0,.69,.09,.12,.14,.12,.9);
    for(const side of [-1,1])for(let t=0;t<=1;t+=.006){const x=side*(.04+.29*t),y=.77+.42*t,z=.06;point(x,y,z,0,0,1,.7);}
  }else{
    const birds=[{cx:-.28,cy:.24,s:.92,id:1},{cx:1.05,cy:.78,s:.48,id:2},{cx:.67,cy:-.87,s:.58,id:3}];
    birds.forEach(({cx,cy,s,id})=>{
      const add=(x,y,z,nx,ny,nz,tone=1,wing=0)=>point(cx+x*s,cy+y*s,z*s,nx,ny,nz,tone,wing,id);
      for(const side of [-1,1])for(let u=.015;u<1;u+=.01)for(let v=-1;v<=1;v+=.026){
        const feather=.03*Math.cos(u*54)*Math.pow(u,.4);
        const span=.36*Math.pow(1-u,.65)+feather;
        const x=side*(.08+1.15*u),y=.12+.64*Math.sin(u*1.9)+v*span,z=.06+Math.sin(u*Math.PI)*.15;
        add(x,y,z,side*.1,.2,1,.65+.32*(1-v*v)-.12*Math.cos(u*54),side);
      }
      // Body, head, and forked tail make the silhouette read as a bird.
      ellipsoid(cx,cy-.05*s,.12*s,.16*s,.42*s,.17*s,.95,id);
      ellipsoid(cx,cy+.34*s,.13*s,.14*s,.16*s,.14*s,1,id);
      for(let t=0;t<1;t+=.025)for(let q=-1;q<=1;q+=.1)add(.07*q*(1-t),.45+t*.21,.13,0,.5,1,.65);
      for(const side of [-1,1])for(let u=0;u<=1;u+=.018)for(let v=-1;v<=1;v+=.05)add(side*(.03+u*.14)+v*.07,-.35-u*.37,.03,0,0,1,.8);
    });
  }
  const projected=new Float32Array(points.length*4);
  function resize(){
    if(disposed)return;
    const box=canvas.getBoundingClientRect();width=box.width;height=box.height;
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);
    draw(performance.now());
  }
  function draw(time){
    if(disposed||!width||!height)return;
    const dark=document.body.dataset.mode==='dark';
    const cols=Math.min(190,Math.max(65,Math.round(width/(['butterfly','heart'].includes(variant)?6:5.5)))),rows=Math.round(height/(width/cols*1.45));
    const cw=width/cols,ch=height/rows;
    const depths=new Float32Array(cols*rows).fill(-Infinity),lights=new Float32Array(cols*rows);
    const t=reduced?0:time/1000;
    const pulseAge=(time-pulseStarted)/1000;
    const pulse=variant==='heart'&&!reduced?(Math.exp(-Math.pow((pulseAge-.12)/.09,2))+.65*Math.exp(-Math.pow((pulseAge-.37)/.12,2))):0;
    turn.x=Math.max(-.85,Math.min(.85,turn.x));turn.y=Math.max(-.45,Math.min(.45,turn.y));
    const ease=reduced?1:.14;
    rotation.x+=(turn.x+pointer.x*(variant==='heart'?.2:variant==='butterfly'?.5:.12)-rotation.x)*ease;
    rotation.y+=(turn.y+pointer.y*(variant==='heart'?.12:variant==='butterfly'?.3:.07)-rotation.y)*ease;
    openAmount+=((open?1:0)-openAmount)*(reduced?1:.1);
    const yaw=(variant==='heart'?.22:variant==='butterfly'?-.12:0)+(reduced?0:Math.sin(t*.4)*(variant==='heart'?.025:.07))+rotation.x;
    const pitch=-.08+rotation.y;
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    // Fit the rendered silhouette, rather than an invisible canvas bounding box.
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    for(let i=0;i<points.length;i++){
      const p=points[i];let x=p.x,y=p.y,z=p.z,nx=p.n[0],ny=p.n[1],nz=p.n[2];
      if(p.wing){
        const phase=p.bird?p.bird*.75:0;
        const fold=variant==='butterfly'?(reduced?.18:.58+Math.sin(t*(hover?1.7:.9))*(hover?.3:.18))*(1-openAmount)+openAmount*.04:.1+Math.sin(t*.8+phase)*.17;
        if(variant==='butterfly'){z+=Math.abs(x)*Math.sin(fold);x*=Math.cos(fold);}else z+=Math.abs(x)*fold;
        nz=Math.cos(fold);nx=-p.wing*Math.sin(fold);
      }
      const xr=x*cy+z*sy,zr=z*cy-x*sy,yr=y*cp-zr*sp,zf=zr*cp+y*sp;
      const nrx=nx*cy+nz*sy,nrz=nz*cy-nx*sy,nry=ny*cp-nrz*sp;
      const light=Math.max(0,nrx*-.48+nry*.54+(nrz*cp+ny*sp)*.72)+(variant==='heart'?pulse*.25+(heartLit?.18:0):0);
      const index=i*4;projected[index]=xr;projected[index+1]=yr;projected[index+2]=zf;projected[index+3]=Math.min(1,Math.max(.12,(.22+.78*light)*p.tone));
      minX=Math.min(minX,xr);maxX=Math.max(maxX,xr);minY=Math.min(minY,yr);maxY=Math.max(maxY,yr);
    }
    const insetX=cw*1.5,insetY=ch*1.5;
    const scale=(variant==='heart'?.98:1)*Math.min((width-2*insetX)/(maxX-minX||1),(height-2*insetY)/(maxY-minY||1))*(1-pulse*.055);
    const offsetX=width-insetX-maxX*scale;
    const offsetY=height*.5+(maxY+minY)*scale*.5;
    for(let i=0;i<points.length;i++){
      const at=i*4;
      const xx=Math.round((offsetX+projected[at]*scale)/cw),yy=Math.round((offsetY-projected[at+1]*scale)/ch);
      if(xx<0||xx>=cols||yy<0||yy>=rows)continue;
      const index=yy*cols+xx;
      if(projected[at+2]<=depths[index])continue;
      depths[index]=projected[at+2];lights[index]=projected[at+3];
    }
    context.clearRect(0,0,width,height);
    const artColor=getComputedStyle(document.body).getPropertyValue('--art-rgb').trim()||(dark?'162,186,255':'36,73,206');
    const glyphs='.,:;+=xX%#@';context.font=`${['butterfly','heart'].includes(variant)?'600 ':''}${Math.max(7,cw*1.25)}px ui-monospace,SFMono-Regular,Menlo,monospace`;context.textAlign='center';context.textBaseline='middle';
    for(let i=0;i<depths.length;i++){
      if(depths[i]===-Infinity)continue;
      const light=lights[i],x=i%cols,y=Math.floor(i/cols),px=(x+.5)*cw,py=(y+.5)*ch;
      if(variant==='heart'){
        const shade=Math.min(1,Math.max(0,light));
        const low=dark?[91,92,204]:[28,27,139],high=dark?[215,220,255]:[115,130,236];
        const rgb=low.map((value,index)=>Math.round(value+(high[index]-value)*shade));
        context.fillStyle=`rgba(${rgb.join(',')},${.65+shade*.35})`;
      }else context.fillStyle=`rgba(${artColor},${.38+Math.min(1,light)*.62})`;
      context.globalAlpha=['butterfly','heart'].includes(variant)?.055:.12;context.fillRect(x*cw,y*ch,cw-.7,ch-.7);context.globalAlpha=1;
      let glyphX=px,glyphY=py;
      if(variant==='heart'&&!reduced){
        const arrival=Math.max(0,1-(time-startedAt)/1000);
        const settle=arrival*arrival;
        glyphX+=Math.sin(i*12.9898)*24*settle;
        glyphY+=Math.cos(i*7.233)*20*settle;
        const mx=(pointer.x+.5)*width,my=(pointer.y+.5)*height;
        const dx=px-mx,dy=py-my,dist=Math.hypot(dx,dy);
        const influence=hover?Math.pow(Math.max(0,1-dist/100),2)*9:0;
        glyphX+=dx/(dist||1)*influence;glyphY+=dy/(dist||1)*influence;
        const ringAge=(time-pulseStarted)/1000;
        const ring=Math.exp(-Math.pow((Math.hypot(px-width*.5,py-height*.5)-ringAge*width*.65)/30,2));
        if(ringAge>=0&&ringAge<1){glyphX+=(px-width*.5)/width*ring*8;glyphY+=(py-height*.5)/height*ring*8;}
      }
      context.fillText(glyphs[Math.min(glyphs.length-1,Math.floor(light*(glyphs.length-1)))],glyphX,glyphY);
    }
  }
  function animate(time){if(disposed)return;if(visible&&!document.hidden&&time-last>1000/24){draw(time);last=time;}frame=requestAnimationFrame(animate);}
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});io.observe(canvas);
  const themeObserver=new MutationObserver(()=>draw(performance.now()));themeObserver.observe(document.body,{attributes:true,attributeFilter:['data-mode','data-palette','data-gradient']});
  function move(event){
    const r=canvas.getBoundingClientRect();hover=true;
    if(dragging&&down){turn.x=down.turnX+(event.clientX-down.x)/r.width*1.7;turn.y=Math.max(-.5,Math.min(.5,down.turnY+(event.clientY-down.y)/r.height*.8));}
    else if(event.pointerType!=='touch')pointer={x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5};
    if(reduced)draw(performance.now());
  }
  function leave(){hover=false;pointer={x:0,y:0};if(reduced)draw(performance.now());}
  function press(event){if(!['butterfly','heart'].includes(variant))return;dragging=true;down={x:event.clientX,y:event.clientY,turnX:turn.x,turnY:turn.y};canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing';}
  function release(event){if(!dragging)return;const click=down&&Math.hypot(event.clientX-down.x,event.clientY-down.y)<6;dragging=false;down=null;canvas.style.cursor='grab';if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(click)toggle();}
  function cancel(){dragging=false;down=null;canvas.style.cursor='grab';}
  function toggle(){if(variant==='heart'){pulseStarted=performance.now();heartLit=!heartLit;canvas.setAttribute('aria-pressed',String(heartLit));}else{open=!open;canvas.setAttribute('aria-pressed',String(open));}if(reduced)draw(performance.now());}
  function keyboard(event){
    if(!['butterfly','heart'].includes(variant))return;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape'].includes(event.key))event.preventDefault();
    if(event.key==='ArrowLeft')turn.x-=.15;else if(event.key==='ArrowRight')turn.x+=.15;else if(event.key==='ArrowUp')turn.y-=.1;else if(event.key==='ArrowDown')turn.y+=.1;else if(event.key==='Enter'||event.key===' ')toggle();else if(event.key==='Escape'){turn={x:0,y:0};pointer={x:0,y:0};open=false;heartLit=false;pulseStarted=-Infinity;canvas.setAttribute('aria-pressed','false');}
    if(reduced)draw(performance.now());
  }
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
  canvas.addEventListener('pointerdown',press);canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('keydown',keyboard);
  if(!reduced)frame=requestAnimationFrame(animate);
  return ()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();themeObserver.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('pointerdown',press);canvas.removeEventListener('pointerup',release);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('keydown',keyboard);};
};

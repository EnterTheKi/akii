// ─────────────────────────────────────────────
//  3D ASCII TRANSYLVANIA VAMPIRE CASTLE
//  Dense version – mouse drag to rotate, wheel to zoom
// ─────────────────────────────────────────────
(function () {
  const CH = ['.',',', "'",'`',':',';','|','#','@','o','8','=','-','*','+','/','\\','°','%','&','M','W','^','T','V'];
  const K = Object.fromEntries(CH.map((c,i)=>[c,i]));

  const L = norm([0.35,0.92,0.22]);
  function norm(v){const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];}
  const rand=(a,b)=>a+Math.random()*(b-a);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function Cloud(){this.d=[];}
  Cloud.prototype.add=function(x,y,z,nx,ny,nz,col,ch){this.d.push(x,y,z,nx,ny,nz,col,ch);};

  const C={stone:0,dark:1,blood:2,moon:3,bat:4,fog:5,gold:6,roof:7,window:8,cape:9};
  const BASE=['#4a5560','#1a1e24','#8b1a1a','#e8e4d0','#1a1a1a','#3a4550','#c9a227','#2c1810','#ff3030','#2a0a0a'];
  const LEVELS=[0.3,0.5,0.75,1.0];
  const PAL=[];
  for(const h of BASE){
    const n=parseInt(h.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
    for(const l of LEVELS)PAL.push(`rgb(${(r*l)|0},${(g*l)|0},${(b*l)|0})`);
  }

  function buildScene(){
    const s=new Cloud();

    // ===== GROUND + FOG =====
    for(let i=0;i<11000;i++){
      const r=12*Math.sqrt(Math.random()),a=Math.random()*Math.PI*2;
      s.add(r*Math.cos(a),0,r*Math.sin(a),0,1,0,C.fog,K['.']);
    }

    // ===== MAIN KEEP =====
    const kw=2.7,kh=6.5;
    for(let y=0;y<=kh;y+=0.105){
      for(let x=-kw;x<=kw;x+=0.11){
        s.add(x,y,-kw,0,0,-1,C.stone,K['#']);
        s.add(x,y, kw,0,0, 1,C.stone,K['#']);
      }
      for(let z=-kw;z<=kw;z+=0.11){
        s.add(-kw,y,z,-1,0,0,C.stone,K['#']);
        s.add( kw,y,z, 1,0,0,C.stone,K['#']);
      }
    }
    // battlements
    for(let x=-kw-0.2;x<=kw+0.2;x+=0.22){
      s.add(x,kh+0.4,-kw-0.15,0,1,0,C.roof,K['M']);
      s.add(x,kh+0.4, kw+0.15,0,1,0,C.roof,K['M']);
    }
    // red windows
    [[1.2,1.9],[-1.2,1.9],[1.2,3.6],[-1.2,3.6],[1.2,5.2],[-1.2,5.2]].forEach(([wx,wy])=>{
      s.add(wx,wy,-kw-0.04,0,0,-1,C.window,K['o']);
      s.add(wx,wy+0.28,-kw-0.04,0,0,-1,C.window,K['o']);
    });

    // ===== 4 BIG TOWERS =====
    const towers=[[-4.2,-4.2],[4.2,-4.2],[-4.2,4.2],[4.2,4.2]];
    for(const [tx,tz] of towers){
      for(let y=0;y<=9.5;y+=0.1){
        for(let a=0;a<Math.PI*2;a+=0.19){
          const r=0.82;
          s.add(tx+Math.cos(a)*r,y,tz+Math.sin(a)*r,Math.cos(a),0.1,Math.sin(a),C.stone,K['#']);
        }
      }
      // spire
      for(let y=9.5;y<=14.0;y+=0.085){
        const t=(y-9.5)/4.5,r=0.82*(1-t);
        for(let a=0;a<Math.PI*2;a+=0.26){
          s.add(tx+Math.cos(a)*r,y,tz+Math.sin(a)*r,Math.cos(a),0.45,Math.sin(a),C.roof,K['^']);
        }
      }
      // top teeth
      for(let a=0;a<Math.PI*2;a+=0.4){
        s.add(tx+Math.cos(a)*0.95,9.8,tz+Math.sin(a)*0.95,0,1,0,C.dark,K['M']);
      }
      // tower windows
      s.add(tx,5.0,tz-0.9,0,0,-1,C.window,K['o']);
      s.add(tx,5.3,tz-0.9,0,0,-1,C.window,K['o']);
    }

    // ===== CONNECTING WALLS =====
    for(let x=-4.0;x<=4.0;x+=0.13){
      for(let y=0;y<3.8;y+=0.13){
        s.add(x,y,-4.15,0,0,-1,C.stone,K['#']);
        s.add(x,y, 4.15,0,0, 1,C.stone,K['#']);
      }
    }
    for(let z=-4.0;z<=4.0;z+=0.13){
      for(let y=0;y<3.8;y+=0.13){
        s.add(-4.15,y,z,-1,0,0,C.stone,K['#']);
        s.add( 4.15,y,z, 1,0,0,C.stone,K['#']);
      }
    }

    // ===== GATE =====
    for(let y=0;y<3.9;y+=0.11){
      for(let x=-1.4;x<=1.4;x+=0.11){
        if(Math.abs(x)>0.7||y>3.1) s.add(x,y,-2.9,0,0,-1,C.dark,K['#']);
      }
    }

    // ===== MINI RUINED CASTLE (left side) =====
    const mx=-8.5,mz=1.5;
    for(let y=0;y<=3.2;y+=0.12){
      for(let x=-1.1;x<=1.1;x+=0.13){
        s.add(mx+x,y,mz-1.1,0,0,-1,C.dark,K['#']);
        s.add(mx+x,y,mz+1.1,0,0, 1,C.dark,K['#']);
      }
      for(let z=-1.1;z<=1.1;z+=0.13){
        s.add(mx-1.1,y,mz+z,-1,0,0,C.dark,K['#']);
        s.add(mx+1.1,y,mz+z, 1,0,0,C.dark,K['#']);
      }
    }
    // broken tower on mini castle
    for(let y=0;y<=5.5;y+=0.12){
      for(let a=0;a<Math.PI*2;a+=0.3){
        const r=0.55*(y>4?1-(y-4)/1.5:1);
        s.add(mx+1.6+Math.cos(a)*r,y,mz+Math.sin(a)*r,Math.cos(a),0,Math.sin(a),C.dark,K['#']);
      }
    }

    // ===== VAMPIRE (near the gate) =====
    const vx=0.3,vz=-3.6;
    // body / cape
    for(let y=0;y<2.4;y+=0.08){
      const w=0.35+y*0.08;
      for(let dx=-w;dx<=w;dx+=0.09){
        s.add(vx+dx,y,vz,0,0,-1,C.cape,K['#']);
      }
    }
    // head
    for(let a=0;a<Math.PI*2;a+=0.35){
      for(let e=0;e<1.1;e+=0.2){
        const r=0.28*Math.sin(e);
        s.add(vx+Math.cos(a)*r,2.55+Math.cos(e)*0.22,vz+Math.sin(a)*r*0.3,0,1,0,C.dark,K['o']);
      }
    }
    // red eyes
    s.add(vx-0.12,2.65,vz-0.25,0,0,-1,C.blood,K['*']);
    s.add(vx+0.12,2.65,vz-0.25,0,0,-1,C.blood,K['*']);

    // ===== DEAD TREES =====
    for(let t=0;t<11;t++){
      const tx=rand(-11,11),tz=rand(-11,11);
      if(Math.hypot(tx,tz)<6.5)continue;
      for(let y=0;y<4.2;y+=0.14)s.add(tx,y,tz,0,1,0,C.dark,K['|']);
      for(let b=0;b<6;b++){
        const a=rand(0,6.28),len=rand(0.9,1.9);
        for(let i=0;i<len;i+=0.11){
          s.add(tx+Math.cos(a)*i,2.8+i*0.2,tz+Math.sin(a)*i,0,1,0,C.dark,K['/']);
        }
      }
    }

    // ===== GRAVES =====
    for(let g=0;g<18;g++){
      const gx=rand(-10,10),gz=rand(-10,10);
      if(Math.hypot(gx,gz)<5.5)continue;
      s.add(gx,0.35,gz,0,1,0,C.stone,K['+']);
      s.add(gx,0.7,gz,0,1,0,C.stone,K['|']);
      s.add(gx,1.05,gz,0,1,0,C.stone,K['+']);
    }

    // ===== FLAGS =====
    for(const [tx,tz] of [[-4.2,-4.2],[4.2,4.2]]){
      for(let y=14.1;y<16.4;y+=0.1)s.add(tx,y,tz,0,1,0,C.dark,K['|']);
      for(let f=0;f<9;f++){
        s.add(tx+0.25+f*0.11,15.7,tz,1,0,0,C.blood,K['=']);
        s.add(tx+0.25+f*0.11,15.35,tz,1,0,0,C.blood,K['=']);
      }
    }

    // ===== BIG MOON =====
    const md=norm([-0.5,0.58,-0.7]);
    const mDist=52,mR=3.5;
    for(let rr=0;rr<=mR;rr+=0.13){
      for(let a=0;a<Math.PI*2;a+=0.1/Math.max(rr,0.13)){
        const cx=Math.cos(a)*rr,cy=Math.sin(a)*rr;
        s.add(md[0]*mDist+cx,md[1]*mDist+cy,md[2]*mDist,0,1,0,C.moon,rr>mR-0.3?K[':']:K['o']);
      }
    }

    return new Float32Array(s.d);
  }

  class Castle3D{
    constructor(canvas){
      this.canvas=canvas;
      this.ctx=canvas.getContext('2d');
      this.w=canvas.width=innerWidth;
      this.h=canvas.height=innerHeight;

      this.pts=buildScene();
      this.n=this.pts.length/8;

      this.yaw=0.85;
      this.pitch=0.28;
      this.dist=19;
      this.targetDist=19;

      this.dragging=false;
      this.lastX=0;this.lastY=0;

      canvas.addEventListener('mousedown',e=>{
        this.dragging=true;this.lastX=e.clientX;this.lastY=e.clientY;
      });
      window.addEventListener('mouseup',()=>this.dragging=false);
      window.addEventListener('mousemove',e=>{
        if(!this.dragging)return;
        this.yaw+= (e.clientX-this.lastX)*0.005;
        this.pitch=clamp(this.pitch+(e.clientY-this.lastY)*0.004,-0.35,1.15);
        this.lastX=e.clientX;this.lastY=e.clientY;
      });
      canvas.addEventListener('wheel',e=>{
        e.preventDefault();
        this.targetDist=clamp(this.targetDist+e.deltaY*0.014,8,38);
      },{passive:false});

      // many bats
      this.bats=[];
      for(let i=0;i<28;i++){
        this.bats.push({
          x:rand(-10,10),y:rand(3.5,12),z:rand(-10,10),
          vx:rand(-0.03,0.03),vy:rand(-0.015,0.015),vz:rand(-0.03,0.03),
          phase:rand(0,30)
        });
      }

      this.COLS=Math.floor(this.w/8);
      this.ROWS=Math.floor(this.h/14);
      this.zb=new Float32Array(this.COLS*this.ROWS);
      this.gl=new Uint8Array(this.COLS*this.ROWS);
      this.co=new Uint16Array(this.COLS*this.ROWS);

      addEventListener('resize',()=>{
        this.w=canvas.width=innerWidth;
        this.h=canvas.height=innerHeight;
        this.COLS=Math.floor(this.w/8);
        this.ROWS=Math.floor(this.h/14);
        this.zb=new Float32Array(this.COLS*this.ROWS);
        this.gl=new Uint8Array(this.COLS*this.ROWS);
        this.co=new Uint16Array(this.COLS*this.ROWS);
      });

      this.time=0;
      this.loop=this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    loop(t){
      this.time=t*0.001;
      this.dist+=(this.targetDist-this.dist)*0.09;
      this.render();
      requestAnimationFrame(this.loop);
    }

    render(){
      const {ctx,COLS,ROWS,zb,gl,co,pts,n}=this;
      zb.fill(-1e9);

      const cosY=Math.cos(this.yaw),sinY=Math.sin(this.yaw);
      const cosP=Math.cos(this.pitch),sinP=Math.sin(this.pitch);
      const scale=Math.min(this.w,this.h)*0.041;
      const cx=this.w/2,cy=this.h/2+35;

      for(let i=0;i<n;i++){
        const o=i*8;
        let x=pts[o],y=pts[o+1],z=pts[o+2];
        const nx=pts[o+3],ny=pts[o+4],nz=pts[o+5];
        const col=pts[o+6]|0,ch=pts[o+7]|0;

        let rx=x*cosY-z*sinY;
        let rz=x*sinY+z*cosY;
        let ry=y*cosP-rz*sinP;
        rz=y*sinP+rz*cosP;

        const persp=this.dist/(this.dist+rz+5);
        if(persp<0.14)continue;

        const sx=cx+rx*scale*persp;
        const sy=cy-ry*scale*persp;
        const colIdx=(sx/8)|0,rowIdx=(sy/14)|0;
        if(colIdx<0||colIdx>=COLS||rowIdx<0||rowIdx>=ROWS)continue;

        const idx=rowIdx*COLS+colIdx;
        const depth=-rz;
        if(depth>zb[idx]){
          zb[idx]=depth;
          const lit=clamp(nx*L[0]+ny*L[1]+nz*L[2]*0.5+0.55,0.2,1);
          co[idx]=col*4+Math.min(3,(lit*4)|0);
          gl[idx]=ch;
        }
      }

      // bats
      for(const b of this.bats){
        b.x+=b.vx;b.y+=b.vy+Math.sin(this.time*2.6+b.phase)*0.012;b.z+=b.vz;
        if(Math.abs(b.x)>11)b.vx*=-1;
        if(Math.abs(b.z)>11)b.vz*=-1;
        if(b.y<2.2||b.y>13)b.vy*=-1;

        let rx=b.x*cosY-b.z*sinY;
        let rz=b.x*sinY+b.z*cosY;
        let ry=b.y*cosP-rz*sinP;
        rz=b.y*sinP+rz*cosP;

        const persp=this.dist/(this.dist+rz+5);
        if(persp<0.16)continue;

        const sx=cx+rx*scale*persp;
        const sy=cy-ry*scale*persp;
        const colIdx=(sx/8)|0,rowIdx=(sy/14)|0;
        if(colIdx<0||colIdx>=COLS||rowIdx<0||rowIdx>=ROWS)continue;

        const idx=rowIdx*COLS+colIdx;
        if(-rz>zb[idx]){
          zb[idx]=-rz;
          co[idx]=C.bat*4+3;
          gl[idx]=K['*'];
        }
      }

      ctx.fillStyle='#05060a';
      ctx.fillRect(0,0,this.w,this.h);
      ctx.font='11px monospace';
      ctx.textAlign='center';
      ctx.textBaseline='middle';

      for(let i=0;i<COLS*ROWS;i++){
        if(zb[i]<-1e8)continue;
        ctx.fillStyle=PAL[co[i]]||'#555';
        const x=(i%COLS)*8+4;
        const y=((i/COLS)|0)*14+7;
        ctx.fillText(CH[gl[i]]||'#',x,y);
      }
    }
  }

  window.Castle3D=Castle3D;
})();

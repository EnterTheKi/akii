// ─────────────────────────────────────────────
//  3D ASCII TRANSYLVANIA VAMPIRE CASTLE
//  Mouse drag to rotate • Wheel to zoom
// ─────────────────────────────────────────────
(function () {
  const CH = ['.', ',', "'", '`', ':', ';', '|', '#', '@', 'o', '8', '=', '-', '*', '+', '/', '\\', '°', '%', '&', 'M', 'W', '^', 'T'];
  const K = Object.fromEntries(CH.map((c, i) => [c, i]));

  const L = norm([0.35, 0.9, 0.25]);
  function norm(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0]/l, v[1]/l, v[2]/l];
  }
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function Cloud() { this.d = []; }
  Cloud.prototype.add = function (x, y, z, nx, ny, nz, col, ch) {
    this.d.push(x, y, z, nx, ny, nz, col, ch);
  };

  // Colors
  const C = { stone:0, dark:1, blood:2, moon:3, bat:4, fog:5, gold:6, roof:7, window:8 };
  const BASE = ['#4a5560','#1a1e24','#8b1a1a','#e8e4d0','#222','#3a4550','#c9a227','#2c1810','#ff3030'];
  const LEVELS = [0.3, 0.5, 0.75, 1.0];
  const PAL = [];
  for (const h of BASE) {
    const n = parseInt(h.slice(1),16), r=n>>16, g=(n>>8)&255, b=n&255;
    for (const l of LEVELS) PAL.push(`rgb(${(r*l)|0},${(g*l)|0},${(b*l)|0})`);
  }

  function buildCastle() {
    const s = new Cloud();

    // Ground
    for (let i=0; i<9000; i++) {
      const r = 11 * Math.sqrt(Math.random());
      const a = Math.random() * Math.PI*2;
      s.add(r*Math.cos(a), 0, r*Math.sin(a), 0,1,0, C.fog, K['.']);
    }

    // ===== MAIN KEEP =====
    const kw=2.6, kh=6.2;
    for (let y=0; y<=kh; y+=0.11) {
      for (let x=-kw; x<=kw; x+=0.12) {
        s.add(x,y,-kw, 0,0,-1, C.stone, K['#']);
        s.add(x,y, kw, 0,0, 1, C.stone, K['#']);
      }
      for (let z=-kw; z<=kw; z+=0.12) {
        s.add(-kw,y,z, -1,0,0, C.stone, K['#']);
        s.add( kw,y,z,  1,0,0, C.stone, K['#']);
      }
    }
    // Battlements on keep
    for (let x=-kw-0.2; x<=kw+0.2; x+=0.25) {
      s.add(x, kh+0.35, -kw-0.15, 0,1,0, C.roof, K['M']);
      s.add(x, kh+0.35,  kw+0.15, 0,1,0, C.roof, K['M']);
    }

    // Red windows on keep
    const winY = [1.8, 3.4, 5.0];
    for (const wy of winY) {
      for (let side of [-1,1]) {
        s.add(side*1.1, wy, -kw-0.05, 0,0,-1, C.window, K['o']);
        s.add(side*1.1, wy+0.25, -kw-0.05, 0,0,-1, C.window, K['o']);
      }
    }

    // ===== 4 TOWERS =====
    const towers = [[-4.0,-4.0],[4.0,-4.0],[-4.0,4.0],[4.0,4.0]];
    for (const [tx,tz] of towers) {
      // body
      for (let y=0; y<=9.0; y+=0.11) {
        for (let a=0; a<Math.PI*2; a+=0.2) {
          const r=0.78;
          s.add(tx+Math.cos(a)*r, y, tz+Math.sin(a)*r, Math.cos(a),0.1,Math.sin(a), C.stone, K['#']);
        }
      }
      // spire
      for (let y=9.0; y<=13.2; y+=0.09) {
        const t = (y-9.0)/4.2;
        const r = 0.78*(1-t);
        for (let a=0; a<Math.PI*2; a+=0.28) {
          s.add(tx+Math.cos(a)*r, y, tz+Math.sin(a)*r, Math.cos(a),0.5,Math.sin(a), C.roof, K['^']);
        }
      }
      // top battlements
      for (let a=0; a<Math.PI*2; a+=0.45) {
        s.add(tx+Math.cos(a)*0.9, 9.3, tz+Math.sin(a)*0.9, 0,1,0, C.dark, K['M']);
      }
      // small red window on each tower
      s.add(tx, 4.5, tz-0.85, 0,0,-1, C.window, K['o']);
      s.add(tx, 4.75, tz-0.85, 0,0,-1, C.window, K['o']);
    }

    // Gate
    for (let y=0; y<3.6; y+=0.11) {
      for (let x=-1.3; x<=1.3; x+=0.11) {
        if (Math.abs(x)>0.65 || y>2.9) {
          s.add(x, y, -2.75, 0,0,-1, C.dark, K['#']);
        }
      }
    }

    // Dead trees
    for (let t=0; t<7; t++) {
      const tx = rand(-9,9), tz = rand(-9,9);
      if (Math.hypot(tx,tz) < 5.5) continue;
      for (let y=0; y<3.8; y+=0.15) {
        s.add(tx, y, tz, 0,1,0, C.dark, K['|']);
      }
      // branches
      for (let b=0; b<5; b++) {
        const a = rand(0,6.28), len=rand(0.8,1.6);
        for (let i=0; i<len; i+=0.12) {
          s.add(tx+Math.cos(a)*i, 2.5+Math.sin(a*2)*0.3+i*0.15, tz+Math.sin(a)*i, 0,1,0, C.dark, K['/']);
        }
      }
    }

    // Graves
    for (let g=0; g<12; g++) {
      const gx = rand(-8,8), gz = rand(-8,8);
      if (Math.hypot(gx,gz) < 5) continue;
      s.add(gx, 0.4, gz, 0,1,0, C.stone, K['+']);
      s.add(gx, 0.7, gz, 0,1,0, C.stone, K['|']);
    }

    // Big moon
    const md = norm([-0.55,0.6,-0.65]);
    const mDist=48, mR=3.2;
    for (let rr=0; rr<=mR; rr+=0.14) {
      for (let a=0; a<Math.PI*2; a+=0.11/Math.max(rr,0.14)) {
        const cx=Math.cos(a)*rr, cy=Math.sin(a)*rr;
        s.add(md[0]*mDist+cx, md[1]*mDist+cy, md[2]*mDist, 0,1,0, C.moon, rr>mR-0.25 ? K[':'] : K['o']);
      }
    }

    // Flags on two towers
    for (const [tx,tz] of [[-4.0,-4.0],[4.0,4.0]]) {
      for (let y=13.3; y<15.5; y+=0.1) {
        s.add(tx, y, tz, 0,1,0, C.dark, K['|']);
      }
      // flag cloth
      for (let f=0; f<8; f++) {
        s.add(tx + 0.3 + f*0.12, 14.8, tz, 1,0,0, C.blood, K['=']);
        s.add(tx + 0.3 + f*0.12, 14.5, tz, 1,0,0, C.blood, K['=']);
      }
    }

    return new Float32Array(s.d);
  }

  class Castle3D {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.w = canvas.width = innerWidth;
      this.h = canvas.height = innerHeight;

      this.pts = buildCastle();
      this.n = this.pts.length / 8;

      // camera
      this.yaw = 0.9;
      this.pitch = 0.25;
      this.dist = 18;
      this.targetDist = 18;

      // mouse
      this.dragging = false;
      this.lastX = 0;
      this.lastY = 0;

      canvas.addEventListener('mousedown', e => {
        this.dragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      });
      window.addEventListener('mouseup', () => this.dragging = false);
      window.addEventListener('mousemove', e => {
        if (!this.dragging) return;
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.yaw   += dx * 0.005;
        this.pitch  = clamp(this.pitch + dy * 0.004, -0.4, 1.1);
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      });
      canvas.addEventListener('wheel', e => {
        e.preventDefault();
        this.targetDist = clamp(this.targetDist + e.deltaY * 0.015, 9, 35);
      }, {passive:false});

      // bats
      this.bats = [];
      for (let i=0; i<18; i++) {
        this.bats.push({
          x: rand(-8,8), y: rand(4,11), z: rand(-8,8),
          vx: rand(-0.025,0.025), vy: rand(-0.012,0.012), vz: rand(-0.025,0.025),
          phase: rand(0,20)
        });
      }

      this.COLS = Math.floor(this.w / 8);
      this.ROWS = Math.floor(this.h / 14);
      this.zb = new Float32Array(this.COLS * this.ROWS);
      this.gl = new Uint8Array(this.COLS * this.ROWS);
      this.co = new Uint16Array(this.COLS * this.ROWS);

      addEventListener('resize', () => {
        this.w = canvas.width = innerWidth;
        this.h = canvas.height = innerHeight;
        this.COLS = Math.floor(this.w / 8);
        this.ROWS = Math.floor(this.h / 14);
        this.zb = new Float32Array(this.COLS*this.ROWS);
        this.gl = new Uint8Array(this.COLS*this.ROWS);
        this.co = new Uint16Array(this.COLS*this.ROWS);
      });

      this.time = 0;
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    loop(t) {
      this.time = t * 0.001;
      this.dist += (this.targetDist - this.dist) * 0.08;
      this.render();
      requestAnimationFrame(this.loop);
    }

    render() {
      const {ctx, COLS, ROWS, zb, gl, co, pts, n} = this;
      zb.fill(-1e9);

      const cosY = Math.cos(this.yaw), sinY = Math.sin(this.yaw);
      const cosP = Math.cos(this.pitch), sinP = Math.sin(this.pitch);

      const scale = Math.min(this.w, this.h) * 0.042;
      const cx = this.w/2, cy = this.h/2 + 30;

      // static points
      for (let i=0; i<n; i++) {
        const o = i*8;
        let x = pts[o], y = pts[o+1], z = pts[o+2];
        const nx=pts[o+3], ny=pts[o+4], nz=pts[o+5];
        const col = pts[o+6]|0;
        const ch  = pts[o+7]|0;

        // rotate yaw
        let rx = x*cosY - z*sinY;
        let rz = x*sinY + z*cosY;
        // pitch
        let ry = y*cosP - rz*sinP;
        rz = y*sinP + rz*cosP;

        const persp = this.dist / (this.dist + rz + 5);
        if (persp < 0.15) continue;

        const sx = cx + rx * scale * persp;
        const sy = cy - ry * scale * persp;

        const colIdx = (sx/8)|0;
        const rowIdx = (sy/14)|0;
        if (colIdx<0||colIdx>=COLS||rowIdx<0||rowIdx>=ROWS) continue;

        const idx = rowIdx*COLS + colIdx;
        const depth = -rz;
        if (depth > zb[idx]) {
          zb[idx] = depth;
          const lit = clamp(nx*L[0] + ny*L[1] + nz*L[2]*0.5 + 0.55, 0.2, 1);
          const level = Math.min(3, (lit*4)|0);
          co[idx] = col*4 + level;
          gl[idx] = ch;
        }
      }

      // bats
      for (const b of this.bats) {
        b.x += b.vx; b.y += b.vy + Math.sin(this.time*2.8 + b.phase)*0.01; b.z += b.vz;
        if (Math.abs(b.x)>9) b.vx*=-1;
        if (Math.abs(b.z)>9) b.vz*=-1;
        if (b.y<2.5 || b.y>12) b.vy*=-1;

        let rx = b.x*cosY - b.z*sinY;
        let rz = b.x*sinY + b.z*cosY;
        let ry = b.y*cosP - rz*sinP;
        rz = b.y*sinP + rz*cosP;

        const persp = this.dist / (this.dist + rz + 5);
        if (persp < 0.18) continue;

        const sx = cx + rx*scale*persp;
        const sy = cy - ry*scale*persp;
        const colIdx = (sx/8)|0;
        const rowIdx = (sy/14)|0;
        if (colIdx<0||colIdx>=COLS||rowIdx<0||rowIdx>=ROWS) continue;

        const idx = rowIdx*COLS + colIdx;
        if (-rz > zb[idx]) {
          zb[idx] = -rz;
          co[idx] = C.bat*4 + 3;
          gl[idx] = K['*'];
        }
      }

      // draw
      ctx.fillStyle = '#05060a';
      ctx.fillRect(0,0,this.w,this.h);
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i=0; i<COLS*ROWS; i++) {
        if (zb[i] < -1e8) continue;
        ctx.fillStyle = PAL[co[i]] || '#555';
        const x = (i%COLS)*8 + 4;
        const y = ((i/COLS)|0)*14 + 7;
        ctx.fillText(CH[gl[i]] || '#', x, y);
      }
    }
  }

  window.Castle3D = Castle3D;
})();

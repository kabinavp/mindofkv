// The hill: procedural grass, a lone tree, and KV doing free-time things.
// Everything is drawn on one canvas; wind comes from live weather when a location is configured.

export type Activity = 'ride' | 'build' | 'film';

const TAU = Math.PI * 2;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Terrain profile: [x fraction, y fraction of height]. A valley left of centre, a rise for the tree.
const PROFILE: [number, number][] = [[0, 0.745], [0.16, 0.77], [0.4, 0.805], [0.6, 0.79], [0.8, 0.718], [0.9, 0.708], [1, 0.722]];

const GRASS = ['#4b6a1d', '#5d7a24', '#6f8a2c', '#82983a', '#97a64a', '#adb763'];
const SKIN = '#a8724f';
const LINES: Record<Activity, string[]> = {
  ride: ['Hill repeats again', 'Legs are cooked', 'One more lap', 'Best ideas come at 25 km/h'],
  build: ['What if I tried…', 'One more experiment', 'Wait, that worked?', 'Down another rabbit hole'],
  film: ['Rolling', 'Take twelve', 'Make it look effortless', 'Got the shot'],
};

interface Blade { x: number; gy: number; h: number; c: number; w: number }
interface Pad { x: number; y: number; img: HTMLCanvasElement; ox: number; oy: number; sway: number }
interface Say { text: string; until: number }

export class Hill {
  private ctx: CanvasRenderingContext2D;
  private W = 0; private H = 0; private dpr = 1;
  private ground!: HTMLCanvasElement;
  private trunk!: HTMLCanvasElement; private trunkO = { x: 0, y: 0 };
  private pads: Pad[] = [];
  private back: Blade[] = []; private front: Blade[] = [];
  private tree = { x: 0, y: 0, S: 0 };
  private fig = 60;
  private t = 0; private last = 0; private raf = 0; private running = false;

  wind = { mph: 7, sign: 1 };
  active: Record<Activity, boolean> = { ride: true, build: false, film: false };
  private appear: Record<Activity, number> = { ride: 1, build: 0, film: 0 };
  private say: Partial<Record<Activity, Say>> = {};
  private nextSay = 4;

  private bike = { x: 0, dir: 1, v: 60, crank: 0, wheel: 0 };
  private cam = { pan: 0 };

  constructor(private canvas: HTMLCanvasElement, private still = false) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.bike.x = this.W * 0.28;
  }

  // ---------- geometry ----------
  gy(x: number) {
    const u = clamp(x / this.W, 0, 1);
    let i = 0;
    while (i < PROFILE.length - 2 && u > PROFILE[i + 1][0]) i++;
    const [u0, v0] = PROFILE[i], [u1, v1] = PROFILE[i + 1];
    const k = (u - u0) / (u1 - u0);
    const s = (1 - Math.cos(k * Math.PI)) / 2;
    const v = lerp(v0, v1, s);
    return (this.W < 700 ? 0.8 + (v - 0.76) * 0.55 : v) * this.H;
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.W = Math.max(320, r.width); this.H = Math.max(480, r.height);
    this.canvas.width = Math.round(this.W * this.dpr); this.canvas.height = Math.round(this.H * this.dpr);
    this.fig = clamp(this.H * 0.075, 42, 64);
    const narrow = this.W < 700;
    const S = clamp(Math.min(this.H * (narrow ? 0.3 : 0.42), this.W * (narrow ? 0.5 : 0.36)), 150, 400);
    const tx = Math.min(this.W * (narrow ? 0.76 : 0.8), this.W - S * 0.5);
    this.tree = { x: tx, y: this.gy(tx) + 4, S };
    this.buildGround(); this.buildTree(); this.buildBlades();
    if (this.bike.x > this.W) this.bike.x = this.W * 0.5;
    if (!this.running) this.frame(this.last || 0);
  }

  private off(w: number, h: number) {
    const c = document.createElement('canvas');
    c.width = Math.ceil(w * this.dpr); c.height = Math.ceil(h * this.dpr);
    const x = c.getContext('2d')!; x.scale(this.dpr, this.dpr);
    return [c, x] as const;
  }

  private buildGround() {
    const { W, H } = this;
    const [c, g] = this.off(W, H);
    const top = Math.min(...Array.from({ length: 40 }, (_, i) => this.gy((i / 39) * W)));
    g.beginPath(); g.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) g.lineTo(x, this.gy(x));
    g.lineTo(W, H); g.closePath();
    const grad = g.createLinearGradient(0, top, 0, H);
    grad.addColorStop(0, '#93a243'); grad.addColorStop(0.35, '#728b30'); grad.addColorStop(1, '#3c5619');
    g.fillStyle = grad; g.fill();
    g.save(); g.clip();
    const r = rng(7);
    // Texture: thousands of short strokes, darker and denser toward the bottom.
    const n = Math.round(W * (H - top) * 0.05);
    g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = top + r() * (H - top);
      const depth = (y - this.gy(x)) / (H - top);
      if (depth < 0) continue;
      const len = 3 + r() * 9 * (1 - depth * 0.4);
      g.strokeStyle = GRASS[Math.floor(r() * GRASS.length * (1 - depth * 0.6))];
      g.globalAlpha = 0.35 + r() * 0.4;
      g.lineWidth = 0.8 + r() * 0.8;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 3, y - len); g.stroke();
    }
    // Tiny pale flowers / seed heads
    g.globalAlpha = 0.8; g.fillStyle = '#f3f1dc';
    for (let i = 0; i < W * 0.12; i++) {
      const x = r() * W, y = this.gy(x) + 6 + r() * (H - this.gy(x)) * 0.8;
      g.beginPath(); g.arc(x, y, 0.6 + r() * 0.6, 0, TAU); g.fill();
    }
    g.restore();
    this.ground = c;
  }

  private buildTree() {
    const S = this.tree.S;
    const r = rng(42);
    const W = S * 1.6, H = S * 1.15;
    const [c, g] = this.off(W, H);
    const ox = W * 0.5, oy = H - 4;
    this.trunkO = { x: ox, y: oy };
    this.pads = [];
    const segs: { x: number; y: number; x2: number; y2: number; cx: number; cy: number; w0: number; w1: number }[] = [];
    const pad = (x: number, y: number, scale: number) => {
      const pw = S * (0.17 + r() * 0.12) * scale, ph = S * (0.05 + r() * 0.03) * scale;
      this.pads.push({ ...this.makePad(pw, ph, r), x: x - ox, y: y - oy, sway: (oy - y) / S });
    };
    const grow = (x: number, y: number, ang: number, len: number, w: number, d: number) => {
      const bend = (r() - 0.5) * 0.5;
      const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      const cx = (x + x2) / 2 + Math.cos(ang + Math.PI / 2) * len * bend * 0.3;
      const cy = (y + y2) / 2 + Math.sin(ang + Math.PI / 2) * len * bend * 0.3;
      const w1 = w * (d === 0 ? 0.7 : 0.6);
      segs.push({ x, y, x2, y2, cx, cy, w0: w, w1 });
      if (d >= 3 || len < S * 0.05) { pad(x2, y2, 1); return; }
      if (d >= 1 && r() < 0.55) pad(lerp(x, x2, 0.7), lerp(y, y2, 0.7) - 2, 0.7);
      const n = d === 0 ? 3 : r() < 0.45 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const spread = d === 0 ? 1.35 : 1.15;
        let a = ang + (n === 1 ? 0 : (i / (n - 1) - 0.5) * spread) + (r() - 0.5) * 0.3;
        if (d >= 1) a += a < -Math.PI / 2 ? -0.22 : 0.22; // limbs reach outward, cypress-like
        a = clamp(a, -Math.PI + 0.22, -0.22);
        const f = d === 0 ? 1.15 + r() * 0.2 : 0.7 + r() * 0.16;
        grow(x2, y2, a, len * f, w1 * (d === 0 ? 0.95 : 1), d + 1);
      }
    };
    grow(ox, oy, -Math.PI / 2 + (r() - 0.5) * 0.12, S * 0.2, S * 0.085, 0);
    // Draw branches: shadow, body, highlight
    g.lineCap = 'round';
    const pass = (col: string, dx: number, wk: number) => {
      g.strokeStyle = col;
      for (const s of segs) {
        const steps = 6;
        for (let i = 0; i < steps; i++) {
          const t0 = i / steps, t1 = (i + 1) / steps;
          const p = (t: number) => [
            (1 - t) * (1 - t) * s.x + 2 * (1 - t) * t * s.cx + t * t * s.x2,
            (1 - t) * (1 - t) * s.y + 2 * (1 - t) * t * s.cy + t * t * s.y2,
          ];
          const [ax, ay] = p(t0), [bx, by] = p(t1);
          const w = lerp(s.w0, s.w1, (t0 + t1) / 2);
          g.lineWidth = Math.max(0.8, w * wk);
          g.beginPath(); g.moveTo(ax + dx * w, ay); g.lineTo(bx + dx * w, by); g.stroke();
        }
      }
    };
    pass('#4a3826', 0.12, 1); pass('#7a5c3d', 0, 0.85); pass('#a6865f', -0.22, 0.28);
    // Root flare
    g.fillStyle = '#5b4430';
    g.beginPath(); g.ellipse(ox, oy - 2, S * 0.08, S * 0.025, 0, 0, TAU); g.fill();
    this.trunk = c;
    this.pads.sort((a, b) => b.sway - a.sway); // lower pads last so they overlap
  }

  private makePad(pw: number, ph: number, r: () => number) {
    const pad = 6;
    const [c, g] = this.off(pw + pad * 2, ph * 2.2 + pad * 2);
    const cx = pad + pw / 2, cy = pad + ph * 1.2;
    const lumps = 4 + Math.floor(r() * 3);
    const blobs = Array.from({ length: lumps }, (_, i) => ({
      x: cx + (i / (lumps - 1) - 0.5) * pw * 0.7 + (r() - 0.5) * pw * 0.1,
      y: cy + (r() - 0.5) * ph * 0.5 - Math.sin((i / (lumps - 1)) * Math.PI) * ph * 0.35,
      rx: pw * (0.18 + r() * 0.1), ry: ph * (0.55 + r() * 0.25),
    }));
    const inside = (x: number, y: number) => blobs.some((b) => ((x - b.x) / b.rx) ** 2 + ((y - b.y) / b.ry) ** 2 < 1);
    const dots = Math.round(pw * ph * 0.55);
    for (let i = 0; i < dots; i++) {
      const x = pad + r() * pw, y = cy - ph * 1.2 + r() * ph * 2.2;
      if (!inside(x, y)) continue;
      const v = clamp((y - (cy - ph)) / (ph * 1.8), 0, 1); // 0 top → 1 bottom
      const pal = v < 0.25 ? ['#b3bd5f', '#9fb04a', '#8aa23d'] : v < 0.6 ? ['#7c9634', '#6c8a2e', '#8aa23d'] : ['#4d6b22', '#3e5a1c', '#5b7a27'];
      g.fillStyle = pal[Math.floor(r() * pal.length)];
      g.beginPath(); g.ellipse(x, y, 1.2 + r() * 1.6, 0.9 + r() * 1, (r() - 0.5) * 0.6, 0, TAU); g.fill();
    }
    // Needle fringe
    g.lineWidth = 0.8; g.lineCap = 'round';
    for (let i = 0; i < pw * 0.9; i++) {
      const b = blobs[Math.floor(r() * blobs.length)];
      const a = r() * TAU;
      const x = b.x + Math.cos(a) * b.rx, y = b.y + Math.sin(a) * b.ry;
      g.strokeStyle = Math.sin(a) < 0 ? '#9cae4b' : '#4f6c24';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * (2 + r() * 3), y + Math.sin(a) * (1 + r() * 2)); g.stroke();
    }
    return { img: c, ox: cx, oy: cy };
  }

  private buildBlades() {
    const r = rng(11);
    this.back = []; this.front = [];
    const n = Math.round(this.W * 1.7);
    for (let i = 0; i < n; i++) {
      const x = r() * this.W, d = r();
      const b: Blade = { x, gy: this.gy(x) + d * 15, h: (6 + r() * 13) * (0.75 + d * 0.5), c: Math.floor(r() * GRASS.length), w: 0.9 + r() * 0.7 };
      (d < 0.55 ? this.back : this.front).push(b);
    }
    for (const list of [this.back, this.front]) list.sort((a, b) => a.c - b.c);
  }

  // ---------- simulation ----------
  private gust(x: number) {
    const a = clamp(this.wind.mph / 16, 0.18, 1.2);
    const t = this.t;
    const base = 0.55 * Math.sin(t * 1.25 - x * 0.007) + 0.3 * Math.sin(t * 2.6 - x * 0.019);
    const g = Math.max(0, Math.sin(t * 0.33 - x * 0.002)) ** 3;
    return a * (base * 0.5 + this.wind.sign * (0.45 + g * 0.9));
  }

  private bikeHost() { return this.appear.ride > 0.01; }

  private update(dt: number) {
    for (const k of ['ride', 'build', 'film'] as Activity[]) this.appear[k] = clamp(this.appear[k] + (this.active[k] ? dt : -dt) * 2.2, 0, 1);
    const b = this.bike, k = this.fig / 60;
    const slope = (this.gy(b.x + 6) - this.gy(b.x - 6)) / 12; // + means downhill when moving right
    const down = slope * b.dir;
    const target = clamp(64 * k * (1 + down * 3.2), 26 * k, 135 * k);
    b.v = lerp(b.v, target, clamp(dt * 1.2, 0, 1));
    b.x += b.v * b.dir * dt;
    const m = 30 * k;
    if (b.x > this.W - m) b.dir = -1; else if (b.x < m) b.dir = 1;
    if (down < 0.09) b.crank += (b.v / k) * dt * 0.085; // coast on steep descents
    b.wheel += (b.v / k) * dt / 12;
    // Camera pans toward the rider
    const camX = this.W * 0.42;
    this.cam.pan = lerp(this.cam.pan, b.x < camX ? -1 : 1, clamp(dt * 1.5, 0, 1));
    // Speech
    this.nextSay -= dt;
    if (this.nextSay <= 0) {
      const on = (Object.keys(this.active) as Activity[]).filter((a) => this.active[a]);
      if (on.length) this.speak(on[Math.floor(Math.random() * on.length)]);
      this.nextSay = 7 + Math.random() * 5;
    }
  }

  speak(a: Activity) {
    const l = LINES[a];
    this.say[a] = { text: l[Math.floor(Math.random() * l.length)], until: this.t + 3.4 };
  }

  toggle(a: Activity) {
    this.active[a] = !this.active[a];
    if (this.active[a]) { this.speak(a); this.nextSay = 6; }
    if (this.still) this.frame(this.last);
    return this.active[a];
  }

  // ---------- drawing ----------
  private blades(list: Blade[]) {
    const g = this.ctx;
    const bx = this.bikeHost() ? this.bike.x : -999;
    let cur = -1;
    for (const bl of list) {
      if (bl.c !== cur) { if (cur >= 0) g.stroke(); cur = bl.c; g.strokeStyle = GRASS[cur]; g.lineWidth = 1.1; g.beginPath(); }
      let lean = this.gust(bl.x) * bl.h * 0.45;
      const dx = bl.x - bx;
      if (Math.abs(dx) < 22) lean += Math.sign(dx) * (1 - Math.abs(dx) / 22) * 7;
      g.moveTo(bl.x, bl.gy);
      g.quadraticCurveTo(bl.x + lean * 0.3, bl.gy - bl.h * 0.6, bl.x + lean, bl.gy - bl.h + Math.abs(lean) * 0.25);
    }
    if (cur >= 0) g.stroke();
  }

  private drawTree() {
    const g = this.ctx, { x, y } = this.tree, w = this.gust(x);
    g.drawImage(this.trunk, x - this.trunkO.x, y - this.trunkO.y, this.trunk.width / this.dpr, this.trunk.height / this.dpr);
    for (const p of this.pads) {
      const sx = w * p.sway * 3.2 + Math.sin(this.t * 1.7 + p.x) * 0.4 * p.sway;
      g.drawImage(p.img, x + p.x - p.ox + sx, y + p.y - p.oy, p.img.width / this.dpr, p.img.height / this.dpr);
    }
  }

  private seg(pts: number[][], width: number, color: string) {
    const g = this.ctx;
    g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.stroke();
  }

  private ik(h: number[], p: number[], l1: number, l2: number, fwd = 1) {
    const dx = p[0] - h[0], dy = p[1] - h[1];
    const d = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 0.01);
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const base = Math.atan2(dy, dx) - a * fwd;
    return [h[0] + Math.cos(base) * l1, h[1] + Math.sin(base) * l1];
  }

  private drawBike() {
    const b = this.bike, g = this.ctx, k = this.fig / 60;
    const xr = b.x - 17 * k * b.dir, xf = b.x + 17 * k * b.dir;
    const yr = this.gy(xr), yf = this.gy(xf);
    const ang = Math.atan2((yf - yr) * b.dir, 34 * k);
    g.save();
    g.globalAlpha = this.appear.ride;
    g.translate(b.x, (yr + yf) / 2 + 1); g.rotate(ang); g.scale(b.dir * k, k);
    const R = [-17, -12], F = [17, -12], BB = [-2, -10], S = [-7, -31], T = [11, -31], Hb = [12, -25];
    const hip = [-6, -34];
    const ped = (o: number) => [BB[0] + Math.cos(b.crank + o) * 6.5, BB[1] + Math.sin(b.crank + o) * 6.5];
    const pf = ped(Math.PI), pn = ped(0);
    // far leg
    const kf = this.ik(hip, pf, 15.5, 15.5);
    this.seg([hip, kf, pf], 3.4, '#1d1d1d'); this.seg([[pf[0] - 2, pf[1]], [pf[0] + 2.5, pf[1]]], 2.2, '#cfcfca');
    // wheels
    for (const c of [R, F]) {
      g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.arc(c[0], c[1], 11.5, 0, TAU); g.stroke();
      g.strokeStyle = 'rgba(40,40,40,.45)'; g.lineWidth = 0.5; g.beginPath();
      for (let i = 0; i < 8; i++) { const a = b.wheel + (i * TAU) / 8; g.moveTo(c[0], c[1]); g.lineTo(c[0] + Math.cos(a) * 11, c[1] + Math.sin(a) * 11); }
      g.stroke();
      g.fillStyle = '#555'; g.beginPath(); g.arc(c[0], c[1], 1.2, 0, TAU); g.fill();
    }
    // frame
    const fc = '#2c3a44';
    this.seg([R, BB, S, R], 1.7, fc); this.seg([S, T, Hb, BB], 1.9, fc); this.seg([Hb, F], 1.6, fc);
    this.seg([[-10, -33], [-4, -33]], 2, '#111'); // saddle
    this.seg([T, [13, -33], [16, -32], [16.5, -29]], 1.6, '#111'); // stem + drops
    this.seg([BB, pn], 1.4, '#666'); this.seg([BB, pf], 1.4, '#666');
    // torso, near leg, arm, head
    const sh = [8, -48];
    this.seg([hip, sh], 6, '#c8582b');
    this.seg([[hip[0] - 1, hip[1] + 1], [hip[0] + 3, hip[1] - 1]], 6.4, '#1d1d1d'); // shorts
    const kn = this.ik(hip, pn, 15.5, 15.5);
    this.seg([hip, kn], 3.8, '#222'); this.seg([kn, pn], 3.2, SKIN); this.seg([[pn[0] - 2, pn[1]], [pn[0] + 2.5, pn[1]]], 2.4, '#f0f0eb');
    const el = [11, -40];
    this.seg([sh, el], 2.6, '#c8582b'); this.seg([el, [15.5, -32.5]], 2.3, SKIN);
    g.fillStyle = SKIN; g.beginPath(); g.arc(12.5, -53, 4.2, 0, TAU); g.fill();
    g.fillStyle = '#f2f2ee'; g.beginPath(); g.ellipse(11.8, -55.4, 5, 3.3, -0.25, Math.PI, TAU); g.fill();
    g.strokeStyle = '#2c3a44'; g.lineWidth = 0.6; g.beginPath(); g.moveTo(8.5, -55.5); g.lineTo(15.5, -57); g.stroke();
    g.restore();
    this.bubble('ride', b.x, (yr + yf) / 2 - 64 * k);
  }

  private drawBuilder() {
    const g = this.ctx, k = this.fig / 60, a = this.appear.build;
    if (a <= 0) return;
    const x = this.tree.x - this.tree.S * 0.07, y = this.gy(x) + 2;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(-k, k);
    const typing = Math.sin(this.t * 14) * 0.6;
    const hip = [0, -6], sh = [-3, -27];
    this.seg([hip, [12, -13], [17, -1]], 4.2, '#3a4250'); // legs
    this.seg([[16, -1], [20, -1]], 2.6, '#f0f0eb');
    this.seg([hip, sh], 7, '#5b6b78'); // hoodie
    // laptop
    this.seg([[4, -13], [14, -15]], 1.8, '#9ea3a8');
    this.seg([[14, -15], [12.5, -25]], 1.8, '#c4c8cc');
    const glow = g.createRadialGradient(8, -22, 0, 8, -22, 10);
    glow.addColorStop(0, 'rgba(210,230,255,.55)'); glow.addColorStop(1, 'rgba(210,230,255,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(8, -22, 10, 0, TAU); g.fill();
    this.seg([[-1, -25], [4, -17 + typing], [9, -15.5 + typing]], 2.5, '#5b6b78');
    g.fillStyle = SKIN; g.beginPath(); g.arc(-1.5, -33, 4.2, 0, TAU); g.fill();
    g.fillStyle = '#1e1b18'; g.beginPath(); g.ellipse(-2.6, -35.2, 4.2, 2.6, -0.2, Math.PI * 0.95, TAU * 1.02); g.fill();
    g.restore();
    this.bubble('build', x, y - 46 * k);
  }

  private drawFilm() {
    const g = this.ctx, k = this.fig / 60, a = this.appear.film;
    if (a <= 0) return;
    const x = this.W * (this.W < 700 ? 0.5 : 0.42), y = this.gy(x) + 2;
    const dir = this.cam.pan >= 0 ? 1 : -1;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(dir * k, k);
    // tripod
    this.seg([[0, -31], [-7, 0]], 1.3, '#2a2a2a'); this.seg([[0, -31], [6, 0]], 1.3, '#2a2a2a'); this.seg([[0, -31], [1, 0]], 1.1, '#444');
    // camera
    g.fillStyle = '#1f1f1f'; g.fillRect(-5, -38, 10, 7);
    g.fillStyle = '#333'; g.fillRect(5, -37, 5, 5);
    if (Math.sin(this.t * 4) > 0) { g.fillStyle = '#e0412b'; g.beginPath(); g.arc(-3, -40, 1.2, 0, TAU); g.fill(); }
    // person behind camera
    const hip = [-13, -30], sh = [-11, -47];
    this.seg([hip, [-15, -14], [-16, 0]], 3.6, '#3d3a33');
    this.seg([hip, [-10, -15], [-9, 0]], 3.6, '#4a463d');
    this.seg([[-17, 0], [-13, 0]], 2.4, '#ece8de'); this.seg([[-10, 0], [-6, 0]], 2.4, '#ece8de');
    this.seg([hip, sh], 6.5, '#d9d2c0');
    this.seg([sh, [-5, -40], [-2, -36]], 2.5, '#d9d2c0');
    g.fillStyle = SKIN; g.beginPath(); g.arc(-9.5, -52.5, 4.2, 0, TAU); g.fill();
    g.fillStyle = '#1e1b18'; g.beginPath(); g.ellipse(-10.5, -54.6, 4.3, 2.6, -0.2, Math.PI * 0.95, TAU * 1.02); g.fill();
    g.restore();
    this.bubble('film', x - 8 * k * dir, y - 66 * k);
  }

  private bubble(a: Activity, x: number, y: number) {
    const s = this.say[a];
    if (!s || this.t > s.until || this.appear[a] < 0.5) return;
    const g = this.ctx;
    const life = s.until - this.t;
    g.save();
    g.globalAlpha = clamp(Math.min(life, 3.4 - life) * 3, 0, 1) * this.appear[a];
    g.font = '500 13.5px Satoshi, system-ui, sans-serif';
    g.fillStyle = '#6b6a63'; g.textAlign = 'center';
    g.fillText(`“${s.text}”`, clamp(x, 70, this.W - 70), y);
    g.restore();
  }

  frame = (now: number) => {
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0.016;
    this.last = now;
    if (!this.still) { this.t += dt; this.update(dt); }
    const g = this.ctx;
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.clearRect(0, 0, this.W, this.H);
    this.drawTree();
    g.drawImage(this.ground, 0, 0, this.W, this.H);
    this.blades(this.back);
    this.drawFilm();
    this.drawBuilder();
    if (this.appear.ride > 0) this.drawBike();
    this.blades(this.front);
    if (this.running) this.raf = requestAnimationFrame(this.frame);
  };

  start() { if (this.running || this.still) return; this.running = true; this.last = 0; this.raf = requestAnimationFrame(this.frame); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
}

// ---------- weather ----------
const BEAUFORT: [number, string][] = [[1, 'Still air'], [4, 'Light air'], [8, 'Slight breeze'], [13, 'Gentle breeze'], [19, 'Breezy'], [25, 'Fresh wind'], [99, 'Strong wind']];
export const describeWind = (mph: number) => BEAUFORT.find(([m]) => mph < m)![1];
export const compass = (deg: number) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

export async function liveWind(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=mph&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather');
  const j = await res.json();
  return { mph: j.current.wind_speed_10m as number, deg: j.current.wind_direction_10m as number, tz: j.timezone as string, abbr: j.timezone_abbreviation as string };
}

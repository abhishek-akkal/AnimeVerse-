import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   THREE-LAYER PARTICLE SYSTEM
───────────────────────────────────────────────────────────────────────────── */

function rand(a, b) {
  return a + Math.random() * (b - a);
}
function randInt(a, b) {
  return Math.floor(rand(a, b + 1));
}

/* ── Layer 1 – Background Space (whole viewport, very subtle) ── */
function mkBackgroundParticle(vw, vh) {
  const halfW = vw / 2;
  const halfH = vh / 2;
  /* scatter across entire screen, but avoid a 180px radius around center */
  let x, y;
  do {
    x = rand(-halfW, halfW);
    y = rand(-halfH, halfH);
  } while (Math.sqrt(x * x + y * y) < 180);

  const driftAngle = Math.random() * Math.PI * 2;
  const driftSpeed = rand(0.04, 0.18);
  return {
    layer: 1,
    x,
    y,
    vx: Math.cos(driftAngle) * driftSpeed,
    vy: Math.sin(driftAngle) * driftSpeed,
    size: rand(0.8, 2.2),
    baseOpacity: rand(0.08, 0.22),
    opacity: 0,
    fadeIn: rand(0, 0.6),
    /* twinkle */
    twinklePhase: rand(0, Math.PI * 2),
    twinkleSpeed: rand(0.008, 0.022),
    /* bounds for wrapping (set after canvas size known) */
    halfW,
    halfH,
  };
}

/* ── Layer 2 – Ambient (250–350px around logo) ── */
function mkAmbientParticle() {
  const angle = Math.random() * Math.PI * 2;
  const radius = rand(250, 360);
  return {
    layer: 2,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    size: rand(1.5, 3.2),
    baseOpacity: rand(0.25, 0.55),
    opacity: 0,
    fadeIn: 0,
    /* slow elliptical drift */
    orbitAngle: angle,
    orbitR: rand(230, 370),
    orbitSpeed: rand(0.0012, 0.004) * (Math.random() > 0.5 ? 1 : -1),
    lerpSpeed: rand(0.004, 0.01),
    /* gentle pulse */
    pulsePhase: rand(0, Math.PI * 2),
    pulseSpeed: rand(0.01, 0.02),
  };
}

/* ── Layer 3 – Hero (5–8, bright, drift inward, respawn) ── */
function mkHeroParticle() {
  const angle = Math.random() * Math.PI * 2;
  const dist = rand(280, 500);
  return {
    layer: 3,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: rand(2.2, 4.0),
    baseOpacity: rand(0.65, 0.95),
    opacity: 0,
    fadeIn: 0,
    inwardSpeed: rand(0.28, 0.55),
    /* respawn angle stored for reset */
    spawnAngle: angle,
  };
}

function buildParticles(vw, vh) {
  const bg = Array.from({ length: randInt(22, 28) }, () =>
    mkBackgroundParticle(vw, vh),
  );
  const ambient = Array.from({ length: randInt(13, 17) }, mkAmbientParticle);
  const hero = Array.from({ length: randInt(5, 8) }, mkHeroParticle);
  return [...bg, ...ambient, ...hero];
}

/* ── Canvas renderer ── */
const ParticleCanvas = ({ introProgress, exitProgress }) => {
  const canvasRef = useRef(null);
  const particles = useRef(null);

  /* init + resize */
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      /* rebuild on first call; on resize just update bg bounds */
      if (!particles.current) {
        particles.current = buildParticles(c.width, c.height);
      } else {
        particles.current.forEach((p) => {
          if (p.layer === 1) {
            p.halfW = c.width / 2;
            p.halfH = c.height / 2;
          }
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas || !particles.current) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const ox = w / 2;
    const oy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const globalAlpha = Math.min(1, introProgress * 2.8) * (1 - exitProgress);

    particles.current.forEach((p) => {
      /* ── Layer 1: background drift + wrap ── */
      if (p.layer === 1) {
        p.x += p.vx;
        p.y += p.vy;
        /* wrap around edges */
        if (p.x > p.halfW) p.x = -p.halfW;
        if (p.x < -p.halfW) p.x = p.halfW;
        if (p.y > p.halfH) p.y = -p.halfH;
        if (p.y < -p.halfH) p.y = p.halfH;
        /* keep them away from logo center */
        const d = Math.sqrt(p.x * p.x + p.y * p.y);
        if (d < 160) {
          p.x *= 1.015;
          p.y *= 1.015;
        }
        p.twinklePhase += p.twinkleSpeed;
        p.fadeIn = Math.min(1, p.fadeIn + 0.004);
        p.opacity =
          p.baseOpacity * (0.6 + 0.4 * Math.abs(Math.sin(p.twinklePhase)));
      } else if (p.layer === 2) {
        /* ── Layer 2: ambient orbit ── */
        p.orbitAngle += p.orbitSpeed;
        /* gently vary orbit radius */
        const currentR = p.orbitR + Math.sin(p.pulsePhase) * 18;
        const tx = Math.cos(p.orbitAngle) * currentR;
        const ty = Math.sin(p.orbitAngle) * currentR;
        p.x += (tx - p.x) * p.lerpSpeed;
        p.y += (ty - p.y) * p.lerpSpeed;
        p.pulsePhase += p.pulseSpeed;
        p.fadeIn = Math.min(1, p.fadeIn + 0.005);
        p.opacity =
          p.baseOpacity * (0.5 + 0.5 * Math.abs(Math.sin(p.pulsePhase)));
      } else {
        /* ── Layer 3: hero inward ── */
        const dist = Math.sqrt(p.x * p.x + p.y * p.y);
        if (dist < 20) {
          /* respawn at random edge position */
          const a = Math.random() * Math.PI * 2;
          const d = rand(300, 520);
          p.x = Math.cos(a) * d;
          p.y = Math.sin(a) * d;
          p.fadeIn = 0;
          p.opacity = 0;
        } else {
          const nx = -p.x / dist;
          const ny = -p.y / dist;
          p.x += nx * p.inwardSpeed;
          p.y += ny * p.inwardSpeed;
          /* fade out as they approach */
          p.opacity = p.baseOpacity * Math.min(1, dist / 90);
        }
        p.fadeIn = Math.min(1, p.fadeIn + 0.012);
      }

      /* ── Draw ── */
      const alpha = p.opacity * p.fadeIn * globalAlpha;
      if (alpha <= 0.008) return;

      const sx = ox + p.x;
      const sy = oy + p.y;

      if (p.layer === 1) {
        /* simple dot — no glow halo for perf */
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,80,80,${alpha})`;
        ctx.fill();
      } else {
        /* glow halo for layers 2 & 3 */
        const haloR = p.layer === 3 ? p.size * 5 : p.size * 3.5;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, haloR);
        g.addColorStop(0, `rgba(255,50,50,${alpha * 0.85})`);
        g.addColorStop(1, "rgba(255,50,50,0)");
        ctx.beginPath();
        ctx.arc(sx, sy, haloR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        /* core */
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${p.layer === 3 ? 140 : 110},110,${alpha})`;
        ctx.fill();
      }
    });
  });

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SVG LOGO  (unchanged)
───────────────────────────────────────────────────────────────────────────── */
const LogoSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="none"
    width="200"
    height="200"
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 18 -7"
        />
      </filter>
      <radialGradient id="planet" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#1a0a0a" />
        <stop offset="40%" stopColor="#0e0505" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </radialGradient>
    </defs>
    <circle
      cx="256"
      cy="256"
      r="122"
      fill="#ff0000"
      opacity="0.18"
      filter="url(#softGlow)"
    />
    <circle cx="256" cy="256" r="118" fill="url(#planet)" />
    <circle
      cx="256"
      cy="256"
      r="118"
      stroke="#ff2d2d"
      strokeWidth="7"
      fill="none"
      filter="url(#glow)"
    />
    <ellipse
      cx="256"
      cy="256"
      rx="185"
      ry="48"
      transform="rotate(-18 256 256)"
      stroke="#ff2d2d"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
      filter="url(#glow)"
    />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   INTRO SCREEN  (unchanged)
───────────────────────────────────────────────────────────────────────────── */
const TOTAL_MS = 3800;
const EXIT_START = 3000;

const IntroScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [exitProgress, setExitProgress] = useState(0);
  const startRef = useRef(Date.now());

  useAnimationFrame(() => {
    const elapsed = Date.now() - startRef.current;
    setIntroProgress(Math.min(1, elapsed / TOTAL_MS));
    if (elapsed >= EXIT_START) {
      setExitProgress(
        Math.min(1, (elapsed - EXIT_START) / (TOTAL_MS - EXIT_START)),
      );
    }
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  const glowOpacity =
    Math.min(1, introProgress * 2.2) * (1 - exitProgress * 0.7);
  const outerGlowScale = 1 + introProgress * 0.2;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
          <ParticleCanvas
            introProgress={introProgress}
            exitProgress={exitProgress}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-3 select-none z-10"
          >
            <motion.div
              animate={{ y: [0, -4, 0], scale: [1, 1.012, 1] }}
              transition={{
                duration: 3.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="relative flex items-center justify-center"
            >
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "340px",
                  height: "340px",
                  background:
                    "radial-gradient(circle, rgba(180,20,20,0.22) 0%, transparent 65%)",
                  opacity: glowOpacity * 0.7,
                  transform: `scale(${outerGlowScale})`,
                  transition: "opacity 0.1s, transform 0.1s",
                }}
              />
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "260px",
                  height: "260px",
                  background:
                    "radial-gradient(circle, rgba(220,30,30,0.42) 0%, transparent 70%)",
                }}
                animate={{ opacity: [0.35, 0.78, 0.35], scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
              <LogoSVG />
            </motion.div>

            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.55,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex items-center gap-1 font-serif tracking-widest text-3xl font-bold"
              >
                <span className="text-white">ANIME</span>
                <span className="text-red-600">VERSE</span>
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 120% 200% at 50% 50%, rgba(200,20,20,0.28) 0%, transparent 70%)",
                    borderRadius: "4px",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.7, 0.25] }}
                  transition={{ delay: 1.3, duration: 1.1, ease: "easeOut" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;

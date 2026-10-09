'use client';

import { useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@/components/Button';

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: `${(i * 37 + 7) % 100}%`,
  s: `${2 + (i % 3)}px`,
  d: `${9 + ((i * 7) % 7)}s`,
  delay: `${-(i * 1.7)}s`,
}));

const MAX_PATH = 38;

const css = `
@property --nf-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.nf-root { --nf-ease: cubic-bezier(0.16,1,0.3,1); --nf-bounce: cubic-bezier(0.34,1.56,0.64,1); position: relative; isolation: isolate; overflow: hidden; }

/* background */
.nf-grid { position:absolute; inset:-64px; z-index:-3;
  background-image: linear-gradient(var(--color-outline) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline) 1px, transparent 1px);
  background-size:64px 64px;
  -webkit-mask-image: radial-gradient(ellipse at center, black 15%, transparent 70%);
  mask-image: radial-gradient(ellipse at center, black 15%, transparent 70%);
  animation: nf-grid-drift 18s linear infinite; }
.nf-glow { position:absolute; z-index:-2; border-radius:var(--radius-full); filter:blur(80px); pointer-events:none; }
.nf-glow--a { top:8%; left:12%; width:28rem; height:28rem; background:color-mix(in srgb, var(--color-primary) 16%, transparent); animation: nf-blob 14s ease-in-out infinite; }
.nf-glow--b { right:8%; bottom:6%; width:24rem; height:24rem; background:color-mix(in srgb, var(--color-secondary) 12%, transparent); animation: nf-blob 18s ease-in-out -6s infinite reverse; }
.nf-particle { position:absolute; bottom:-12px; left:var(--x); z-index:-1; width:var(--s); height:var(--s); border-radius:var(--radius-full);
  background:var(--color-primary); opacity:0; box-shadow:0 0 12px color-mix(in srgb, var(--color-primary) 60%, transparent);
  animation: nf-rise-particle var(--d) linear var(--delay) infinite; }

/* container */
.nf-tilt { transform-style:preserve-3d; transform: perspective(1400px) rotateX(var(--nf-rx,0deg)) rotateY(var(--nf-ry,0deg)); transition: transform .3s ease-out; }
.nf-card { position:relative; border-radius:var(--radius-xl);
  background:color-mix(in srgb, var(--color-surface-container) 72%, transparent);
  -webkit-backdrop-filter:blur(24px); backdrop-filter:blur(24px);
  box-shadow: 0 24px 80px -24px color-mix(in srgb, var(--color-surface) 90%, transparent), 0 0 60px -20px color-mix(in srgb, var(--color-primary) 18%, transparent);
  animation: nf-card-in 1s var(--nf-ease) backwards; }
.nf-card::before { content:''; position:absolute; inset:0; padding:1px; border-radius:inherit;
  background:conic-gradient(from var(--nf-angle), transparent 0 65%, color-mix(in srgb, var(--color-primary) 90%, transparent) 85%, transparent 100%);
  -webkit-mask:linear-gradient(black 0 0) content-box, linear-gradient(black 0 0); -webkit-mask-composite:xor;
  mask:linear-gradient(black 0 0) content-box exclude, linear-gradient(black 0 0);
  animation: nf-spin 7s linear infinite; pointer-events:none; }
.nf-card::after { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:radial-gradient(420px circle at var(--nf-mx,50%) var(--nf-my,0%), color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 60%); }
.nf-item { animation: nf-item-in .75s var(--nf-ease) backwards; animation-delay: calc(.5s + var(--i,0) * .1s); }

/* 4 0 4 */
.nf-digits { display:flex; align-items:center; justify-content:center; gap:clamp(.25rem,2vw,1.25rem); font-size:clamp(5rem,17vw,11rem); line-height:1; }
.nf-digit { position:relative; display:inline-block; font-weight:800; letter-spacing:-.04em; color:var(--color-primary);
  text-shadow:0 0 40px color-mix(in srgb, var(--color-primary) 35%, transparent);
  animation: nf-drop .9s var(--nf-bounce) backwards, nf-float 6s ease-in-out 1.6s infinite;
  animation-delay: calc(.3s + var(--i,0) * .14s), calc(1.6s + var(--i,0) * .4s); }
.nf-digit::before, .nf-digit::after { content:attr(data-text); position:absolute; inset:0; opacity:0; pointer-events:none; }
.nf-digit::before { color:var(--color-secondary); animation: nf-glitch-a 5s steps(1) 2.5s infinite; }
.nf-digit::after { color:var(--color-error); animation: nf-glitch-b 5s steps(1) 2.5s infinite; }

.nf-zero { position:relative; display:inline-block; width:.74em; height:.88em; border-radius:var(--radius-full); border:.1em solid var(--color-primary);
  box-shadow:0 0 40px color-mix(in srgb, var(--color-primary) 30%, transparent), inset 0 0 30px color-mix(in srgb, var(--color-primary) 18%, transparent);
  animation: nf-drop .9s var(--nf-bounce) backwards, nf-float 6s ease-in-out 2s infinite; animation-delay: .44s, 2s; }
.nf-zero__sweep { position:absolute; inset:0; border-radius:inherit; background:conic-gradient(from 0deg, transparent 0 75%, color-mix(in srgb, var(--color-primary) 45%, transparent) 100%); animation: nf-rotate 3.2s linear infinite; }
.nf-zero__ping { position:absolute; inset:0; border-radius:inherit; border:1px solid var(--color-primary); opacity:0; animation: nf-ping 3s ease-out infinite; }
.nf-zero__ping:nth-of-type(2) { animation-delay:1.5s; }
.nf-zero__orbit { position:absolute; inset:0; animation: nf-rotate 5s linear infinite; }
.nf-zero__orbit::after { content:''; position:absolute; top:-.085em; left:50%; width:.07em; height:.07em; margin-left:-.035em; border-radius:var(--radius-full); background:var(--color-on-surface); box-shadow:0 0 16px var(--color-primary); }
.nf-zero__core { position:absolute; top:50%; left:50%; width:.09em; height:.09em; margin:-.045em 0 0 -.045em; border-radius:var(--radius-full); background:var(--color-primary); animation: nf-pulse 1.6s ease-in-out infinite; }

/* terminal */
.nf-term { font-family:ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace; border-radius:var(--radius-md); border:1px solid var(--color-outline); background:color-mix(in srgb, var(--color-surface) 70%, transparent); }
.nf-type { display:block; max-width:100%; overflow:hidden; white-space:nowrap; width:calc(var(--chars) * 1ch); animation: nf-type var(--dur,1.2s) steps(var(--chars)) var(--delay,1s) backwards; }
.nf-fade-line { animation: nf-fade .5s ease-out var(--delay,2s) backwards; }
.nf-cursor { display:inline-block; width:.55ch; height:1.05em; margin-left:2px; vertical-align:text-bottom; background:var(--color-primary); animation: nf-blink 1s steps(1) infinite; }

/* keyframes */
@keyframes nf-card-in { from { opacity:0; transform:translateY(40px) scale(.94); filter:blur(16px); } }
@keyframes nf-item-in { from { opacity:0; transform:translateY(20px); filter:blur(6px); } }
@keyframes nf-drop { from { opacity:0; transform:translateY(-80px) scale(.7) rotate(-6deg); filter:blur(10px); } }
@keyframes nf-float { 0%,100% { translate:0 0; } 50% { translate:0 -10px; } }
@keyframes nf-spin { to { --nf-angle:360deg; } }
@keyframes nf-rotate { to { transform:rotate(360deg); } }
@keyframes nf-ping { 0% { opacity:.7; transform:scale(1); } 100% { opacity:0; transform:scale(1.9); } }
@keyframes nf-pulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.8); opacity:.5; } }
@keyframes nf-grid-drift { to { transform:translate(64px,64px); } }
@keyframes nf-blob { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(40px,-30px) scale(1.12); } 66% { transform:translate(-30px,30px) scale(.92); } }
@keyframes nf-rise-particle { 0% { opacity:0; transform:translateY(0) scale(.6); } 10% { opacity:.8; } 90% { opacity:.4; } 100% { opacity:0; transform:translateY(-90vh) scale(1.2); } }
@keyframes nf-type { from { width:0; } }
@keyframes nf-fade { from { opacity:0; transform:translateX(-6px); } }
@keyframes nf-blink { 50% { opacity:0; } }
@keyframes nf-glitch-a { 0%,100% { opacity:0; } 2% { opacity:.85; transform:translate(-4px,1px); clip-path:inset(10% 0 55% 0); } 4% { opacity:.85; transform:translate(3px,-1px); clip-path:inset(60% 0 8% 0); } 6% { opacity:0; } }
@keyframes nf-glitch-b { 0%,100% { opacity:0; } 3% { opacity:.8; transform:translate(4px,-1px); clip-path:inset(45% 0 20% 0); } 5% { opacity:.8; transform:translate(-3px,2px); clip-path:inset(5% 0 70% 0); } 7% { opacity:0; } }

/* reduced motion: show final state, nothing moves */
@media (prefers-reduced-motion: reduce) {
  .nf-root *, .nf-root *::before, .nf-root *::after { animation:none !important; transition:none !important; }
  .nf-tilt { transform:none !important; }
  .nf-particle, .nf-zero__ping, .nf-digit::before, .nf-digit::after { display:none; }
}
`;

export default function NotFoundPage() {
  const pathname = usePathname() || '/';
  const shown = pathname.length > MAX_PATH ? `${pathname.slice(0, MAX_PATH - 1)}…` : pathname;
  const request = `GET ${shown}`;
  const tiltRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !tiltRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const el = tiltRef.current;
    el.style.setProperty('--nf-ry', `${(px - 0.5) * 6}deg`);
    el.style.setProperty('--nf-rx', `${(0.5 - py) * 5}deg`);
    el.style.setProperty('--nf-mx', `${px * 100}%`);
    el.style.setProperty('--nf-my', `${py * 100}%`);
  }, []);

  const onLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--nf-ry', '0deg');
    el.style.setProperty('--nf-rx', '0deg');
  }, []);

  const v = (o: Record<string, string | number>) => o as React.CSSProperties;

  return (
    <>
      <style>{css}</style>
      <main>
        <section
          className="nf-root flex min-h-screen items-center justify-center px-4 pb-16 pt-32 sm:px-6"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <div className="nf-grid" aria-hidden="true" />
          <div className="nf-glow nf-glow--a" aria-hidden="true" />
          <div className="nf-glow nf-glow--b" aria-hidden="true" />
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="nf-particle"
              aria-hidden="true"
              style={v({ '--x': p.x, '--s': p.s, '--d': p.d, '--delay': p.delay })}
            />
          ))}

          <div ref={tiltRef} className="nf-tilt w-full max-w-3xl">
            <div className="nf-card px-6 py-12 text-center sm:px-12 sm:py-16">
              <h1 className="nf-digits font-display" aria-label="Error 404">
                <span className="nf-digit" data-text="4" style={v({ '--i': 0 })} aria-hidden="true">4</span>
                <span className="nf-zero" aria-hidden="true">
                  <span className="nf-zero__sweep" />
                  <span className="nf-zero__ping" />
                  <span className="nf-zero__ping" />
                  <span className="nf-zero__orbit" />
                  <span className="nf-zero__core" />
                </span>
                <span className="nf-digit" data-text="4" style={v({ '--i': 2 })} aria-hidden="true">4</span>
              </h1>

              <p className="nf-item mt-8 font-display text-headline-lg text-on-surface" style={v({ '--i': 1 })}>
                This Route Doesn&rsquo;t Exist
              </p>

              <p className="nf-item mx-auto mt-3 max-w-md text-body-md text-on-surface-variant" style={v({ '--i': 2 })}>
                The page you&rsquo;re looking for was moved, retired, or never shipped. Let&rsquo;s get you back to
                something that&rsquo;s in production.
              </p>

              <div
                className="nf-term nf-item mx-auto mt-8 max-w-md px-4 py-3 text-left text-label-sm text-on-surface-variant"
                style={v({ '--i': 3 })}
                aria-hidden="true"
              >
                <span
                  className="nf-type text-primary"
                  style={v({ '--chars': request.length + 2, '--dur': '1.1s', '--delay': '1.1s' })}
                >
                  $ {request}
                </span>
                <span className="nf-fade-line mt-1 block text-error" style={v({ '--delay': '2.3s' })}>
                  404 &middot; Not Found
                </span>
                <span className="nf-fade-line mt-1 block" style={v({ '--delay': '2.8s' })}>
                  &gt; rerouting to a safe path
                  <span className="nf-cursor" />
                </span>
              </div>

              <div
                className="nf-item mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                style={v({ '--i': 4 })}
              >
                <Button href="/" variant="primary">Back to Home</Button>
                <Button href="/services" variant="secondary">Explore Services</Button>
                <Button href="/contact" variant="ghost">Contact Us</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
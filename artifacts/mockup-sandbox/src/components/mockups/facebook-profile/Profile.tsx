import { useEffect, useRef, useState } from "react";
import "./_group.css";

type Phase = "intro" | "descending" | "clicking" | "zoomed";

export function Profile() {
  const feedRef = useRef<HTMLDivElement>(null);
  const firstPostRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [cursor, setCursor] = useState({ x: 185, y: 100, visible: false, clicking: false });
  const animFrameRef = useRef<number | null>(null);

  const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animateCursor = (
    x1: number, y1: number, x2: number, y2: number,
    ms: number, onDone?: () => void
  ) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const e = ease(t);
      setCursor(c => ({ ...c, x: x1 + (x2 - x1) * e, y: y1 + (y2 - y1) * e }));
      if (t < 1) animFrameRef.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const q = (delay: number, fn: () => void) => { timers.push(setTimeout(fn, delay)); };

    // 0.5s  → cursor appears
    q(500,  () => setCursor(c => ({ ...c, visible: true })));

    // 0.8s  → scroll + cursor moves down
    q(800, () => {
      setPhase("descending");

      // Scroll feed while cursor descends
      const scrollStart = performance.now();
      const scrollFeed = (now: number) => {
        const t = Math.min((now - scrollStart) / 1900, 1);
        if (feedRef.current) feedRef.current.scrollTop = ease(t) * 310;
        if (t < 1) requestAnimationFrame(scrollFeed);
      };
      requestAnimationFrame(scrollFeed);

      // Cursor descends from top area to post area
      animateCursor(185, 120, 185, 445, 1900, () => {
        // 2.7s: arrived — slight hover pause then click
        q(160, () => {
          setCursor(c => ({ ...c, clicking: true }));
          setPhase("clicking");
        });
        q(480, () => {
          setCursor(c => ({ ...c, clicking: false }));
          setPhase("zoomed");
        });
      });
    });

    return () => {
      timers.forEach(clearTimeout);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="fb-root">
      {/* Giant glowing cursor */}
      {cursor.visible && (
        <div
          className={`big-cursor ${cursor.clicking ? "cursor-click" : ""}`}
          style={{ left: cursor.x, top: cursor.y }}
        >
          {cursor.clicking && <div className="ripple r1" />}
          {cursor.clicking && <div className="ripple r2" />}
          {cursor.clicking && <div className="ripple r3" />}
        </div>
      )}

      {/* ── 3D Background ── */}
      <div className="bg-scene">
        <div className="bg-far-grid" />
        <div className="bg-mid-grid" />
        <div className="bg-orb o1" />
        <div className="bg-orb o2" />
        <div className="bg-orb o3" />
        <div className="bg-orb o4" />
        <div className="bg-streak s1" />
        <div className="bg-streak s2" />
        <div className="bg-streak s3" />
        <div className="bg-vignette" />
        <div className="bg-floor" />
      </div>

      {/* ── Phone + 3D zoom scene ── */}
      <div className={`phone-scene phase-${phase}`}>
        <div className="phone-shadow" />
        <div className="phone-frame">
          <div className="notch" />

          {/* Status bar */}
          <div className="status-bar">
            <span className="s-time">9:41</span>
            <div className="s-icons">
              <SignalIcon /><WifiIcon /><span style={{fontSize:11}}>🔋</span>
            </div>
          </div>

          {/* Feed */}
          <div className="feed-scroll" ref={feedRef}>

            {/* Cover */}
            <div className="cover-photo">
              <div className="cover-shimmer" />
              <div className="cover-gradient" />
            </div>

            {/* Profile */}
            <div className="profile-section">
              <div className="avatar-wrap">
                <div className="avatar-blank"><span className="avatar-icon">👤</span></div>
                <div className="avatar-dot" />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:10 }}>
                <Skel w={155} h={20} r={6} />
                <Skel w={100} h={13} r={4} delay={0.1} />
                <Skel w={75}  h={13} r={4} delay={0.2} />
              </div>
              <div className="action-row">
                <button className="btn-add">＋ Add Friend</button>
                <button className="btn-msg">Message</button>
                <button className="btn-dot">•••</button>
              </div>
              <div className="friends-row">
                {[...Array(6)].map((_,i) => (
                  <div key={i} className="friend-pip" style={{ left: i*20 }} />
                ))}
                <span className="friends-text">___ mutual friends</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
              {["Posts","About","Friends","Photos","More"].map((t,i) => (
                <div key={t} className={`tab ${i===0?"tab-on":""}`}>{t}</div>
              ))}
            </div>

            <div style={{ height:8, background:"#f0f2f5" }} />

            {/* ── FIRST POST ── */}
            <div
              ref={firstPostRef}
              className={`post-card first-post ${phase==="zoomed" ? "post-full" : ""}`}
            >
              <div className="post-head">
                <div className="post-av" />
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                  <Skel w={110} h={13} r={4} />
                  <Skel w={70}  h={11} r={3} delay={0.15} />
                </div>
                <span className="post-menu">•••</span>
              </div>

              {/* ── THE WHITE POST AREA ── */}
              <div className="post-body">
                <div className="blank-label">Your content here</div>
              </div>

              <div className="post-stats">
                <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                  {"👍❤️😮".split("").map((e,i) => <span key={i} style={{fontSize:14}}>{e}</span>)}
                  <Skel w={50} h={11} r={3} style={{ marginLeft:4 }} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <Skel w={55} h={11} r={3} />
                  <Skel w={45} h={11} r={3} delay={0.1} />
                </div>
              </div>

              <div className="post-actions">
                {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([ic,lb]) => (
                  <div key={lb} className="action-btn">{ic} {lb}</div>
                ))}
              </div>

              <div className="comment-sec">
                <CommentRow wide />
                <CommentRow />
                <div className="cinput-row">
                  <div className="self-av" />
                  <div className="cinput">Write a comment…</div>
                </div>
              </div>
            </div>

            {/* Second post */}
            <div className="post-card">
              <div className="post-head">
                <div className="post-av" />
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                  <Skel w={110} h={13} r={4} />
                  <Skel w={70}  h={11} r={3} />
                </div>
                <span className="post-menu">•••</span>
              </div>
              <div className="post-body tall">
                <div className="blank-label">Your content here</div>
              </div>
              <div className="post-actions">
                {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([ic,lb]) => (
                  <div key={lb} className="action-btn">{ic} {lb}</div>
                ))}
              </div>
              <div className="comment-sec">
                <CommentRow />
                <div className="cinput-row">
                  <div className="self-av" />
                  <div className="cinput">Write a comment…</div>
                </div>
              </div>
            </div>

            {/* Third post */}
            <div className="post-card">
              <div className="post-head">
                <div className="post-av" />
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                  <Skel w={110} h={13} r={4} />
                  <Skel w={70}  h={11} r={3} />
                </div>
                <span className="post-menu">•••</span>
              </div>
              <div className="post-body">
                <div className="blank-label">Your content here</div>
              </div>
              <div className="post-actions">
                {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([ic,lb]) => (
                  <div key={lb} className="action-btn">{ic} {lb}</div>
                ))}
              </div>
              <div className="comment-sec">
                <div className="cinput-row">
                  <div className="self-av" />
                  <div className="cinput">Write a comment…</div>
                </div>
              </div>
            </div>

            <div style={{ height:80 }} />
          </div>

          {/* Bottom nav */}
          <div className="bottom-nav">
            {["🏠","🔍","▶","🛒","☰"].map((ic,i) => (
              <div key={i} className={`nav-btn ${i===0?"nb-on":""}`}>{ic}</div>
            ))}
          </div>
        </div>
      </div>

      {/* White flash on zoom — pure satisfaction */}
      <div className={`zoom-flash ${phase==="zoomed" ? "flash-on" : ""}`} />

      {/* AD overlay */}
      <div className={`ad-overlay ${phase!=="intro" ? "ad-out" : ""}`}>
        <div className="ad-top">
          <span className="live-pill">● LIVE</span>
          <span className="sponsored-tag">SPONSORED</span>
        </div>
        <div className="ad-mid">
          <div className="ad-brand">YOUR BRAND</div>
          <div className="ad-headline">Your Story,<br />Everywhere.</div>
          <div className="ad-sub">Watch it unfold ↓</div>
        </div>
        <div className="ad-cta-btn">Learn More →</div>
      </div>
    </div>
  );
}

function Skel({ w, h, r, delay=0, style }: { w:number; h:number; r:number; delay?:number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#e4e6ea 0%,#d8dadf 50%,#e4e6ea 100%)",
      backgroundSize: "200% 100%",
      animation: `skel 1.8s ease ${delay}s infinite`,
      flexShrink: 0,
      ...style
    }} />
  );
}

function CommentRow({ wide }: { wide?: boolean }) {
  return (
    <div className="cmt-row">
      <div className="cmt-av" />
      <div className="cmt-bubble">
        <Skel w={70}  h={11} r={3} />
        <Skel w={wide ? 160 : 100} h={11} r={3} delay={0.1} />
        {wide && <Skel w={80} h={11} r={3} delay={0.2} />}
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" style={{marginRight:3}}>
      <rect x="0" y="4" width="2" height="6" rx="0.5"/>
      <rect x="3" y="2.5" width="2" height="7.5" rx="0.5"/>
      <rect x="6" y="1" width="2" height="9" rx="0.5"/>
      <rect x="9" y="0" width="2" height="10" rx="0.5"/>
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor" style={{marginRight:3}}>
      <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
      <path d="M3.5 6.5a6.5 6.5 0 0 1 9 0L11 8a4.5 4.5 0 0 0-6 0L3.5 6.5Z"/>
      <path d="M0 3.5A11 11 0 0 1 16 3.5l-1.5 1.5A9 9 0 0 0 1.5 5L0 3.5Z"/>
    </svg>
  );
}

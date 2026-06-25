import { useEffect, useRef, useState } from "react";
import "./_group.css";

type Phase = "intro" | "descending" | "clicking" | "zooming" | "zoomed";

export function Profile() {
  const feedRef = useRef<HTMLDivElement>(null);
  const firstPostRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [cursor, setCursor] = useState({ x: 185, y: 120, visible: false, clicking: false });
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Ease in-out cubic
  const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Animate cursor from (x1,y1) to (x2,y2) over `ms` milliseconds
  const animateCursor = (
    x1: number, y1: number,
    x2: number, y2: number,
    ms: number,
    onDone?: () => void
  ) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const e = ease(t);
      setCursor(c => ({ ...c, x: x1 + (x2 - x1) * e, y: y1 + (y2 - y1) * e }));
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    // Cinematic sequence
    // 0.6s  → cursor appears near top
    // 0.8s  → cursor starts scrolling down + feed scrolls
    // 2.6s  → cursor arrives at first post area
    // 2.8s  → click ripple fires
    // 3.2s  → zoom-in begins
    // 4.8s  → fully zoomed

    const seq: Array<[number, () => void]> = [
      [600,  () => setCursor(c => ({ ...c, visible: true }))],
      [900,  () => {
        setPhase("descending");
        // start scrolling the feed
        feedRef.current?.scrollTo({ top: 0, behavior: "instant" });
        // Animate cursor from top → first post position (phone-local ~y 420)
        animateCursor(185, 130, 185, 430, 1800, () => {
          // arrived at post
          setTimeout(() => {
            setCursor(c => ({ ...c, clicking: true }));
            setPhase("clicking");
            setTimeout(() => {
              setCursor(c => ({ ...c, clicking: false }));
              setPhase("zooming");
              // scroll into post
              firstPostRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 500);
          }, 120);
        });
        // Scroll feed gradually in sync
        let scrollStart = performance.now();
        const scrollTick = (now: number) => {
          const t = Math.min((now - scrollStart) / 1800, 1);
          if (feedRef.current) feedRef.current.scrollTop = ease(t) * 320;
          if (t < 1) requestAnimationFrame(scrollTick);
        };
        requestAnimationFrame(scrollTick);
      }],
      [4200, () => setPhase("zoomed")],
    ];

    const timers = seq.map(([delay, fn]) => setTimeout(fn, delay));
    return () => {
      timers.forEach(clearTimeout);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="fb-root">
      {/* Custom animated cursor */}
      {cursor.visible && (
        <div
          className={`big-cursor ${cursor.clicking ? "cursor-click" : ""}`}
          style={{ left: cursor.x, top: cursor.y }}
        >
          {cursor.clicking && <div className="click-ripple" />}
          {cursor.clicking && <div className="click-ripple delay" />}
        </div>
      )}

      {/* Deep 3D layered background */}
      <div className="bg-scene">
        <div className="bg-far-grid" />
        <div className="bg-mid-grid" />
        <div className="bg-near-vignette" />
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
        <div className="bg-orb orb4" />
        <div className="bg-streak streak1" />
        <div className="bg-streak streak2" />
        <div className="bg-streak streak3" />
        <div className="bg-floor-reflect" />
      </div>

      {/* Phone scene wrapper with 3D tilt */}
      <div className={`phone-scene phase-${phase}`}>
        {/* Reflection / shadow beneath phone */}
        <div className="phone-reflection" />

        <div className="phone-frame">
          {/* Notch */}
          <div className="notch" />

          {/* Status bar */}
          <div className="status-bar">
            <span className="status-time">9:41</span>
            <div className="status-icons">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="3" width="2" height="7" rx="1"/><rect x="3" y="2" width="2" height="8" rx="1"/><rect x="6" y="0" width="2" height="10" rx="1"/><rect x="9" y="1" width="2" height="9" rx="1"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" style={{marginLeft:4}}><path d="M7 2.5C9.2 2.5 11.2 3.4 12.6 4.9L14 3.5C12.2 1.6 9.7.5 7 .5S1.8 1.6 0 3.5L1.4 4.9C2.8 3.4 4.8 2.5 7 2.5Z"/><path d="M7 5.5C8.4 5.5 9.7 6.1 10.6 7L12 5.6C10.7 4.3 9 3.5 7 3.5S3.3 4.3 2 5.6L3.4 7C4.3 6.1 5.6 5.5 7 5.5Z"/><circle cx="7" cy="9" r="1.5"/></svg>
              <span style={{marginLeft:4,fontSize:10}}>🔋</span>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="feed-scroll" ref={feedRef}>

            {/* Cover photo */}
            <div className="cover-photo">
              <div className="cover-shimmer" />
              <div className="cover-noise" />
              <div className="cover-gradient" />
              {/* Facebook logo watermark */}
              <div className="fb-logo-mark">f</div>
            </div>

            {/* Profile section */}
            <div className="profile-section">
              <div className="avatar-outer">
                <div className="avatar-blank">
                  <div className="avatar-icon">👤</div>
                </div>
                <div className="avatar-online" />
              </div>
              <div className="profile-info">
                <div className="name-blank" />
                <div className="subinfo-blank" />
                <div className="subinfo-blank short" />
              </div>
              <div className="action-row">
                <button className="btn-primary"><span>＋</span> Add Friend</button>
                <button className="btn-secondary">Message</button>
                <button className="btn-more">•••</button>
              </div>
              <div className="friends-strip">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="friend-chip" style={{ left: i * 20 }} />
                ))}
                <div className="friends-label">___ mutual friends</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
              {["Posts", "About", "Friends", "Photos", "More"].map((t, i) => (
                <div key={t} className={`tab-item ${i === 0 ? "tab-active" : ""}`}>{t}</div>
              ))}
            </div>

            <div className="section-gap" />

            {/* ── FIRST POST ── */}
            <div
              ref={firstPostRef}
              className={`post-card first-post ${phase === "zooming" || phase === "zoomed" ? "post-zooming" : ""} ${phase === "zoomed" ? "post-fully-zoomed" : ""}`}
            >
              {/* Zoom spotlight overlay */}
              {(phase === "zooming" || phase === "zoomed") && (
                <div className="zoom-spotlight" />
              )}

              <div className="post-header">
                <div className="post-avatar" />
                <div className="post-meta">
                  <div className="ph-line w110" />
                  <div className="ph-line w70 thin" />
                </div>
                <div className="post-menu">•••</div>
              </div>

              {/* Blank white post area */}
              <div className="post-body">
                <div className="post-blank-area">
                  <div className="blank-label">Your content here</div>
                </div>
              </div>

              <div className="post-stats">
                <div className="stat-reactions">
                  <span className="ricon">👍</span>
                  <span className="ricon">❤️</span>
                  <span className="ricon">😮</span>
                  <div className="ph-line w50 thin" style={{marginLeft:4}} />
                </div>
                <div className="stat-right">
                  <div className="ph-line w55 thin" />
                  <div className="ph-line w45 thin" />
                </div>
              </div>

              <div className="post-actions">
                {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([icon, label]) => (
                  <div key={label} className="post-action-btn">{icon} {label}</div>
                ))}
              </div>

              <div className="comment-section">
                <CommentRow wide />
                <CommentRow />
                <div className="comment-input-row">
                  <div className="self-avatar" />
                  <div className="comment-input">Write a comment…</div>
                </div>
              </div>
            </div>

            {/* ── SECOND POST ── */}
            <div className="post-card">
              <div className="post-header">
                <div className="post-avatar" />
                <div className="post-meta">
                  <div className="ph-line w110" />
                  <div className="ph-line w70 thin" />
                </div>
                <div className="post-menu">•••</div>
              </div>
              <div className="post-body">
                <div className="post-blank-area tall">
                  <div className="blank-label">Your content here</div>
                </div>
              </div>
              <div className="post-actions">
                {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([icon, label]) => (
                  <div key={label} className="post-action-btn">{icon} {label}</div>
                ))}
              </div>
              <div className="comment-section">
                <CommentRow />
                <div className="comment-input-row">
                  <div className="self-avatar" />
                  <div className="comment-input">Write a comment…</div>
                </div>
              </div>
            </div>

            {/* ── THIRD POST ── */}
            <div className="post-card">
              <div className="post-header">
                <div className="post-avatar" />
                <div className="post-meta">
                  <div className="ph-line w110" />
                  <div className="ph-line w70 thin" />
                </div>
                <div className="post-menu">•••</div>
              </div>
              <div className="post-body">
                <div className="post-blank-area">
                  <div className="blank-label">Your content here</div>
                </div>
              </div>
              <div className="post-actions">
                {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([icon, label]) => (
                  <div key={label} className="post-action-btn">{icon} {label}</div>
                ))}
              </div>
              <div className="comment-section">
                <div className="comment-input-row">
                  <div className="self-avatar" />
                  <div className="comment-input">Write a comment…</div>
                </div>
              </div>
            </div>

            <div style={{ height: 80 }} />
          </div>

          {/* Bottom nav */}
          <div className="bottom-nav">
            {["🏠","🔍","▶","🛒","☰"].map((icon, i) => (
              <div key={i} className={`nav-btn ${i === 0 ? "nav-btn-active" : ""}`}>{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Commercial AD overlay — fades out */}
      <div className={`ad-overlay ${phase !== "intro" ? "ad-exit" : ""}`}>
        <div className="ad-top-badge">
          <span className="ad-pill">● LIVE</span>
          <span className="ad-tag">SPONSORED</span>
        </div>
        <div className="ad-center">
          <div className="ad-brand">YOUR BRAND</div>
          <div className="ad-headline">Your Story,<br />Everywhere.</div>
          <div className="ad-sub">Watch it unfold ↓</div>
        </div>
        <div className="ad-bottom-bar">
          <div className="ad-cta-btn">Learn More →</div>
        </div>
      </div>
    </div>
  );
}

function CommentRow({ wide }: { wide?: boolean }) {
  return (
    <div className="comment-row">
      <div className="comment-avatar" />
      <div className="comment-bubble">
        <div className="ph-line w80 bold-ph" />
        <div className="ph-line" style={{ width: wide ? "100%" : "65%" }} />
        {wide && <div className="ph-line w70" />}
      </div>
    </div>
  );
}

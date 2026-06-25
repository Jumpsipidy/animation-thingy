import { useEffect, useRef, useState } from "react";
import "./_group.css";

export function Profile() {
  const feedRef = useRef<HTMLDivElement>(null);
  const firstPostRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [phase, setPhase] = useState<"intro" | "scrolling" | "zoomed">("intro");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("scrolling");
      setScrolled(true);
      if (firstPostRef.current) {
        firstPostRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 2200);
    const t2 = setTimeout(() => {
      setPhase("zoomed");
      setZoomed(true);
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fb-root">
      {/* Big custom cursor */}
      <div
        className="big-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* 3D tilted background layer */}
      <div className="bg-3d-layer">
        <div className="bg-grid" />
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
        <div className="bg-glow" />
      </div>

      {/* Phone frame wrapper */}
      <div className={`phone-scene ${scrolled ? "scene-scrolled" : ""} ${zoomed ? "scene-zoomed" : ""}`}>
        <div className="phone-frame">
          {/* Status bar */}
          <div className="status-bar">
            <span className="status-time">9:41</span>
            <div className="status-icons">
              <span>▲</span><span>WiFi</span><span>🔋</span>
            </div>
          </div>

          {/* Scrollable feed */}
          <div className="feed-scroll" ref={feedRef}>
            {/* Cover photo */}
            <div className="cover-photo">
              <div className="cover-shimmer" />
              <div className="cover-gradient" />
            </div>

            {/* Profile section */}
            <div className="profile-section">
              <div className="avatar-ring">
                <div className="avatar-blank" />
              </div>
              <div className="profile-info">
                <div className="name-blank" />
                <div className="subinfo-blank" />
              </div>
              <div className="action-row">
                <div className="btn-primary-blank"><span>+ Add Friend</span></div>
                <div className="btn-secondary-blank"><span>Message</span></div>
                <div className="btn-more-blank">···</div>
              </div>
              <div className="friends-row">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="friend-avatar-mini" style={{ left: i * 22 }} />
                ))}
                <div className="friends-count-blank" />
              </div>
            </div>

            {/* Nav tabs */}
            <div className="profile-tabs">
              {["Posts", "About", "Friends", "Photos", "More"].map((tab, i) => (
                <div key={tab} className={`profile-tab ${i === 0 ? "tab-active" : ""}`}>
                  {tab}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="feed-divider" />

            {/* FIRST POST — blank white, ready for content */}
            <div
              ref={firstPostRef}
              className={`post-card first-post ${zoomed ? "post-zoomed" : ""}`}
            >
              <div className="post-header">
                <div className="post-avatar" />
                <div className="post-meta">
                  <div className="post-name-blank" />
                  <div className="post-time-blank" />
                </div>
                <div className="post-more">···</div>
              </div>
              {/* Blank white content area — ready for user */}
              <div className="post-content-blank">
                <div className="blank-hint">Your content here</div>
              </div>
              {/* Reactions bar */}
              <div className="post-reactions">
                <div className="reaction-counts">
                  <span className="react-emoji">👍</span>
                  <span className="react-emoji">❤️</span>
                  <span className="react-count-blank" />
                </div>
                <div className="comment-share-counts">
                  <div className="count-blank-sm" />
                  <div className="count-blank-sm" />
                </div>
              </div>
              <div className="post-actions">
                <div className="action-btn"><span>👍</span> Like</div>
                <div className="action-btn"><span>💬</span> Comment</div>
                <div className="action-btn"><span>↗</span> Share</div>
              </div>
              {/* Comment section */}
              <div className="comment-section">
                <div className="comment-row">
                  <div className="comment-avatar" />
                  <div className="comment-bubble">
                    <div className="comment-name-blank" />
                    <div className="comment-text-blank" />
                    <div className="comment-text-blank short" />
                  </div>
                </div>
                <div className="comment-row">
                  <div className="comment-avatar" />
                  <div className="comment-bubble">
                    <div className="comment-name-blank" />
                    <div className="comment-text-blank short2" />
                  </div>
                </div>
                <div className="comment-input-row">
                  <div className="comment-avatar-self" />
                  <div className="comment-input-blank"><span>Write a comment…</span></div>
                </div>
              </div>
            </div>

            {/* SECOND POST — blank white */}
            <div className="post-card">
              <div className="post-header">
                <div className="post-avatar" />
                <div className="post-meta">
                  <div className="post-name-blank" />
                  <div className="post-time-blank" />
                </div>
                <div className="post-more">···</div>
              </div>
              <div className="post-content-blank tall">
                <div className="blank-hint">Your content here</div>
              </div>
              <div className="post-reactions">
                <div className="reaction-counts">
                  <span className="react-emoji">👍</span>
                  <span className="react-emoji">😂</span>
                  <span className="react-count-blank" />
                </div>
              </div>
              <div className="post-actions">
                <div className="action-btn"><span>👍</span> Like</div>
                <div className="action-btn"><span>💬</span> Comment</div>
                <div className="action-btn"><span>↗</span> Share</div>
              </div>
              <div className="comment-section">
                <div className="comment-row">
                  <div className="comment-avatar" />
                  <div className="comment-bubble">
                    <div className="comment-name-blank" />
                    <div className="comment-text-blank" />
                  </div>
                </div>
                <div className="comment-input-row">
                  <div className="comment-avatar-self" />
                  <div className="comment-input-blank"><span>Write a comment…</span></div>
                </div>
              </div>
            </div>

            {/* THIRD POST — blank white */}
            <div className="post-card">
              <div className="post-header">
                <div className="post-avatar" />
                <div className="post-meta">
                  <div className="post-name-blank" />
                  <div className="post-time-blank" />
                </div>
                <div className="post-more">···</div>
              </div>
              <div className="post-content-blank">
                <div className="blank-hint">Your content here</div>
              </div>
              <div className="post-actions">
                <div className="action-btn"><span>👍</span> Like</div>
                <div className="action-btn"><span>💬</span> Comment</div>
                <div className="action-btn"><span>↗</span> Share</div>
              </div>
              <div className="comment-section">
                <div className="comment-input-row">
                  <div className="comment-avatar-self" />
                  <div className="comment-input-blank"><span>Write a comment…</span></div>
                </div>
              </div>
            </div>

            <div style={{ height: 60 }} />
          </div>

          {/* Bottom nav bar */}
          <div className="bottom-nav">
            {["🏠", "🔍", "📺", "🛒", "☰"].map((icon, i) => (
              <div key={i} className={`nav-icon ${i === 0 ? "nav-active" : ""}`}>{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad-style CTA overlay */}
      <div className={`ad-overlay ${phase === "intro" ? "ad-visible" : "ad-hidden"}`}>
        <div className="ad-badge">AD</div>
        <div className="ad-cta">
          <div className="ad-title">Your Brand Here</div>
          <div className="ad-sub">Scroll to your story ↓</div>
        </div>
      </div>
    </div>
  );
}

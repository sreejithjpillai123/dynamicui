import { useEffect, useState } from 'react';
import { blocksApi } from '../api';

// ── Block Renderers ────────────────────────────────────────

function BannerBlock({ content }) {
  const bg = content?.backgroundColor || '#FF6B35';
  return (
    <section className="client-banner" id="banner-block">
      <div className="client-banner-bg" style={{ background: `linear-gradient(135deg, ${bg} 0%, #C03000 100%)` }} />
      <div className="client-banner-overlay" />
      <div className="client-banner-content">
        <h1>{content?.heading || 'Welcome!'}</h1>
        <p>{content?.subheading || ''}</p>
        <a className="banner-cta" href="#menu-section">Explore Menu →</a>
      </div>
    </section>
  );
}

function CardBlock({ content }) {
  return (
    <section className="client-section" id="card-block">
      <h2 className="section-heading">{content?.heading || 'Categories'}</h2>
      <div className="section-line" />
      <div className="cards-grid">
        {(content?.items || []).map((item, i) => (
          <div key={i} className="ui-card" id={`card-item-${i}`}>
            <span className="card-icon">{item.icon || '🎯'}</span>
            <div className="card-label">{item.label}</div>
            <div className="card-desc">{item.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListBlock({ content }) {
  return (
    <section className="client-section" id="list-block">
      <h2 className="section-heading">{content?.heading || 'Menu'}</h2>
      <div className="section-line" />
      <div className="list-block">
        {(content?.items || []).map((item, i) => (
          <div key={i} className="list-item-row" id={`list-item-${i}`}>
            <div className="list-item-left">
              <div className="list-item-num">{i + 1}</div>
              <div className="list-item-name">{item.name}</div>
            </div>
            <div className="list-item-right">
              {item.tag && <span className="list-item-tag">{item.tag}</span>}
              <span className="list-item-price">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsBlock({ content }) {
  return (
    <section className="client-section stats-section" id="stats-block">
      <div className="client-section">
        <h2 className="section-heading">{content?.heading || 'Statistics'}</h2>
        <div className="section-line" />
        <div className="stats-grid">
          {(content?.stats || []).map((stat, i) => (
            <div key={i} className="stat-box" id={`stat-item-${i}`}>
              <span className="stat-box-icon">{stat.icon}</span>
              <div className="stat-box-value">{stat.value}</div>
              <div className="stat-box-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Block Router ───────────────────────────────────────────
function BlockRenderer({ block }) {
  switch (block.type) {
    case 'banner': return <BannerBlock content={block.content} />;
    case 'card':   return <CardBlock   content={block.content} />;
    case 'list':   return <ListBlock   content={block.content} />;
    case 'stats':  return <StatsBlock  content={block.content} />;
    default:
      return (
        <section className="client-section" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ padding: '2rem', opacity: 0.5 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧩</div>
            <div>Unknown block type: <strong>{block.type}</strong></div>
          </div>
        </section>
      );
  }
}

// ── Main client view ───────────────────────────────────────
export default function ClientView() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const { data } = await blocksApi.getClient();
      setBlocks(data.data || []);
      setError(null);
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
      setLastRefresh(Date.now());
    }
  };

  useEffect(() => {
    fetchBlocks();
    // Auto-refresh every 5 seconds to pick up admin changes
    const interval = setInterval(fetchBlocks, 5000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = Math.round((Date.now() - lastRefresh) / 1000);

  return (
    <div className="client-view">
      {/* Client info bar */}
      <div style={{
        position: 'sticky',
        top: 64,
        zIndex: 100,
        background: 'rgba(15,15,26,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="live-badge">
            <span className="live-dot" />
            Live Preview
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Auto-refreshes every 5s • {blocks.length} block{blocks.length !== 1 ? 's' : ''} active
          </span>
        </div>
        <button
          id="refresh-client-btn"
          className="btn btn-ghost"
          onClick={fetchBlocks}
          style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}
        >
          ↺ Refresh Now
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="client-section">
          <div style={{
            padding: '2rem',
            background: 'rgba(239,71,111,0.08)',
            border: '1px solid rgba(239,71,111,0.2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--danger)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
            <button className="btn btn-ghost" onClick={fetchBlocks}>Retry</button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && blocks.length === 0 && (
        <div className="client-section">
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: i === 0 ? 200 : 120, borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && blocks.length === 0 && (
        <div className="empty-state" style={{ marginTop: '4rem' }}>
          <div className="empty-state-icon">🌑</div>
          <h3>No active blocks</h3>
          <p>Enable some blocks in the Admin panel to see them here</p>
        </div>
      )}

      {/* Render blocks dynamically — ordered by admin config */}
      {!error && blocks.map(block => (
        <div key={block.id} id={`client-block-${block.id}`} style={{ animation: 'fadeIn 0.4s ease' }}>
          <BlockRenderer block={block} />
        </div>
      ))}

      {/* Footer */}
      {!loading && !error && blocks.length > 0 && (
        <footer style={{
          padding: '2rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            🌶️ SpiceKart
          </div>
          All UI blocks are dynamically configured via the Admin panel. No hardcoded sections.
        </footer>
      )}
    </div>
  );
}

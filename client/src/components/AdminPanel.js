import { useState } from 'react';
import { blocksApi } from '../api';

export default function AdminPanel({ blocks, setBlocks, loading, error, refetch, onAddBlock, onEditBlock, showToast }) {

  const [deleting, setDeleting] = useState(null);

  // Toggle active/inactive
  const handleToggle = async (id) => {
    try {
      const { data } = await blocksApi.toggle(id);
      setBlocks(prev => prev.map(b => b.id === id ? data.data : b));
      const newStatus = data.data.status;
      showToast(`Block ${newStatus === 'active' ? 'activated ✅' : 'deactivated ⚫'}`, newStatus === 'active' ? 'success' : 'info');
    } catch (e) {
      showToast('Toggle failed', 'error');
    }
  };

  // Delete block
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this block? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await blocksApi.delete(id);
      setBlocks(prev => prev.filter(b => b.id !== id));
      showToast('Block deleted', 'info');
    } catch (e) {
      showToast('Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // Move block up/down (reorder)
  const handleMove = async (index, direction) => {
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    newBlocks.forEach((b, i) => b.order = i + 1);
    setBlocks(newBlocks);

    try {
      await blocksApi.reorder(newBlocks.map(b => b.id));
      showToast('Order updated', 'success');
    } catch (e) {
      showToast('Reorder failed', 'error');
      refetch();
    }
  };

  const activeCount   = blocks.filter(b => b.status === 'active').length;
  const inactiveCount = blocks.filter(b => b.status !== 'active').length;

  const typeLabel = { banner: '🖼️ Banner', card: '🃏 Card', list: '📋 List', stats: '📊 Stats' };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">UI Block Manager</h1>
          <p className="admin-subtitle">Configure blocks that control the client-side layout</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-stats">
            <span className="stat-chip"><span className="dot orange" />{blocks.length} Total</span>
            <span className="stat-chip"><span className="dot green" />{activeCount} Active</span>
            {inactiveCount > 0 && <span className="stat-chip"><span className="dot gray" />{inactiveCount} Inactive</span>}
          </div>
          <button id="add-block-btn" className="btn btn-primary" onClick={onAddBlock}>
            ＋ Add Block
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          ⚠️ {error} — <button onClick={refetch} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton-block" />)}
        </div>
      )}

      {/* Blocks list */}
      {!loading && !error && (
        blocks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No blocks yet</h3>
            <p>Click "Add Block" to create your first UI block</p>
          </div>
        ) : (
          <div className="blocks-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span style={{ width: 24 }}></span>
              <span style={{ width: 34, textAlign: 'center' }}>#</span>
              <span style={{ flex: 1 }}>Block</span>
              <span>Actions</span>
            </div>

            {blocks.map((block, index) => (
              <div
                key={block.id}
                id={`block-row-${block.id}`}
                className={`block-item ${block.status === 'inactive' ? 'inactive' : ''}`}
              >
                {/* Drag handle (visual only) */}
                <span className="drag-handle" title="Drag to reorder">⠿</span>

                {/* Order number */}
                <div className="block-order">{block.order}</div>

                {/* Info */}
                <div className="block-info">
                  <div className="block-name">{block.title}</div>
                  <div className="block-meta">
                    <span className={`type-badge type-${block.type}`}>
                      {typeLabel[block.type] || block.type}
                    </span>
                    <span className={`status-pill ${block.status}`}>{block.status}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="block-actions">
                  {/* Move up */}
                  <button
                    id={`move-up-${block.id}`}
                    className="btn-icon move-up"
                    title="Move up"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    style={{ opacity: index === 0 ? 0.3 : 1 }}
                  >↑</button>

                  {/* Move down */}
                  <button
                    id={`move-down-${block.id}`}
                    className="btn-icon move-down"
                    title="Move down"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === blocks.length - 1}
                    style={{ opacity: index === blocks.length - 1 ? 0.3 : 1 }}
                  >↓</button>

                  {/* Toggle status */}
                  <button
                    id={`toggle-${block.id}`}
                    className={`btn-icon ${block.status === 'active' ? 'toggle-on' : 'toggle-off'}`}
                    title={block.status === 'active' ? 'Deactivate' : 'Activate'}
                    onClick={() => handleToggle(block.id)}
                  >
                    {block.status === 'active' ? '👁' : '🚫'}
                  </button>

                  {/* Edit */}
                  <button
                    id={`edit-${block.id}`}
                    className="btn-icon edit"
                    title="Edit block"
                    onClick={() => onEditBlock(block)}
                  >✏️</button>

                  {/* Delete */}
                  <button
                    id={`delete-${block.id}`}
                    className="btn-icon delete"
                    title="Delete block"
                    onClick={() => handleDelete(block.id)}
                    disabled={deleting === block.id}
                  >
                    {deleting === block.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Legend */}
      {!loading && blocks.length > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem 1.25rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          lineHeight: 1.8
        }}>
          <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>💡 How it works</strong>
          Use <strong>↑↓</strong> to reorder blocks • <strong>👁</strong> to show/hide on client •
          Changes are <strong>immediately reflected</strong> on the Client View tab — no code changes needed.
        </div>
      )}
    </div>
  );
}

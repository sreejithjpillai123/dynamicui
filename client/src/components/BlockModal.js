import { useState } from 'react';
import { blocksApi } from '../api';

// ── Type meta ─────────────────────────────────────────────
const BLOCK_TYPES = [
  { value: 'banner', label: 'Banner', icon: '🖼️' },
  { value: 'card',   label: 'Cards',  icon: '🃏' },
  { value: 'list',   label: 'List',   icon: '📋' },
  { value: 'stats',  label: 'Stats',  icon: '📊' },
];

// ── Default content by type ───────────────────────────────
const defaultContent = {
  banner: { heading: 'Welcome!', subheading: 'Discover something amazing', backgroundColor: '#FF6B35' },
  card:   { heading: 'Categories', items: [{ label: 'Item 1', icon: '🎯', description: 'Description here' }] },
  list:   { heading: 'Menu Highlights', items: [{ name: 'Dish 1', price: '₹199', tag: 'Popular' }] },
  stats:  { heading: 'Our Numbers', stats: [{ label: 'Customers', value: '1000+', icon: '😊' }] },
};

// ── Shared helpers ─────────────────────────────────────────
const FieldRow = ({ label, children }) => (
  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
    <label className="form-label" style={{ fontSize: '0.72rem' }}>{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    className="form-control"
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
  />
);

const SectionDivider = ({ label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    margin: '1.25rem 0 1rem', fontSize: '0.72rem',
    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
    color: 'var(--text-muted)'
  }}>
    <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    {label}
    <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
  </div>
);

// ── BANNER content editor ─────────────────────────────────
function BannerEditor({ content, onChange }) {
  const set = (key, val) => onChange({ ...content, [key]: val });
  return (
    <>
      <SectionDivider label="Banner Content" />
      <FieldRow label="Heading">
        <Input value={content.heading || ''} onChange={v => set('heading', v)} placeholder="e.g. Welcome to SpiceKart!" />
      </FieldRow>
      <FieldRow label="Subheading">
        <Input value={content.subheading || ''} onChange={v => set('subheading', v)} placeholder="e.g. Fresh food delivered fast" />
      </FieldRow>
      <FieldRow label="Background Color">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="color"
            value={content.backgroundColor || '#FF6B35'}
            onChange={e => set('backgroundColor', e.target.value)}
            style={{ width: 40, height: 36, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', background: 'none', padding: 2 }}
          />
          <Input value={content.backgroundColor || '#FF6B35'} onChange={v => set('backgroundColor', v)} placeholder="#FF6B35" />
        </div>
      </FieldRow>
    </>
  );
}

// ── CARD content editor ───────────────────────────────────
function CardEditor({ content, onChange }) {
  const setHeading = v => onChange({ ...content, heading: v });
  const setItems   = items => onChange({ ...content, items });

  const addItem = () => setItems([...(content.items || []), { label: '', icon: '🎯', description: '' }]);
  const removeItem = i => setItems((content.items || []).filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => {
    const updated = [...(content.items || [])];
    updated[i] = { ...updated[i], [key]: val };
    setItems(updated);
  };

  return (
    <>
      <SectionDivider label="Card Content" />
      <FieldRow label="Section Heading">
        <Input value={content.heading || ''} onChange={setHeading} placeholder="e.g. Our Categories" />
      </FieldRow>

      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="form-label" style={{ fontSize: '0.72rem', marginBottom: 0 }}>Cards ({(content.items || []).length})</span>
        <button type="button" onClick={addItem} className="btn btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>＋ Add Card</button>
      </div>

      {(content.items || []).map((item, i) => (
        <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Input value={item.icon || ''} onChange={v => updateItem(i, 'icon', v)} placeholder="🎯" />
            <div style={{ flex: 1 }}>
              <Input value={item.label || ''} onChange={v => updateItem(i, 'label', v)} placeholder="Card Label" />
            </div>
            <button type="button" onClick={() => removeItem(i)} style={{ background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.2)', borderRadius: 6, color: 'var(--danger)', cursor: 'pointer', padding: '0 0.5rem', fontSize: '0.85rem' }}>✕</button>
          </div>
          <Input value={item.description || ''} onChange={v => updateItem(i, 'description', v)} placeholder="Short description..." />
        </div>
      ))}
    </>
  );
}

// ── LIST content editor ───────────────────────────────────
function ListEditor({ content, onChange }) {
  const setHeading = v => onChange({ ...content, heading: v });
  const setItems   = items => onChange({ ...content, items });

  const addItem = () => setItems([...(content.items || []), { name: '', price: '', tag: '' }]);
  const removeItem = i => setItems((content.items || []).filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => {
    const updated = [...(content.items || [])];
    updated[i] = { ...updated[i], [key]: val };
    setItems(updated);
  };

  return (
    <>
      <SectionDivider label="List Content" />
      <FieldRow label="Section Heading">
        <Input value={content.heading || ''} onChange={setHeading} placeholder="e.g. Menu Highlights" />
      </FieldRow>

      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="form-label" style={{ fontSize: '0.72rem', marginBottom: 0 }}>Items ({(content.items || []).length})</span>
        <button type="button" onClick={addItem} className="btn btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>＋ Add Item</button>
      </div>

      {(content.items || []).map((item, i) => (
        <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ flex: 2 }}>
              <Input value={item.name || ''} onChange={v => updateItem(i, 'name', v)} placeholder="Item name" />
            </div>
            <div style={{ flex: 1 }}>
              <Input value={item.price || ''} onChange={v => updateItem(i, 'price', v)} placeholder="₹199" />
            </div>
            <div style={{ flex: 1 }}>
              <Input value={item.tag || ''} onChange={v => updateItem(i, 'tag', v)} placeholder="Tag (opt.)" />
            </div>
            <button type="button" onClick={() => removeItem(i)} style={{ background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.2)', borderRadius: 6, color: 'var(--danger)', cursor: 'pointer', padding: '0 0.5rem', fontSize: '0.85rem', flexShrink: 0 }}>✕</button>
          </div>
        </div>
      ))}
    </>
  );
}

// ── STATS content editor ──────────────────────────────────
function StatsEditor({ content, onChange }) {
  const setHeading = v => onChange({ ...content, heading: v });
  const setStats   = stats => onChange({ ...content, stats });

  const addStat = () => setStats([...(content.stats || []), { label: '', value: '', icon: '📊' }]);
  const removeStat = i => setStats((content.stats || []).filter((_, idx) => idx !== i));
  const updateStat = (i, key, val) => {
    const updated = [...(content.stats || [])];
    updated[i] = { ...updated[i], [key]: val };
    setStats(updated);
  };

  return (
    <>
      <SectionDivider label="Stats Content" />
      <FieldRow label="Section Heading">
        <Input value={content.heading || ''} onChange={setHeading} placeholder="e.g. Our Numbers" />
      </FieldRow>

      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="form-label" style={{ fontSize: '0.72rem', marginBottom: 0 }}>Stats ({(content.stats || []).length})</span>
        <button type="button" onClick={addStat} className="btn btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>＋ Add Stat</button>
      </div>

      {(content.stats || []).map((stat, i) => (
        <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Input value={stat.icon || ''} onChange={v => updateStat(i, 'icon', v)} placeholder="📊" />
            <div style={{ flex: 1 }}>
              <Input value={stat.value || ''} onChange={v => updateStat(i, 'value', v)} placeholder="1000+" />
            </div>
            <div style={{ flex: 2 }}>
              <Input value={stat.label || ''} onChange={v => updateStat(i, 'label', v)} placeholder="Label" />
            </div>
            <button type="button" onClick={() => removeStat(i)} style={{ background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.2)', borderRadius: 6, color: 'var(--danger)', cursor: 'pointer', padding: '0 0.5rem', fontSize: '0.85rem', flexShrink: 0 }}>✕</button>
          </div>
        </div>
      ))}
    </>
  );
}

// ── Content editor router ─────────────────────────────────
function ContentEditor({ type, content, onChange }) {
  switch (type) {
    case 'banner': return <BannerEditor content={content} onChange={onChange} />;
    case 'card':   return <CardEditor   content={content} onChange={onChange} />;
    case 'list':   return <ListEditor   content={content} onChange={onChange} />;
    case 'stats':  return <StatsEditor  content={content} onChange={onChange} />;
    default:       return null;
  }
}

// ── Main modal ────────────────────────────────────────────
export default function BlockModal({ block, onClose, onSaved, showToast }) {
  const isEdit = Boolean(block?.id);

  const initialType = block?.type || 'banner';
  const [form, setForm] = useState({
    title:   block?.title   || '',
    type:    initialType,
    status:  block?.status  || 'active',
    content: block?.content || defaultContent[initialType],
  });
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (type) => {
    setForm(prev => ({
      ...prev,
      type,
      // For new blocks reset content; for edits keep existing
      content: isEdit ? prev.content : defaultContent[type],
    }));
  };

  const handleContentChange = (newContent) => {
    setForm(prev => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return showToast('Title is required', 'error');

    setSaving(true);
    try {
      if (isEdit) {
        await blocksApi.update(block.id, form);
        showToast('Block updated! ✅', 'success');
      } else {
        await blocksApi.create(form);
        showToast('Block created! ✨', 'success');
      }
      onSaved();
    } catch (err) {
      showToast(err.message || 'Failed to save block', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" style={{ maxWidth: 580 }}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Edit Block' : '✨ New UI Block'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Block Title *</label>
              <input
                id="block-title"
                className="form-control"
                placeholder="e.g. Welcome Banner"
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                required
                autoFocus
              />
            </div>

            {/* Block Type */}
            <div className="form-group">
              <label className="form-label">Block Type</label>
              <div className="type-selector">
                {BLOCK_TYPES.map(t => (
                  <div
                    key={t.value}
                    id={`type-${t.value}`}
                    className={`type-option ${form.type === t.value ? 'selected' : ''}`}
                    onClick={() => handleTypeChange(t.value)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTypeChange(t.value)}
                  >
                    <span className="type-option-icon">{t.icon}</span>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="toggle-switch">
                <div
                  id="status-toggle"
                  className={`toggle-track ${form.status === 'active' ? 'on' : ''}`}
                  onClick={() => setForm(p => ({ ...p, status: p.status === 'active' ? 'inactive' : 'active' }))}
                  role="switch"
                  aria-checked={form.status === 'active'}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setForm(p => ({ ...p, status: p.status === 'active' ? 'inactive' : 'active' }))}
                >
                  <span className="toggle-thumb" />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: form.status === 'active' ? 'var(--success)' : 'var(--text-muted)' }}>
                  {form.status === 'active' ? '🟢 Active — visible on client' : '⚫ Inactive — hidden from client'}
                </span>
              </div>
            </div>

            {/* ── Dynamic content editor ── */}
            <ContentEditor
              type={form.type}
              content={form.content || defaultContent[form.type]}
              onChange={handleContentChange}
            />

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button id="save-block-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving...' : isEdit ? '💾 Update Block' : '✨ Create Block'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

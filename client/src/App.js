import { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import ClientView from './components/ClientView';
import BlockModal from './components/BlockModal';
import { useBlocks } from './api';
import { useToast, ToastContainer } from './Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'client'
  const [modalBlock, setModalBlock] = useState(null); // null = closed, {} = new, {id,...} = edit
  const { blocks, setBlocks, loading, error, refetch } = useBlocks('admin/blocks');
  const { toasts, addToast } = useToast();

  const openAddModal = () => setModalBlock({});
  const openEditModal = (block) => setModalBlock(block);
  const closeModal = () => setModalBlock(null);

  const handleSaved = () => {
    closeModal();
    refetch();
  };

  return (
    <div className="app-shell">
      {/* Navigation */}
      <nav className="app-nav">
        <a className="nav-brand" href="/" id="app-logo">
          <span className="nav-brand-icon">🌶️</span>
          UI
        </a>

        <div className="nav-tabs" role="tablist">
          <button
            id="tab-admin"
            role="tab"
            aria-selected={activeTab === 'admin'}
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            ⚙️ Admin Panel
          </button>
          <button
            id="tab-client"
            role="tab"
            aria-selected={activeTab === 'client'}
            className={`nav-tab ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => setActiveTab('client')}
          >
            🌐 Client View
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dynamic UI Blocks</span>
        </div>
      </nav>

      {/* Tab content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'admin' && (
          <AdminPanel
            blocks={blocks}
            setBlocks={setBlocks}
            loading={loading}
            error={error}
            refetch={refetch}
            onAddBlock={openAddModal}
            onEditBlock={openEditModal}
            showToast={addToast}
          />
        )}

        {activeTab === 'client' && (
          <ClientView />
        )}
      </main>

      {/* Block Modal */}
      {modalBlock !== null && (
        <BlockModal
          block={Object.keys(modalBlock).length > 0 ? modalBlock : null}
          onClose={closeModal}
          onSaved={handleSaved}
          showToast={addToast}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

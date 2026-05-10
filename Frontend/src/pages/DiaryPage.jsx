import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useDiary } from "../hooks/useDiary";
import DarkDiaryCard from "../components/diary/DiaryCard";
import DarkDiaryEditor from "../components/diary/DiaryEditor";

export default function DiaryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, error, getEntries, createEntry, updateEntry, deleteEntry, togglePin } = useDiary();

  const [entries, setEntries]           = useState([]);
  const [pagination, setPagination]     = useState({ currentPage: 1, totalPages: 1, totalEntries: 0 });
  const [page, setPage]                 = useState(1);
  const [editorOpen, setEditorOpen]     = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  const [saveLoading, setSaveLoading]   = useState(false);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openEditor  = (entry = null) => { setEditingEntry(entry); setEditorOpen(true); };
  const closeEditor = ()             => { setEditingEntry(null);  setEditorOpen(false); };

  const fetchEntries = useCallback(async () => {
    try {
      const res = await getEntries({ page, limit: 9 });
      setEntries(res.data);
      setPagination(res.pagination);
    } catch {}
  }, [page]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleSave = async (formData) => {
    setSaveLoading(true);
    try {
      if (editingEntry) {
        const res = await updateEntry(editingEntry._id, formData);
        setEntries((prev) => prev.map((e) => (e._id === editingEntry._id ? res.data : e)));
        showToast("Entry updated ✓");
      } else {
        await createEntry(formData);
        showToast("Entry saved ✓");
        fetchEntries();
      }
      closeEditor();
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      setPagination((p) => ({ ...p, totalEntries: p.totalEntries - 1 }));
      showToast("Entry deleted");
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await togglePin(id);
      setEntries((prev) => prev.map((e) => (e._id === id ? res.data : e)));
    } catch (err) {
      showToast(err.message || "Failed to toggle pin", "error");
    }
  };

  return (
    <div className="flex h-screen text-white relative overflow-hidden" style={{ background: "#1e1e2f" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col p-6 min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 rounded-xl flex flex-col overflow-hidden" style={{ background: "#141427" }}>

          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-3 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div>
              <h1 className="text-xl font-semibold text-purple-400">My Diary 📖</h1>
              <p className="text-xs text-slate-500 mt-1">
                {pagination.totalEntries} {pagination.totalEntries === 1 ? "entry" : "entries"}
              </p>
            </div>
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 text-xs font-medium text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)", boxShadow: "0 4px 15px rgba(147,51,234,0.35)" }}
            >
              <span className="text-base font-light">+</span> New Entry
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading && entries.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#c084fc" }} />
              </div>

            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <p className="text-red-400 text-sm">Failed to load entries</p>
                <button onClick={fetchEntries} className="text-xs text-purple-400 hover:underline">Try again</button>
              </div>

            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="text-5xl opacity-30">📖</div>
                <p className="text-slate-400 font-medium">No entries yet</p>
                <p className="text-slate-600 text-sm">Start writing your first diary entry</p>
                <button
                  onClick={() => openEditor()}
                  className="mt-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl"
                  style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)", boxShadow: "0 4px 15px rgba(147,51,234,0.3)" }}
                >
                  Write first entry
                </button>
              </div>

            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entries.map((entry) => (
                    <DarkDiaryCard
                      key={entry._id}
                      entry={entry}
                      onEdit={openEditor}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                      isDeleting={deletingId === entry._id}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-4 py-2 text-sm rounded-xl text-slate-400 disabled:opacity-30 hover:text-white transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-slate-500">
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-4 py-2 text-sm rounded-xl text-slate-400 disabled:opacity-30 hover:text-white transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {editorOpen && (
        <DarkDiaryEditor
          entry={editingEntry}
          onSave={handleSave}
          onClose={closeEditor}
          loading={saveLoading}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium"
          style={{
            background: toast.type === "error" ? "#ef4444" : "#1e1e2f",
            border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.5)" : "rgba(192,132,252,0.3)"}`,
            color: toast.type === "error" ? "#fff" : "#c084fc",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
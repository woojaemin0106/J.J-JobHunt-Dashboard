import { memo, useCallback, useMemo, useState } from "react";
import { ui } from "../utils/ui";
import { useNotes, useNoteActions } from "../store/noteStore";
import type { Note } from "../types/note";
import ConfirmDialog from "../components/ConfirmDialog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const NoteCard = memo(function NoteCard({
  note,
  isEditing,
  editingDraft,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onDraftChange,
}: {
  note: Note;
  isEditing: boolean;
  editingDraft: Note | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDraftChange: (next: Note) => void;
}) {
  if (isEditing && editingDraft) {
    return (
      <article className={`${ui.card} space-y-3`}>
        <h3 className="text-sm font-bold text-slate-900">메모 편집</h3>
        <input
          type="text"
          className={ui.input}
          value={editingDraft.title}
          onChange={(event) =>
            onDraftChange({ ...editingDraft, title: event.target.value })
          }
        />
        <textarea
          className={ui.input}
          rows={6}
          value={editingDraft.content}
          onChange={(event) =>
            onDraftChange({ ...editingDraft, content: event.target.value })
          }
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ui.btnPrimary} onClick={onSave}>
            저장
          </button>
          <button type="button" className={ui.btnSecondary} onClick={onCancel}>
            취소
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={`${ui.card} flex h-full flex-col`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900">{note.title}</h3>
        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            onClick={() => onEdit(note)}
          >
            편집
          </button>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
            onClick={() => onDelete(note.id)}
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm leading-relaxed text-slate-700">
        {note.content.trim().length > 0 ? (
          <p className="whitespace-pre-wrap">{note.content}</p>
        ) : (
          <p className={ui.muted}>내용이 비어 있습니다.</p>
        )}
      </div>

      <div className="mt-3 text-xs font-medium text-slate-500">
        마지막 수정 {formatDate(note.updatedAt)}
      </div>
    </article>
  );
});

export default function Notes() {
  const notes = useNotes();
  const { addNote, updateNote, removeNote } = useNoteActions();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Note | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    noteId: string | null;
  }>({ isOpen: false, noteId: null });

  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes]);

  const closeCreateForm = useCallback(() => {
    setIsCreateOpen(false);
    setNewNoteTitle("");
    setNewNoteContent("");
  }, []);

  const handleAddNote = useCallback(() => {
    const title = newNoteTitle.trim();
    if (title.length === 0) return;

    addNote({
      title,
      content: newNoteContent.trim(),
    });
    closeCreateForm();
  }, [addNote, closeCreateForm, newNoteContent, newNoteTitle]);

  const handleStartEdit = useCallback((note: Note) => {
    setEditingNoteId(note.id);
    setEditingDraft(note);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingNoteId(null);
    setEditingDraft(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingDraft || !editingNoteId) return;

    const title = editingDraft.title.trim();
    if (title.length === 0) return;

    updateNote(editingNoteId, {
      title,
      content: editingDraft.content.trim(),
    });
    handleCancelEdit();
  }, [editingDraft, editingNoteId, handleCancelEdit, updateNote]);

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, noteId: id });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteConfirm.noteId) return;

    removeNote(deleteConfirm.noteId);
    setDeleteConfirm({ isOpen: false, noteId: null });
  }, [deleteConfirm.noteId, removeNote]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-cyan-900 to-blue-900 p-6 text-white shadow-[var(--jj-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
              Notes workspace
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              면접 준비 메모를 한 화면에서 정리하세요
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-cyan-100/95">
              회사별 조사 내용, 예상 질문, 회고를 기록해두면 복습 속도가 크게 빨라집니다.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm">
            <div className="text-[11px] text-cyan-100/80">저장된 메모</div>
            <div className="text-2xl font-black">{notes.length}</div>
          </div>
        </div>
      </section>

      <section className={ui.card}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className={ui.cardTitle}>메모 작성</h3>
            <p className="mt-1 text-sm text-slate-500">
              핵심 포인트만 먼저 적고, 필요할 때 편집으로 내용을 확장하세요.
            </p>
          </div>
          <button
            type="button"
            className={ui.btnPrimary}
            onClick={() => setIsCreateOpen((current) => !current)}
          >
            {isCreateOpen ? "입력 닫기" : "+ 새 메모 추가"}
          </button>
        </div>

        {isCreateOpen ? (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <input
              type="text"
              className={ui.input}
              placeholder="메모 제목"
              value={newNoteTitle}
              onChange={(event) => setNewNoteTitle(event.target.value)}
            />
            <textarea
              className={ui.input}
              rows={6}
              placeholder="메모 내용"
              value={newNoteContent}
              onChange={(event) => setNewNoteContent(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button type="button" className={ui.btnPrimary} onClick={handleAddNote}>
                저장
              </button>
              <button type="button" className={ui.btnSecondary} onClick={closeCreateForm}>
                취소
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {sortedNotes.length === 0 ? (
        <section className={ui.card}>
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            아직 메모가 없습니다. 면접 준비 포인트를 첫 메모로 남겨보세요.
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={editingNoteId === note.id}
              editingDraft={editingNoteId === note.id ? editingDraft : null}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              onDraftChange={setEditingDraft}
            />
          ))}
        </section>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="메모 삭제"
        message="선택한 메모를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, noteId: null })}
      />
    </div>
  );
}

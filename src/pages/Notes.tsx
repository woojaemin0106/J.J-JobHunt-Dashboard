// src/pages/Notes.tsx
import { useState, useCallback, memo } from "react";
import { ui } from "../utils/ui";
import { useNotes, useNoteActions } from "../store/noteStore";
import type { Note } from "../types/note";
import ConfirmDialog from "../components/ConfirmDialog";

/**
 * 메모 카드 컴포넌트
 * React.memo로 감싸서 해당 note가 변경될 때만 리렌더링됩니다.
 */
const NoteCard = memo(function NoteCard({
  note,
  isEditing,
  editingNote,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditingNoteChange,
}: {
  note: Note;
  isEditing: boolean;
  editingNote: Note | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEditingNoteChange: (note: Note) => void;
}) {
  if (isEditing && editingNote) {
    return (
      <div className={ui.card}>
        <div className="space-y-3">
          <input
            type="text"
            className={ui.input}
            value={editingNote.title}
            onChange={(e) =>
              onEditingNoteChange({ ...editingNote, title: e.target.value })
            }
          />
          <textarea
            className={ui.input}
            rows={5}
            value={editingNote.content}
            onChange={(e) =>
              onEditingNoteChange({ ...editingNote, content: e.target.value })
            }
          />
          <div className="flex gap-3">
            <button className={ui.btnPrimary} onClick={onSave}>
              저장
            </button>
            <button className={ui.btnSecondary} onClick={onCancel}>
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.card}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-lg">{note.title}</h3>
        <div className="flex gap-2">
          <button
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={() => onEdit(note)}
          >
            수정
          </button>
          <button
            className="text-sm text-rose-500 hover:text-rose-700"
            onClick={() => onDelete(note.id)}
          >
            삭제
          </button>
        </div>
      </div>
      <div className="text-sm text-slate-600 whitespace-pre-wrap">
        {note.content || <span className={ui.muted}>내용 없음</span>}
      </div>
      <div className="mt-3 text-xs text-slate-400">
        {new Date(note.updatedAt).toLocaleDateString("ko-KR")}
      </div>
    </div>
  );
});

export default function Notes() {
  const notes = useNotes();
  const { addNote, updateNote, removeNote } = useNoteActions();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    noteId: string | null;
  }>({ isOpen: false, noteId: null });

  // useCallback으로 핸들러 함수들을 안정화하여 NoteCard 리렌더링 방지
  const handleAdd = useCallback(() => {
    if (newNoteTitle.trim()) {
      addNote({
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNewNoteTitle("");
      setNewNoteContent("");
      setShowNewForm(false);
    }
  }, [newNoteTitle, newNoteContent, addNote]);

  const handleEdit = useCallback((note: Note) => {
    setEditingNote(note);
    setIsEditing(note.id);
  }, []);

  const handleSave = useCallback(() => {
    if (editingNote) {
      updateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
      });
      setIsEditing(null);
      setEditingNote(null);
    }
  }, [editingNote, updateNote]);

  const handleCancel = useCallback(() => {
    setIsEditing(null);
    setEditingNote(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, noteId: id });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirm.noteId) {
      removeNote(deleteConfirm.noteId);
      setDeleteConfirm({ isOpen: false, noteId: null });
    }
  }, [deleteConfirm.noteId, removeNote]);

  const handleEditingNoteChange = useCallback((note: Note) => {
    setEditingNote(note);
  }, []);

  return (
    <div className="space-y-4">
      <div className={ui.card}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className={ui.cardTitle}>메모장</div>
            <div className={ui.muted}>중요한 정보와 아이디어를 기록하세요</div>
          </div>
          <button
            className={ui.btnPrimary}
            onClick={() => setShowNewForm(!showNewForm)}
          >
            + 새 메모
          </button>
        </div>
      </div>

      {showNewForm && (
        <div className={ui.card}>
          <div className="space-y-3">
            <input
              type="text"
              className={ui.input}
              placeholder="메모 제목"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <textarea
              className={ui.input}
              rows={5}
              placeholder="메모 내용"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <div className="flex gap-3">
              <button className={ui.btnPrimary} onClick={handleAdd}>
                저장
              </button>
              <button
                className={ui.btnSecondary}
                onClick={() => {
                  setShowNewForm(false);
                  setNewNoteTitle("");
                  setNewNoteContent("");
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 ? (
          <div className={ui.card}>
            <div className={ui.muted}>메모가 없습니다.</div>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={isEditing === note.id}
              editingNote={isEditing === note.id ? editingNote : null}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSave={handleSave}
              onCancel={handleCancel}
              onEditingNoteChange={handleEditingNoteChange}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="메모 삭제"
        message="정말 이 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, noteId: null })}
      />
    </div>
  );
}

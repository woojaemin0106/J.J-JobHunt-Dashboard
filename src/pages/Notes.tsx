// src/pages/Notes.tsx
import { useState } from "react";
import { ui } from "../utils/ui";
import { useNotes, useNoteActions } from "../store/noteStore";
import type { Note } from "../types/note";
import ConfirmDialog from "../components/ConfirmDialog";

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

  const handleAdd = () => {
    if (newNoteTitle.trim()) {
      addNote({
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNewNoteTitle("");
      setNewNoteContent("");
      setShowNewForm(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditing(note.id);
  };

  const handleSave = () => {
    if (editingNote) {
      updateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
      });
      setIsEditing(null);
      setEditingNote(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, noteId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.noteId) {
      removeNote(deleteConfirm.noteId);
      setDeleteConfirm({ isOpen: false, noteId: null });
    }
  };

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
            <div key={note.id} className={ui.card}>
              {isEditing === note.id && editingNote ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    className={ui.input}
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                  />
                  <textarea
                    className={ui.input}
                    rows={5}
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, content: e.target.value })
                    }
                  />
                  <div className="flex gap-3">
                    <button className={ui.btnPrimary} onClick={handleSave}>
                      저장
                    </button>
                    <button
                      className={ui.btnSecondary}
                      onClick={() => {
                        setIsEditing(null);
                        setEditingNote(null);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-slate-500 hover:text-slate-700"
                        onClick={() => handleEdit(note)}
                      >
                        수정
                      </button>
                      <button
                        className="text-sm text-rose-500 hover:text-rose-700"
                        onClick={() => handleDelete(note.id)}
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
                </>
              )}
            </div>
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

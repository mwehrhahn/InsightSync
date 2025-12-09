import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    type Note,
} from "../api/notes";


const NotesPage: React.FC = () => {
    const { user, logout } = useAuth();

    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

  useEffect(() => {
      const load = async () => {
          try {
              const data = await fetchNotes();
              setNotes(data);
          } catch (err) {
              console.error(err);
              setError("Failed to load notes");
          } finally {
              setLoading(false);
          }
      };

      load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
          const newNote = await createNote({ title, content });
          setNotes((prev) => [newNote, ...prev]);
          setTitle("");
          setContent("");
      } catch (err) {
          console.error(err);
          setError("Failed to create note");
      }
  };

  const handleDelete = async (id: number) => {
      try {
          await deleteNote(id);
          setNotes((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
          console.error(err);
          setError("Failed to delete note");
      }
  };

  const handleUpdate = async (id: number) => {
      const newTitle = window.prompt("New title?");
      if (!newTitle) return;

      try {
          const updated = await updateNote(id, { title: newTitle });
          setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
          );
      } catch (err) {
          console.error(err);
          setError("Failed to update note");
      };
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "3rem 1.5rem", maxWidth: 800, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <span style={{ color: "#6366F1", fontWeight: 600 }}>InsightSync</span>
          <span style={{ marginLeft: 12, color: "#e5e5e5" }}>
            {user?.email}
          </span>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: 999,
            border: "none",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Your Notes
      </h1>

      <form
        onSubmit={handleCreate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginBottom: "2rem",
          maxWidth: 480,
        }}
      >
        <input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: 8, border: "1px solid #4b5563" }}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
          style={{ padding: "0.5rem", borderRadius: 8, border: "1px solid #4b5563" }}
        />
        <button
          type="submit"
          style={{
            alignSelf: "flex-start",
            padding: "0.5rem 1.25rem",
            borderRadius: 999,
            border: "none",
            background: "#6366F1",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Note
        </button>
      </form>

      {error && <div style={{ color: "salmon", marginBottom: "1rem" }}>{error}</div>}

      {loading ? (
        <div>Loading notes…</div>
      ) : notes.length === 0 ? (
        <div>No notes yet. Create your first one!</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                padding: "1rem",
                borderRadius: 12,
                background: "#111827",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h2 style={{ margin: 0 }}>{note.title}</h2>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleUpdate(note.id)}>Edit</button>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
              </div>
              <p style={{ margin: 0, color: "#e5e5e5" }}>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesPage;

// frontend/src/api/notes.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function authHeaders(json: boolean = false): HeadersInit {
    const token = localStorage.getItem("access_token");

    const headers: Record<string, string> = {};
    if (json) {
        headers["Content-Type"] = "application/json";
    }
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

export type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type NoteCreate = {
  title: string;
  content: string;
};

export type NoteUpdate = Partial<NoteCreate>;

export async function fetchNotes(): Promise<Note[]> {
    const res = await fetch(`${API_BASE}/notes/`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!res.ok) {
        console.error("fetch notes failed:", res.status, await res.text());
        throw new Error("Failed to load notes");
    }

    const data = await res.json();
    console.log("Notes from API:", data);
    return data;
}

export async function createNote(payload: NoteCreate): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        console.error("create note failed:", res.status, await res.text());
        throw new Error("Failed to create note");
    }

    return res.json();
}

export async function updateNote(id: number, payload: NoteUpdate): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        console.error("update note failed:", res.status, await res.text());
        throw new Error("Failed to update note");
    }

  return res.json();
}

export async function deleteNote(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        console.error("delete note failed:", res.status, await res.text());
        throw new Error("Failed to delete note");
    }
}

import { useEffect, useState } from 'react';

import type { Note } from '../types';
import { createNote, deleteNote, getNotes } from '../utils/api';
import NoteCard from '../components/NoteCard/NoteCard';
import NoteForm from '../components/NoteForm/NoteForm';

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleCreate(title: string, body: string) {
    const note = await createNote(title, body);
    setNotes((prev) => [note, ...prev]);
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal');
    }
  }

  return (
    <section className="notes">
      <NoteForm onSubmit={handleCreate} />
      {isLoading && <p className="notes__message">Cargando...</p>}
      {error && <p className="notes__message notes__message_error">{error}</p>}
      {!isLoading && !error && notes.length === 0 && (
        <p className="notes__message">Todavía no tienes notas.</p>
      )}
      <ul className="notes__list">
        {notes.map((note) => (
          <li key={note._id}>
            <NoteCard note={note} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NotesPage;

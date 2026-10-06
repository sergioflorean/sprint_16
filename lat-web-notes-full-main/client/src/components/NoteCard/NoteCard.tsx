import type { Note } from '../../types';
import './NoteCard.css';

type Props = {
  note: Note;
  onDelete: (id: string) => void;
};

function NoteCard({ note, onDelete }: Props) {
  return (
    <article className="note-card">
      <h2 className="note-card__title">{note.title}</h2>
      <p className="note-card__body">{note.body}</p>
      <button
        type="button"
        className="note-card__delete-btn"
        onClick={() => onDelete(note._id)}
      >
        Eliminar
      </button>
    </article>
  );
}

export default NoteCard;

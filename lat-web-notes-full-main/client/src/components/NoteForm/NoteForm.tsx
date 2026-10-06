import { useState } from 'react';
import type { FormEvent } from 'react';

import './NoteForm.css';

type Props = {
  onSubmit: (title: string, body: string) => Promise<void>;
};

function NoteForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    try {
      await onSubmit(title, body);
      setTitle('');
      setBody('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Algo salió mal');
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        className="note-form__input"
        name="title"
        type="text"
        placeholder="Título"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="note-form__textarea"
        name="body"
        placeholder="Escribe tu nota"
        rows={3}
        required
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <button type="submit" className="note-form__submit-btn">
        Agregar nota
      </button>
      {submitError && <p className="note-form__error">{submitError}</p>}
    </form>
  );
}

export default NoteForm;

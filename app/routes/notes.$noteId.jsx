import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import styles from '~/styles/note-details.css';
import { getStoredNotes } from '~/data/notes';

// If we name this file as $noteId.jsx, the path will be at the base level. eg: localhost:300/noteId
// But what we want instead is to have it called under notes routes: localhost:300/notes/noteId
// In order to achieve this, we need to name the file as such:
// notes.$noteId.jsx

// "/" can be used for both relative and dynamic paths
// eg of dynamic path: ${note.id}
// eg of relative path: "/note-1"
export default function NoteDetailsPage() {
  const selectedNote = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to Notes</Link>
        </nav>
        <h1>{selectedNote.title}</h1>
      </header>
      <p id="note-details-content">{selectedNote.content}</p>
    </main>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

// params is also available on action()
export async function loader({ params }) {
  const notes = await getStoredNotes();
  // console.log(params);
  const selectedNote = notes.find((note) => note.id === params.noteId);
  // The noteId part from params.noteId comes the filename that we have created

  if (!selectedNote) {
    throw json(
      { message: `Could not locate path for #${params.noteId}` },
      { status: 404 }
    );
  }
  return selectedNote;
}

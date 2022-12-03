import { Link } from '@remix-run/react';
import styles from '~/styles/note-details.css';

// If we name this file as $noteId.jsx, the path will be at the base level. eg: localhost:300/noteId
// But what we want instead is to have it called under notes routes: localhost:300/notes/noteId
// In order to achieve this, we need to name the file as such:
// notes.$noteId.jsx

// "/" can be used for both relative and dynamic paths
// eg of dynamic path: ${note.id}
// eg of relative path: "/note-1"
export default function NoteDetailsPage() {
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to Notes</Link>
        </nav>
        <h1>Note Title</h1>
      </header>
      <p id="note-details-content">Note Content</p>
    </main>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

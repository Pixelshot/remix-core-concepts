import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

// loader()'s job is to communicate between backend and frontend
export async function loader() {
  const notes = await getStoredNotes();
  return notes;
}

// action() is a server-side method provided by Remix to handle all non-get requests
// get request simply returns the component itself
// See vid #18 for more clarification
export async function action({ request }) {
  const formData = await request.formData();
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content'),
  // };

  // Alternate(shortcut) way of extracting form data
  const noteData = Object.fromEntries(formData);

  // Simple validation
  if (noteData.title.trim().length < 5) {
    // Technically we need to parse data that we're sending into json format(Don't forget to import json from @remix-run/node):

    //return json({message: 'Title needs to have at least 5 words'})

    // However, since Remix does this for us by default, we can omit the json keyword
    return { message: 'Title needs to have at least 5 words' };
  }
  // Add New Note to Existing Notes
  const existingNotes = await getStoredNotes();

  // Create a simple id for notes
  noteData.id = new Date().toISOString();

  // Update an existing note by concating new input into the old one
  const updatedNotes = existingNotes.concat(noteData);

  // Store the new note into existing notes(usually in a database but for this example we're keeping it simple)
  await storeNotes(updatedNotes);

  // Uncomment this if you want to test data loading(using setTimeout())
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));

  // Redirect after submission
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

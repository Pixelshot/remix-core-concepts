import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData, useCatch } from '@remix-run/react';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

// === === === === === === === === === === === === === === === === === === === === ===
// Whenever we throw a response, Remix will run for the CatchBoundary() component,
// Whenever we throw anything BUT a response, Remix will run ErrorBoundary() component
// Whenever we return something, it runs the default page component
// === === === === === === === === === === === === === === === === === === === === ===

export default function NotesPage() {
  // Data wrapped in loader() is tranferred to the frontend by using the useLoaderData() hook
  const notes = useLoaderData();

  // useLoaderData() & useActionData() can be called in any component, not just in routes

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

// loader()'s job is to load data from backend to the frontend
// loader() is triggered everytime there is a get request on that particular route file
// Code inside of loader() and action() will only be executed on the backend, never on the frontend
export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Found no notes' },
      {
        status: 404,
        statusText: 'Not Found',
      }
    );
  }
  return notes;
}

// === === === === === === === === === === === === === === === === === === === === ===
// Difference between loader() & action():

// If we want to act on something that's been submitted(usually a form), we use action().

// If we want to load data from the server/backend we use loader()
// === === === === === === === === === === === === === === === === === === === === ===

// action() is a server-side method provided by Remix to handle all NON-get requests
// get request simply returns the component itself
// See vid #18 for more clarification
// action() returns a prop.
// Within that prop lies a request object
// And inside of request, lies formData() that houses the inputs of a submitted form
// They can be extracted via their name attributes over on the front-end
export async function action({ request }) {
  // formData() contains data from a submitted form.
  const formData = await request.formData();
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content'),
  // };

  // Alternate(shortcut) way of extracting form data
  const noteData = Object.fromEntries(formData);

  // Simple validation
  // Usually validation is done via front-end which gives us access to front-end functions like alert()
  // But everything inside action() is all back-end. Which means we have no access to those functions
  // What we can do instead is send data to the front-end via the 'return' keyword and let them take it from there
  if (noteData.title.trim().length < 5) {
    // Technically we need to parse data that we're sending into json format(Don't forget to import json from @remix-run/node):

    //return json({message: 'Title needs to have at least 5 words'})

    // However, Remix does this by default. This means we can omit the json keyword
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

// links is for CSS
export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

// function for Meta Data
// MetaData that is set up on a page will merge together with a higher level page's metadata
// If they have the same key name, the lower page's metadata will be chosen
// For example, the meta() below contains a title key, the same key name can also be found in the root's metadata
// The chosen metadata will be the one on this page instead of root
// Where to place this function inside of a file doesn't matter
// In other words, the order doesn't matter
// this function returns a JavaScript Object that contains multiple datas
// data is whatever exported by loader function
// location is a window.location-like object that has some data about the current route
// params is an object containing route params
// parentsData is a hashmap of all the data exported by loader functions of current route and all of its parents
// For more info: https://remix.run/docs/en/v1/api/conventions#page-context-in-meta-function
export function meta() {
  return {
    title: 'All Notes ',
    description: 'Manage your notes with ease',
  };
}

// This is a notes specific error handling. For more info on error handlings(errorboundary), see root page
export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>You have encountered an error in the notes section</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">Homepage</Link>
      </p>
    </main>
  );
}

// CatchBoundary() handles all response errors
// A CatchBoundary() component has access to the status code and thrown response data through useCatch. - Remix doc
export function CatchBoundary() {
  const caughtResponse = useCatch();
  const statusCode = caughtResponse.status;
  const message = caughtResponse.data.message;
  return (
    <>
      <NewNote />
      <main className="error">
        <h1>{statusCode}</h1>
        <p>{message}</p>
      </main>
    </>
  );
}

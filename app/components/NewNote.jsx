import {
  Form,
  useActionData,
  useTransition as useNavigation,
} from '@remix-run/react';
import styles from './NewNote.css';

function NewNote() {
  const data = useActionData(); // The most common use-case for this hook is form validation errors.
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    // <form></form> is for backend
    // <Form></Form> is for front-end
    // If you don't want the page to reload after submission, use <Form>
    <Form method="post" id="note-form">
      {data?.message && <p>{data.message}</p>}
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows="5" required />
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? 'loading...' : 'Add Note'}
        </button>
      </div>
    </Form>
  );
}

export default NewNote;

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

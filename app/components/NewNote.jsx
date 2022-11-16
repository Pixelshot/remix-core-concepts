import {
  Form,
  useActionData,
  useTransition as useNavigation,
} from '@remix-run/react';
import styles from './NewNote.css';

function NewNote() {
  const data = useActionData(); // The most common use-case for this hook is form validation errors.

  // useTransition will be changed to useNavigation in the near future
  // To prepare for this change, it's easier to alias useTransition to useNavigation
  // This hook tells you everything you need to know about a page transition to build pending navigation indicators and optimistic UI on data mutations. (Taken from Remix docs)
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
    // Upon submission, all inputs are then packaged into POST request.
    // We can capture this request by creating an action() in a routes folder.
    // action() contains an object which includes request where formData() lives.
    // formData() is where the inputs are located and we can extract them out via their names attribute  that's located in form/Form.
  );
}

export default NewNote;

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';

import Styles from '~/styles/main.css';
import MainNavigation from './components/MainNavigation';

export const meta = () => ({
  charset: 'utf-8',
  title: 'Remix Cookbook App',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// ErrorBoundary contains default javascript object as a prop
// We can destructure the object and pull out error from it
// A default error object typically contains a message property that we can use to tell the user what exactly is the error

// If a route doesn't have an error boundary, the error "bubbles up" to the closest error boundary, all the way to the root, so you don't have to add error boundaries to every route--only when you want to add that extra touch to your UI. (Taken from Remix documentation)

// Just like ErrorBoundary(), root level CatchBoundary() catches all unhandled error responses that's generated within the app and route specific CatchBoundary() will handle any error responses related to that route

export function ErrorBoundary({ error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>An error has occured</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <main className="error">
          <h1>You have encountered an error that is coming from root</h1>
          <p>{error.message}</p>
          <p>
            Back to <Link to="/">Homepage</Link>
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// CatchBoundary() component handles all requests errors
// We can catch them via useCatch()
export function CatchBoundary() {
  const caughtResponse = useCatch();
  // console.log(caughtResponse);
  // const message = caughtResponse.data.message;
  const statusCode = caughtResponse.status;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{statusCode}</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <main className="error">
          <h1>{statusCode}</h1>
          <p>{caughtResponse.statusText}</p>
          <p>
            {caughtResponse.data?.message || 'A response error has occured'}
          </p>
          <p>
            Back to <Link to="/">Homepage</Link>
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: Styles }];
}

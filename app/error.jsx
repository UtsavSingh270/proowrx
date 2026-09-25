'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="system-state" role="alert">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1>We could not load this page.</h1>
        <p>Please try again. If the problem continues, contact the Proowrx team.</p>
        <button className="btn btn-gold" type="button" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}

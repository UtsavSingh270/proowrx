import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="system-state">
      <div>
        <p className="eyebrow">404</p>
        <h1>This page could not be found.</h1>
        <p>The address may have changed, or the page may no longer be available.</p>
        <Link className="btn btn-gold" href="/">Return home</Link>
      </div>
    </main>
  );
}

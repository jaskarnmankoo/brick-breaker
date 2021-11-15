import * as React from 'react';

import { Link } from 'gatsby';

import SearchEngineOptimization from '../components/SearchEngineOptimization';

import useDarkMode from '../hooks/useDarkMode';

export default function NotFound() {
  const darkMode = useDarkMode(null);

  return (
    <>
      <SearchEngineOptimization title="Oops..." />
      <main className="grid grid-cols-1 gap-4 text-center">
        <h1>Brick Breaker</h1>
        <h2 className="text-xl bold">Page not found!</h2>
        <p>Oops! The page you are looking for has been removed or relocated.</p>
        <Link to="/" className="underline">
          Go Back
        </Link>
      </main>
    </>
  );
}

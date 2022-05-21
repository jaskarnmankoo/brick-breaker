import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useDarkMode(_darkMode: boolean): boolean {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  const checkDarkMode = React.useCallback(
    (event: MediaQueryListEvent) =>
      event.matches ? setIsDarkMode(true) : setIsDarkMode(false),
    []
  );

  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', checkDarkMode);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', checkDarkMode);
    };
  }, [checkDarkMode]);

  return isDarkMode;
}

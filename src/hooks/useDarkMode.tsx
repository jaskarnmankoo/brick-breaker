import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useDarkMode(_darkMode: null): boolean {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    const switchMode = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches ? true : false);
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', switchMode);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', switchMode);
    };
  }, []);

  return isDarkMode;
}

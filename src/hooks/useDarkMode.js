import * as React from 'react';

export default function useDarkMode(_darkMode) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    const switchMode = (event) => {
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

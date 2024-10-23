import { createContext, ReactNode, useMemo, useState } from 'react';
import type { PaletteMode } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import styles from '../styles/Layout.module.css';

export const ColorModeContext = createContext({
  toggleColorMode(): void {
    console.log('LEAVE ME HERE');
  },
  setColorMode(mode: PaletteMode): void {
    console.log('LEAVE ME HERE', mode);
  },
});

export function ColorModeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode(): void {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light');
      },
      setColorMode: (mode: PaletteMode): void => setMode(mode),
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        shape: {
          borderRadius: 16,
        },
        palette: {
          // palette values for light mode
          primary: {
            main: '#636eff',
          },
          secondary: {
            main: '#A8ACFF',
          },
          success: {
            main: '#4CAF50',
          },
          error: {
            main: '#FF4F6E',
          },
          background: {
            paper: '#EBEBFF',
            default: '#FFFFFF',
          },
          text: {
            primary: '#2C3169',
            secondary: '#6D6D6D',
          },
          divider: '#B1B1B1',
        },
        components: {
          MuiFilledInput: {
            styleOverrides: {
              root: {
                border: '2px solid #B1B1B1',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0) !important',
                border: 'none !important',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'unset',
                fontFamily: 'Inter',
                borderRadius: '16px',
                padding: '10px 30px',
                fontWeight: 600,
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                background: 'transparent',
                borderRadius: '16px',
                border: 'none',
                padding: 0,
                margin: 0,
                boxShadow: 'none',
                '&::before': {
                  display: 'none',
                },
                overflow: 'scroll',
              },
            },
          },
          MuiAccordionSummary: {
            styleOverrides: {
              root: {
                padding: '0px',
              },
            },
          },
          MuiAccordionDetails: {
            styleOverrides: {
              root: {
                overflow: 'scroll',
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'unset',
                fontSize: '1.25rem',
                fontWeight: '500',
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                color: '#2C3169',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                fontSize: '0.9rem',
                padding: '12px',
                boxShadow:
                  '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.12);',
              },
            },
          },
          MuiModal: {
            styleOverrides: {
              root: {
                '& .MuiBackdrop-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                overflowY: 'scroll',
              },
            },
          },
        },
        typography: {
          fontFamily: 'Montserrat',
          button: {
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: 1.5,
          },
          h1: {
            fontSize: '3rem',
          },
          h2: {
            fontSize: '2.5rem',
          },
          h3: {
            fontSize: '2rem',
          },
          h4: {
            fontSize: '1.5rem',
          },
          h5: {
            fontSize: '1.25rem',
          },
          h6: {
            fontSize: '1rem',
          },
          body1: {
            fontFamily: 'Inter',
          },
          body2: {
            fontFamily: 'Inter',
          },
        },
      }),
    [],
  );

  const lightBackgroundStyles = {
    background:
      'linear-gradient(30.22deg, rgba(177, 179, 252, 0.67) 0%, #FFFFFF 40%, rgba(255, 170, 0, 0.1) 80%, rgba(255, 116, 241, 0.36) 100%), #ffffff',
  };

  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <>
      <div style={lightBackgroundStyles} className={styles.background} />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={responsiveTheme}>{children}</ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

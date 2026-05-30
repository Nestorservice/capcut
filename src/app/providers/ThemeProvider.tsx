import React, { createContext, useContext } from 'react';
import { Colors, Typography, Dim } from '@constants/index';

const ThemeContext = createContext({ colors: Colors, typography: Typography, dim: Dim });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ colors: Colors, typography: Typography, dim: Dim }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

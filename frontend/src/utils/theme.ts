import { extendTheme } from '@chakra-ui/react';

// Discord-inspired dark mode and React-inspired light mode
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // React blue
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  discord: {
    primary: '#5865F2',
    green: '#57F287',
    yellow: '#FEE75C',
    fuchsia: '#EB459E',
    red: '#ED4245',
    background: '#36393f',
    channelsBar: '#2f3136',
    sidebar: '#202225',
    textNormal: '#dcddde',
    textMuted: '#a3a6aa',
    textLink: '#00aff4',
  },
  react: {
    primary: '#61dafb',
    secondary: '#282c34',
    text: '#292d3e',
    background: '#f7f7f7',
    backgroundAlt: '#ffffff',
    border: '#e6e6e6',
  }
};

const fonts = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

// Custom theme components
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      discord: {
        bg: 'discord.primary',
        color: 'white',
        _hover: {
          bg: '#4752c4',
          _disabled: {
            bg: 'discord.primary',
          },
        },
      },
      react: {
        bg: 'react.primary',
        color: 'react.secondary',
        _hover: {
          bg: '#4ac8f0',
          _disabled: {
            bg: 'react.primary',
          },
        },
      },
    },
  },
  Card: {
    baseStyle: (props: { colorMode: string }) => ({
      container: {
        bg: props.colorMode === 'dark' ? 'discord.channelsBar' : 'white',
        borderRadius: 'lg',
        boxShadow: props.colorMode === 'dark' ? 'none' : 'md',
        borderWidth: props.colorMode === 'dark' ? '0' : '1px',
        borderColor: props.colorMode === 'dark' ? 'transparent' : 'react.border',
      },
    }),
  },
};

// Custom semantic tokens
const semanticTokens = {
  colors: {
    bg: {
      default: 'react.background',
      _dark: 'discord.background',
    },
    bgAlt: {
      default: 'react.backgroundAlt',
      _dark: 'discord.channelsBar',
    },
    bgSidebar: {
      default: 'gray.50',
      _dark: 'discord.sidebar',
    },
    text: {
      default: 'react.text',
      _dark: 'discord.textNormal',
    },
    textMuted: {
      default: 'gray.600',
      _dark: 'discord.textMuted',
    },
    link: {
      default: 'blue.500',
      _dark: 'discord.textLink',
    },
    border: {
      default: 'react.border',
      _dark: 'whiteAlpha.300',
    },
    primary: {
      default: 'react.primary',
      _dark: 'discord.primary',
    },
  },
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({ 
  colors, 
  fonts, 
  components, 
  semanticTokens, 
  config,
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'discord.background' : 'react.background',
        color: props.colorMode === 'dark' ? 'discord.textNormal' : 'react.text',
      },
    }),
  },
});

export default theme;

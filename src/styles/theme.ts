import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: 'dark' | 'light' }) => ({
      'html, body': {
        backgroundColor: props.colorMode === 'dark' ? '#202125' : 'gray.50',
      },
    }),
  },
});

export default theme;
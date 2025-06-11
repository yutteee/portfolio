import 'destyle.css';
import '../src/styles/global.css';
import type { Preview } from '@storybook/react-vite'
import type { Decorator } from '@storybook/react';

const withHtmlClass: Decorator = (Story, context) => {
  const mode = context.parameters.mode;
  if (mode === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
  return Story();
};

const preview: Preview = {
  decorators: [withHtmlClass],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'error'
    },
  },
};

export default preview;
import 'destyle.css';
import '../src/styles/global.css';
import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error'
    },

    backgrounds: {
      default: 'background',
      values: [
        { name: 'background', value: 'var(--color-background)' },
        { name: 'white', value: '#fff' },
        { name: 'dark', value: '#04345c' }
      ]
    }
  },
};

export default preview;
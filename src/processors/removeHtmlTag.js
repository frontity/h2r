import { Fragment } from 'react';

export default {
  test: ({ component }) => component === 'html',
  process: () => ({ component: Fragment }),
};

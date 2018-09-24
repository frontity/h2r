import { Fragment } from 'react';

export default {
  test: ({ component }) => component === 'body',
  process: () => ({ component: Fragment }),
};

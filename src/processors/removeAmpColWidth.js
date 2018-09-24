export default {
  test: ({ component }, { stores }) =>
    stores.build.isAmp && component === 'col',
  process: ({ props: { span } }) => ({ props: { span } }),
};

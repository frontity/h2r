import LazyAudio from '../components/LazyAudio';

export default {
  test: ({ component }) => component === 'audio',
  process: ({ props }, { placeholder }) => ({
    component: LazyAudio,
    props: { ...props, placeholder },
  }),
};

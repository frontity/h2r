/* eslint-disable react/prop-types */
import LazyAudio from '../../components/LazyAudio';
import processor from '../audio';

const audio = {
  type: 'element',
  component: 'audio',
  props: {
    controls: true,
  },
  children: [
    {
      type: 'element',
      component: 'source',
      props: {
        type: 'audio/ogg',
        src: 'audio.ogg',
      },
    },
  ],
};

const noAudio = {
  type: 'element',
  component: 'p',
  children: [
    {
      type: 'text',
      content: 'Lorem ipsum dolor sit amet',
    },
  ],
};

describe('H2R › Audio processor', () => {
  test('does not pass test with invalid elements', () => {
    expect(processor.test(noAudio)).toBeFalsy();
  });
  test('passes test with valid elements', () => {
    expect(processor.test(audio)).toBeTruthy();
  });
  test('process valid elements', () => {
    const placeholder = 'placeholder';
    const { component, props } = processor.process(audio, { placeholder });
    expect(component).toBe(LazyAudio);
    expect(props.placeholder).toBe(placeholder);
  });
});

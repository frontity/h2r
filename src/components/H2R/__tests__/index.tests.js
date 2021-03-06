/* eslint-disable react/prop-types */
import React from 'react';
import renderer from 'react-test-renderer';
import { types } from 'mobx-state-tree';
import { Provider as MobxProvider } from 'mobx-react';
import H2R from '..';

// Test cases (h2r):
// without processors
// with a processor that test returns false
// with a processor that removes the node
// with a processor that changes component
// with a processor that changes component to React
// with a processor that adds/removes attributes
// with a processor that removes children
// with a processor that adds children
// with a processor that adds a node after it
// with a processor that uses extraProps
// with a processor that uses stores
// with a processor that uses theme
// with two or more processors
// with two or more processors (the first one fails while processing)
// with two or more processors that compete

const html = `
<!--This is a comment-->
<p id="paragraph">
  This is an html <span>example</span> for testing purposes.
</p>

<!--[class] attribute-->
<div class="hello">
  <img src="http://example.com/img.jpg">
</div>

<!--[autoplay] standalone attribute ([key/value] should be [autoPlay/true]-->
<audio autoplay>
  <source src="example.ogg" type="audio/ogg">
</div>
`;

const ThemeStoreMock = types.model({
  h2r: types.frozen({
    processorsByPriority: [],
  }),
});

const renderH2R = processors => {
  const theme = ThemeStoreMock.create({
    h2r: { processorsByPriority: processors },
  });

  return renderer
    .create(
      <MobxProvider stores={{ theme, someValue: 'from store' }}>
        <H2R html={html} payload={{ someValue: 'from payload' }} />
      </MobxProvider>,
    )
    .toJSON();
};

// Processors:
const testFail = {
  test: () => {
    throw Error("A processor's test has failed but nothing bad happened!");
  },
  process: () => ({ type: 'text', content: 'TEST HAS FAILED' }),
};

const removeImg = {
  test: ({ component }) => component === 'img',
  process: () => null,
};

const commentToText = {
  test: ({ type }) => type === 'comment',
  process: () => ({ type: 'text' }),
};

const toBlockquote = {
  test: ({ props }) => props.id === 'paragraph',
  process: () => ({ component: 'blockquote' }),
};

const toReactBlockquote = {
  test: ({ props }) => props.id === 'paragraph',
  process: () => {
    const Blockquote = ({ id, children }) => (
      <div id={id}>
        This is a React component
        <blockquote>{children}</blockquote>
      </div>
    );
    return { component: Blockquote };
  },
};

const idToClassName = {
  test: ({ props }) => props.id === 'paragraph',
  process: ({ props }) => ({ props: { className: props.id } }),
};

const removeChildren = {
  test: ({ props }) => props.id === 'paragraph' || props.className === 'hello',
  process: () => ({ children: null }),
};

const addNextNode = {
  test: ({ component }) => component === 'span',
  process: node => {
    const { children } = node.parent;
    const index = children.indexOf(node);
    children.splice(index + 1, 0, { type: 'text', content: ' code ' });
    return node;
  },
};

const valueFromPayload = {
  test: ({ props }) => props.id === 'paragraph',
  process: (_, { someValue }) => ({ props: { id: someValue } }),
};

const valueFromStores = {
  test: ({ props }) => props.id === 'paragraph',
  process: (_, { stores }) => ({ props: { id: stores.someValue } }),
};

const valueFromOptions = {
  test: ({ props }) => props.id === 'paragraph',
  process: (_, { optionsValue }) => ({ props: { id: optionsValue } }),
  options: { optionsValue: 'fromOptions' },
};

const processFails = {
  test: ({ props }) => props.id === 'paragraph',
  process: () => {
    throw Error('A processor has failed but nothing bad happened!');
  },
};

const toFigure = {
  test: ({ props }) => props.id === 'paragraph',
  process: ({ props, ...others }) => ({
    component: 'figure',
    props: {},
    children: [
      {
        type: 'element',
        component: 'img',
        src: 'https://example.com/test.png',
      },
      { ...others },
    ],
  }),
};

describe('H2R', () => {
  test('without processors', () => {
    expect(renderH2R([])).toMatchSnapshot();
  });

  test('with a processor that test fails', () => {
    expect(renderH2R([testFail])).toMatchSnapshot();
  });

  test('with a processor that removes the node', () => {
    expect(renderH2R([removeImg])).toMatchSnapshot();
  });

  test('with a processor that changes type', () => {
    expect(renderH2R([commentToText])).toMatchSnapshot();
  });

  test('with a processor that changes component', () => {
    expect(renderH2R([toBlockquote])).toMatchSnapshot();
  });

  test('with a processor that changes component to React', () => {
    expect(renderH2R([toReactBlockquote])).toMatchSnapshot();
  });

  test('with a processor that adds/removes attributes', () => {
    expect(renderH2R([idToClassName])).toMatchSnapshot();
  });

  test('with a processor that removes children', () => {
    expect(renderH2R([removeChildren])).toMatchSnapshot();
  });

  test('with a processor that adds a node after it', () => {
    expect(renderH2R([addNextNode])).toMatchSnapshot();
  });

  test('with a processor that uses payload', () => {
    expect(renderH2R([valueFromPayload])).toMatchSnapshot();
  });

  test('with a processor that uses stores', () => {
    expect(renderH2R([valueFromStores])).toMatchSnapshot();
  });

  test('with a processor that gets a prop from options', () => {
    expect(renderH2R([valueFromOptions])).toMatchSnapshot();
  });

  test('with two or more processors', () => {
    expect(
      renderH2R([commentToText, toBlockquote, removeImg]),
    ).toMatchSnapshot();
  });

  test('with two or more processors (the first one fails while processing)', () => {
    expect(renderH2R([processFails, toBlockquote])).toMatchSnapshot();
  });

  test('with two or more processors that try to change the same node', () => {
    expect(renderH2R([toFigure, toBlockquote])).toMatchSnapshot();
  });
});

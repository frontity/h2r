import React from 'react';
import renderer from 'react-test-renderer';
import Placeholder from '..';

describe('Placeholder', () => {
  test('has a class named "lazy-placeholder"', () => {
    const element = renderer.create(<Placeholder />).toJSON();
    expect(element).toMatchSnapshot();
  });
});

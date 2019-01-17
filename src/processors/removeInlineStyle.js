export default {
  test: element =>
    element && element.props && typeof element.props.style === 'string',
  process: element => {
    delete element.props.style;
    return element;
  },
};

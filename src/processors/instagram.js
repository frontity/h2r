import LazyInstagram from '../components/LazyInstagram';

// This function iterates the element object recursively until it finds an
// 'element' with component 'a' and its 'href' attribute matches a RegExp that
// captures an instagram ID.
export const getInstagramId = children => {
  if (!children) return '';

  const results = [];

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (child.type === 'element' && child.component === 'a') {
      const match = child.props.href.match(
        /https:\/\/www\.instagram\.com\/p\/([\w\d]+)/,
      );
      if (match) return match[1];
    }
    if (child.children) results.push(getInstagramId(child.children));
  }
  return results.reduce((result, current) => current || result, '');
};

export default {
  test: ({ component, props, ignore }) =>
    component === 'blockquote' &&
    props.className &&
    props.className.split(' ').includes('instagram-media') &&
    !ignore,
  process: (element, { placeholder }) => {
    const { props, ...rest } = element;
    const height = 'auto';
    const width = '100%';

    // Overrrides style props
    const style = {
      ...props.style,
      width: '500px',
      maxWidth: '100%',
      margin: '0 auto',
      boxSizing: 'border-box',
    };

    const newprops = Object.assign(props, { style });
    const instagramId = getInstagramId(element.children);

    return {
      component: LazyInstagram,
      props: {
        key: `instagram${instagramId}`,
        width,
        height,
        throttle: 50,
        instagramId,
        placeholder,
      },
      children: [{ ...rest, props: newprops, ignore: true }],
    };
  },
};

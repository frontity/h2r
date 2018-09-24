import LazyTweet from '../components/LazyTweet';

// This function iterates the element object recursively until it finds an
// 'element' with component 'a' and its 'href' attribute matches a RegExp that
// captures a tweet ID.
export const getTweetId = children => {
  if (!children) return '';

  const results = [];

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (child.type === 'element' && child.component === 'a') {
      const match = child.props.href.match(/\/status\/(\d+)/);
      if (match) return match[1];
    }
    if (child.children) results.push(getTweetId(child.children));
  }
  return results.reduce((result, current) => current || result, '');
};

export default {
  test: ({ component, props, ignore }) =>
    component === 'blockquote' &&
    props.className &&
    (props.className.split(' ').includes('twitter-tweet') ||
      props.className.split(' ').includes('twitter-video')) &&
    !ignore,
  process: element => {
    const { ...rest } = element;
    const height = 'auto';
    const width = '100%';
    const tweetId = getTweetId(element.children);

    return {
      component: LazyTweet,
      props: { key: `tweet${tweetId}`, width, height, throttle: 50, tweetId },
      children: [{ ...rest, ignore: true }],
    };
  },
};

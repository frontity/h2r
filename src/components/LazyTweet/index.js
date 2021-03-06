import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import LazyLoad from '@frontity/lazyload';
import styled from 'styled-components';
import Placeholder from '../Placeholder';

class LazyTweet extends Component {
  static propTypes = {
    children: PropTypes.shape({}).isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    isAmp: PropTypes.bool.isRequired,
    tweetId: PropTypes.string.isRequired,
    placeholder: PropTypes.node,
  };

  static defaultProps = {
    placeholder: null,
  };

  constructor() {
    super();

    this.ref = null;
    this.state = {
      loaded: false,
    };

    this.handleContentVisible = this.handleContentVisible.bind(this);
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return this.state.loaded !== nextState.loaded;
  }

  componentDidUpdate() {
    if (window.document.getElementById('lazy-twitter')) {
      if (window.twttr) window.twttr.widgets.load(this.ref);
    } else {
      const script = window.document.createElement('script');
      script.id = 'lazy-twitter';
      script.src = '//platform.twitter.com/widgets.js';
      script.async = true;
      script.chartset = 'utf-8';

      window.document.body.appendChild(script);
    }
  }

  handleContentVisible() {
    this.setState({
      loaded: true,
    });
  }

  render() {
    const { children, width, height, tweetId, isAmp, placeholder } = this.props;
    const { loaded } = this.state;

    if (isAmp) {
      return [
        <Helmet>
          <script
            async=""
            custom-element="amp-twitter"
            src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js"
          />
        </Helmet>,
        <Container
          styles={{ height, width }}
          ref={node => {
            this.ref = node;
          }}
        >
          <amp-twitter
            height={1}
            width={1}
            layout="responsive"
            data-tweetid={tweetId}
          />
        </Container>,
      ];
    }

    return (
      <Container
        styles={{ height, width }}
        ref={node => {
          this.ref = node;
        }}
      >
        {!loaded && <Placeholder>{placeholder}</Placeholder>}
        <StyledLazyLoad
          offsetVertical={2000}
          offsetHorizontal={-10}
          throttle={50}
          onContentVisible={this.handleContentVisible}
        >
          {children}
        </StyledLazyLoad>
      </Container>
    );
  }
}

export default inject(({ stores: { build } }) => ({
  isAmp: build.isAmp,
}))(LazyTweet);

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  width: ${({ styles }) => styles.width};
  height: ${({ styles }) => styles.height};
  min-height: 170px;
  margin: 15px 0;

  blockquote {
    margin: 0;
  }
`;

const StyledLazyLoad = styled(LazyLoad)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: transparent;
  border: none;
  z-index: 10;
`;

/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import LazyLoad from '@frontity/lazyload';
import Placeholder from '../Placeholder';

const LazyVideo = ({
  children,
  width,
  height,
  isAmp,
  attributes,
  placeholder,
}) => {
  const { autoPlay, loop, className, ...filteredAttributes } = attributes;

  if (isAmp) {
    return [
      <Helmet>
        <script
          async=""
          custom-element="amp-video"
          src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
        />
      </Helmet>,
      <Container styles={{ height, width }}>
        <amp-video
          autoPlay={autoPlay ? '' : null}
          loop={loop ? '' : null}
          layout="fill"
          controls=""
        >
          {children}
        </amp-video>
      </Container>,
    ];
  }

  return (
    <Container styles={{ height, width }}>
      <Placeholder>{placeholder}</Placeholder>
      <LazyLoad
        elementType="span"
        offsetVertical={2000}
        offsetHorizontal={-10}
        throttle={50}
      >
        <video
          controls
          autoPlay={!!autoPlay}
          loop={!!loop}
          {...filteredAttributes}
        >
          {children}
        </video>
      </LazyLoad>
    </Container>
  );
};

LazyVideo.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.shape({})),
  ]).isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  isAmp: PropTypes.bool.isRequired,
  attributes: PropTypes.shape({}).isRequired,
  placeholder: PropTypes.node,
};

LazyVideo.defaultProps = {
  placeholder: null,
};

export default inject(({ stores: { build } }) => ({
  isAmp: build.isAmp,
}))(LazyVideo);

const Container = styled.span`
  position: relative;
  box-sizing: border-box;
  width: ${({ styles }) => styles.width};
  height: ${({ styles }) => styles.height};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;

  video {
    width: 100%;
    height: 100%;
  }

  .LazyLoad {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: transparent;
    color: transparent;
    border: none;
  }
`;

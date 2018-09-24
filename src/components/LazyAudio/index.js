/* eslint-disable jsx-a11y/media-has-caption */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import LazyLoad from '@frontity/lazyload';
import styled from 'styled-components';
import Placeholder from '../Placeholder';

const LazyAudio = ({ isAmp, attributes, children, placeholder }) => {
  if (isAmp) {
    return (
      <Fragment>
        <Helmet>
          <script
            async=""
            custom-element="amp-audio"
            src="https://cdn.ampproject.org/v0/amp-audio-0.1.js"
          />
        </Helmet>
        <Container>
          <amp-audio controls layout="fixed-height" height="50px">
            {children}
          </amp-audio>
        </Container>
      </Fragment>
    );
  }

  return (
    <Container>
      <Placeholder>{placeholder}</Placeholder>
      <LazyLoad
        elementType="span"
        offsetVertical={2000}
        offsetHorizontal={-10}
        throttle={50}
      >
        <audio controls {...attributes}>
          {children}
        </audio>
      </LazyLoad>
    </Container>
  );
};

LazyAudio.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  isAmp: PropTypes.bool.isRequired,
  attributes: PropTypes.shape({}).isRequired,
  placeholder: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
};

LazyAudio.defaultProps = {
  placeholder: null,
  children: null,
};

export default inject(({ stores: { build } }) => ({
  isAmp: build.isAmp,
}))(LazyAudio);

const Container = styled.span`
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
  min-height: 60px;

  .LazyLoad {
    width: 100%;
  }

  amp-audio,
  audio {
    width: 100%;
  }
`;

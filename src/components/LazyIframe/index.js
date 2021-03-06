import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import LazyLoad from '@frontity/lazyload';
import Placeholder from '../Placeholder';

class LazyIframe extends Component {
  constructor(props) {
    super(props);

    this.ref = null;

    this.state = {
      width: props.width,
      height: props.height,
      loaded: false,
    };

    this.handleContentVisible = this.handleContentVisible.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  handleContentVisible() {
    this.setState({
      loaded: true,
    });
  }

  handleMessage({ data, source }) {
    if (this.ref && source === this.ref.contentWindow && data.height) {
      this.setState({
        height: `${data.height}px`,
      });
    }
  }

  render() {
    const { attributes, isAmp, placeholder } = this.props;
    const { width, height, loaded } = this.state;

    const {
      title,
      src,
      allowFullScreen,
      allowPaymentRequest,
      allowTransparency,
      width: attributesWidth,
      height: attributesHeight,
      ...rest
    } = attributes;

    if (isAmp) {
      return (
        <Fragment>
          <Helmet>
            <script
              async=""
              custom-element="amp-iframe"
              src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"
            />
          </Helmet>
          <amp-iframe
            title={title || ''}
            src={src}
            layout="fixed-height"
            height={parseInt(height, 10) || 150}
            allowFullScreen={allowFullScreen ? '' : null}
            allowpaymentrequest={allowPaymentRequest ? '' : null}
            allowTransparency={allowTransparency ? '' : null}
            sandbox="allow-scripts allow-same-origin"
            resizable=""
          >
            <div className="lazy-iframe placeholder" />
          </amp-iframe>
        </Fragment>
      );
    }

    return (
      <Container styles={{ width, height }} className="iframe">
        {!loaded && <Placeholder>{placeholder}</Placeholder>}
        <LazyLoad
          elementType="span"
          offsetVertical={2000}
          offsetHorizontal={-10}
          throttle={50}
          onContentVisible={this.handleContentVisible}
        >
          <iframe
            title={title || ''}
            src={src}
            allowFullScreen={allowFullScreen ? true : null}
            allowpaymentrequest={allowPaymentRequest ? true : null}
            allowTransparency={allowTransparency ? true : null}
            {...rest}
            ref={node => {
              this.ref = node;
            }}
          />
        </LazyLoad>
      </Container>
    );
  }
}

LazyIframe.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  attributes: PropTypes.shape({}).isRequired,
  isAmp: PropTypes.bool.isRequired,
  placeholder: PropTypes.node,
};

LazyIframe.defaultProps = {
  placeholder: null,
};

export default inject(({ stores: { build } }) => ({
  isAmp: build.isAmp,
}))(LazyIframe);

const Container = styled.span`
  position: relative;
  display: block;
  height: ${({ styles }) => styles.height};
  width: ${({ styles }) => styles.width};

  & > .LazyLoad {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
`;

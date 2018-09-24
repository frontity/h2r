import styled from 'styled-components';

export default styled.span.attrs({
  className: 'h2r-lazy-placeholder',
})`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
// mock for next/link module to stop Warning: An update to ForwardRef inside a test was not wrapped in act(...).
const nextLinkMock = ({ children, href }) => (
  <children.type {...children.props} href={href} />
);

export default nextLinkMock;

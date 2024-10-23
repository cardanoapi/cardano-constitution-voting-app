/* eslint-disable @typescript-eslint/explicit-function-return-type */
// mock for next/image module to stop Warning: An update to Image inside a test was not wrapped in act(...)
// eslint-disable-next-line @next/next/no-img-element
const nextImageMock = ({ src, alt }) => <img src={src} alt={alt}></img>;

export default nextImageMock;

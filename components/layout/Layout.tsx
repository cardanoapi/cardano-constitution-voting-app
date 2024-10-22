import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

/**
 * Describes the Layout of the App UI. Renders app content with Sidebar
 * @returns Layout Component
 */
const Layout = (props: Props): JSX.Element => {
  const { children } = props;
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
};

export default Layout;

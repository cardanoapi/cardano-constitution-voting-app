import { Sidebar } from '@/components/layout/mobileSidebar';

interface Props {
  children: React.ReactNode;
}

/**
 * Describes the Layout of the App UI. Renders app content with Sidebar
 * @returns Layout Component
 */
export function Layout(props: Props): JSX.Element {
  const { children } = props;
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}

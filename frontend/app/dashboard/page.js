import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardClient />;
}

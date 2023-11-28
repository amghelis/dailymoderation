import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default MainLayout;

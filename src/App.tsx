import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import client from './graphql/client';
import MainLayout from './layout/MainLayout';
import ModerationPage from './pages/moderation/Moderation';
import ErrorPage from './pages/error/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ModerationPage />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </Provider>
  );
}

export default App;

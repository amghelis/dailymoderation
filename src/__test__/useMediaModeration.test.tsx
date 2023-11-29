import { test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { renderHook } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_NEXT_TASK } from '../graphql/queries';
import useMediaModeration from '../hooks/useMediaModeration';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { InMemoryCache } from '@apollo/client';

const mocks = [
  {
    request: {
      query: GET_NEXT_TASK,
    },
    result: {
      data: {
        moderation: {
          nextTask: {
            media: {
              category: '',
              channel: {
                id: '',
                name: '',
              },
              embedURL: '',
              id: 'test-id',
              thumbnailURL: '',
              url: '',
              description: '',
            },
          },
        },
      },
    },
  },
];

const cache = new InMemoryCache();

export const restHandlers = [
  http.get('', () => {
    return HttpResponse.json({
      title: 'Test',
    });
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

test('media state get updated when skipping', async () => {
  const { result } = renderHook(() => useMediaModeration(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <MockedProvider mocks={mocks} cache={cache} addTypename={false}>
          {children}
        </MockedProvider>
      </Provider>
    ),
  });

  const beforeSkipURL = result.current.media.url;

  result.current.skip();

  await vi.waitFor(() => {
    if (result.current.media.url == beforeSkipURL) {
      throw new Error('url is not updating');
    }
  });

  const afterSkipURL = result.current.media.url;

  expect(afterSkipURL).not.toBe(0);
});

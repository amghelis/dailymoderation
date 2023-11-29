/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import ModerationControls from '../components/controls/ModerationControls';
import { Provider } from 'react-redux';
import store from '../redux/store';

test('buttons are disabled when reason input is empty', async () => {
  const props = {
    skip: () => {},
    censor: () => {},
    validate: () => {},
  };

  const moderationControls = render(
    <Provider store={store}>
      <ModerationControls {...props} />
    </Provider>
  );

  const buttonsContainer = moderationControls.findByTestId('buttons-container');

  const buttons = (await buttonsContainer).querySelectorAll('button');

  buttons.forEach((button) => expect(button.disabled).toBeTruthy);

  moderationControls.unmount();
});

test('buttons are enabled when typing a reason', async () => {
  const props = {
    skip: () => {},
    censor: () => {},
    validate: () => {},
  };
  const moderationControls = render(
    <Provider store={store}>
      <ModerationControls {...props} />
    </Provider>
  );

  const reasonInput = (await moderationControls.findByTestId(
    'reason-input'
  )) as HTMLInputElement;

  const buttonsContainer =
    await moderationControls.findByTestId('buttons-container');

  fireEvent.change(reasonInput, { target: { value: 'test' } });

  const buttons = (await buttonsContainer).querySelectorAll('button');

  buttons.forEach((button) => expect(button.disabled).toBe(false));

  moderationControls.unmount();
});

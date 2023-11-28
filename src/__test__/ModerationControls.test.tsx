/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import ModerationControls from '../components/controls/ModerationControls';

test('buttons are disabled when reason input is empty', async () => {
  const _reason = '';
  const setReason = (_newReason: string) => {};
  const props = {
    skip: () => {},
    censor: () => {},
    validate: () => {},
  };
  const moderationControls = render(
    <ModerationControls
      {...props}
      status="idle"
      reason={_reason}
      setReason={setReason}
    />
  );

  const buttonsContainer = moderationControls.findByTestId('buttons-container');

  const buttons = (await buttonsContainer).querySelectorAll('button');

  buttons.forEach((button) => expect(button.disabled).toBeTruthy);

  moderationControls.unmount();
});

test('buttons are enabled when typing a reason', async () => {
  // TODO use RenderHook
  let reason = '';
  const setReason = (newReason: string) => (reason = newReason);
  const props = {
    skip: () => {},
    censor: () => {},
    validate: () => {},
  };
  const moderationControls = render(
    <ModerationControls
      {...props}
      status="idle"
      reason={reason}
      setReason={setReason}
    />
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

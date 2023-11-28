import { ActionFunction } from 'react-router-dom';

export const action: ActionFunction = async ({ request }) => {
  // API censor logic
  console.log(request);
};

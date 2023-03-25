import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  res.status(200).json({ name: 'Hello, world!' });
};

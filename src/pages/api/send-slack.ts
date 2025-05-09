import { verifySignature } from '@upstash/qstash/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('reqeust', req.body);
  const { webhookUrl, message } = req.body;

  if (!webhookUrl || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    // Check if the request was successful
    if (response.ok) {
      return res.status(200).json({ message: 'Message sent successfully' });
    } else {
      const error = await response.text();
      return res.status(response.status).json({
        message: 'Failed to send to Slack',
        error,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending message to Slack:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}
export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

import { Client } from '@upstash/qstash';
import { NextApiRequest, NextApiResponse } from 'next';

const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { webhookUrl, message, delayMs } = req.body as {
    webhookUrl: string;
    message: string;
    delayMs: number;
  };

  console.log(req.body);

  if (!webhookUrl || !message || !delayMs) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.VERCEL_URL ||
    req.headers.origin ||
    'http://localhost:3000';

  try {
    const delayInSeconds = Math.floor(delayMs / 1000);
    const response = await qstash.publishJSON({
      headers: { 'Upstash-Forward-bypass-tunnel-reminder': 'true' },
      url: `${baseUrl}/api/send-slack`,
      body: { webhookUrl, message },

      delay: delayInSeconds,
    });
    return res.status(200).json({
      message: 'Message scheduled successfully',
      messageId: response.messageId,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: 'Error scheduling message',
        error: error.message,
      });
    }
  }
}

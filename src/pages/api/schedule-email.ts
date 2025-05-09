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

  const { to, subject, message, schedule } = req.body as {
    to: string;
    subject: string;
    message: string;
    schedule: string;
  };

  if (!to || !subject || !message || !schedule) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const now = Date.now();
  const timestamp = new Date(schedule).getTime();

  if (isNaN(timestamp)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  if (timestamp < now) {
    return res
      .status(400)
      .json({ error: 'Schedule time must be in the future' });
  }

  const maxDelay = 7 * 24 * 60 * 60 * 1000;
  if (timestamp - now > maxDelay) {
    return res
      .status(400)
      .json({ error: 'Schedule must be within 7 days from now' });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.VERCEL_URL ||
    req.headers.origin ||
    'http://localhost:3000';

  try {
    const notBeforeSeconds = Math.floor(timestamp / 1000);
    await qstash.publishJSON({
      headers: { 'Upstash-Forward-bypass-tunnel-reminder': 'true' },
      url: `${baseUrl}/api/send-email`,
      body: { to, subject, message },
      notBefore: notBeforeSeconds,
      delay: Math.min(Math.floor((timestamp - now) / 1000), 604800),
    });

    res.status(201).json({ scheduled: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to schedule email', details: error });
  }
}

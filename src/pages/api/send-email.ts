import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from '@upstash/qstash/nextjs';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { to, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST,

      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM!,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    res.status(200).end('Email sent');
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).end('Error sending email');
  }
}

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

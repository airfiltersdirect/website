// Vitest: verify SMTP2GO transporter can authenticate with mail.smtp2go.com:587
import { describe, it, expect } from 'vitest';
import nodemailer from 'nodemailer';

describe('SMTP2GO credentials', () => {
  it('should verify the SMTP2GO transporter connection', async () => {
    const transporter = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP2GO_USER || 'afdform',
        pass: process.env.SMTP2GO_PASS || '',
      },
      tls: {
        rejectUnauthorized: false, // allow self-signed in test env
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
    });

    // verify() opens a connection and authenticates — throws if credentials are wrong
    const result = await transporter.verify();
    expect(result).toBe(true);
  }, 15000); // 15s timeout for network call
});

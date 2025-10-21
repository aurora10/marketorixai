import dotenv from 'dotenv';
dotenv.config();

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, message, honeypot, recaptchaToken } = await request.json();

  if (honeypot) {
    // This is a bot. Pretend to be successful but do nothing.
    return NextResponse.json({ message: 'Email sent successfully' });
  }

  // Verify reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  // Comprehensive security pattern to block SQL injection and other malicious inputs
  const securityPattern = /((SELECT|INSERT|UPDATE|DELETE|DROP|UNION|AND|OR|DBMS_PIPE|PG_SLEEP|CHR|CONCAT|CAST|EXEC))|[\;'"()|]/gi;

  if (securityPattern.test(name) || securityPattern.test(email) || securityPattern.test(message)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `New message from ${name} on Marketorix Site`,
    text: `You have received a new message from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
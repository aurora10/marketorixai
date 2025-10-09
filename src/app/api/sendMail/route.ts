import dotenv from 'dotenv';
dotenv.config();

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

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
    subject: `New message from new Marketorix Site ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
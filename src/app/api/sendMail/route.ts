// import dotenv from 'dotenv';
// dotenv.config();

// console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request: Request) {
//   const { name, email, message } = await request.json();




//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: email,
//     to: process.env.EMAIL_USER,
//     subject: `New message from ${name}`,
//     text: message,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return NextResponse.json({ message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }


import dotenv from 'dotenv';
dotenv.config();


import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,  // Use EMAIL_USER for the sender's address
    to: process.env.GMAIL_USER,     // Ensure this is a valid recipient email
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

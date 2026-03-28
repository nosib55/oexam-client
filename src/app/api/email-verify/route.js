import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get('email');
  if (!userEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Setup Transporter (This is YOUR sender email configuration)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your personal/business email (Sender)
        pass: process.env.EMAIL_PASS, // Your App Password
      },
    });

    // Define Email Content
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: userEmail, // Send the code to the email provided in the Alert box
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Verify Your Email</h2>
          <p>Please use the following code to verify your account:</p>
          <h1 style="color: #3b82f6; letter-spacing: 5px;">${verificationCode}</h1>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success and the code (You may want to save this code in a DB/Session)
    return NextResponse.json(
      { message: 'Code sent successfully!', code: verificationCode },
      { status: 200 },
    );
  } catch (error) {
    // Check your VS Code Terminal for this output
    console.error('DETAILED ERROR:', error);

    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}

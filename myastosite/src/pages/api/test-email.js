import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      EMAIL_USER_VALUE: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'NOT_SET',
      EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
    };

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();

    return new Response(JSON.stringify({
      success: true,
      message: 'Email configuration is working!',
      envCheck,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      errorCode: error.code,
      envCheck: {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        EMAIL_USER_VALUE: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'NOT_SET',
        EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
      },
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
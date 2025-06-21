import nodemailer from 'nodemailer';

export async function POST({ request }) {
  try {
    const { pseudonym, subject, message, privacyConsent } = await request.json();

    // Validate required fields
    if (!subject || !message) {
      return new Response(JSON.stringify({ error: 'Subject and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check privacy consent
    if (!privacyConsent) {
      return new Response(JSON.stringify({ error: 'Please confirm that you understand our privacy approach' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured - storing message in logs instead');
      
      // Log the message for debugging (in production, you might want to store in a database)
      console.log('=== NEW CONTACT FORM SUBMISSION ===');
      console.log('From:', pseudonym || 'Anonymous');
      console.log('Subject:', subject);
      console.log('Message:', message);
      console.log('Date:', new Date().toISOString());
      console.log('=====================================');
      
      return new Response(JSON.stringify({ 
        error: 'Email service is not configured. Your message has been logged but cannot be sent. Please contact the administrator or try again later.' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create transporter with more compatible Gmail configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return new Response(JSON.stringify({ 
        error: 'Email service configuration error. Please check credentials and try again.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'dial25.scaly@icloud.com',
      subject: `PalChat Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            New Contact Form Submission - PalChat
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Message Details:</h3>
            
            <p><strong>From:</strong> ${pseudonym || 'Anonymous'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Privacy Consent:</strong> ${privacyConsent ? 'Yes' : 'No'}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9; color: #666; font-size: 14px;">
            <p>This message was sent from the PalChat contact form.</p>
            <p>Sent at: ${new Date().toISOString()}</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Your message has been sent successfully! We\'ll respond while respecting your privacy.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your Gmail app password and 2FA settings.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Email service connection failed. Please try again later.';
    } else if (error.message && error.message.includes('Invalid login')) {
      errorMessage = 'Invalid Gmail credentials. Please check your email and app password.';
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
import nodemailer from 'nodemailer';
import { sanitizeHtml, validateInput, RateLimiter, inputLimits } from '../../utils/security.js';

// Initialize rate limiter
const rateLimiter = new RateLimiter(5, 60000); // 5 requests per minute

// Clean up rate limiter periodically
setInterval(() => {
  rateLimiter.cleanup();
}, 60000);

export async function POST({ request }) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limit
    if (!rateLimiter.check(clientIP)) {
      return new Response(JSON.stringify({ 
        error: 'Too many requests. Please wait a minute before trying again.' 
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      });
    }

    const { pseudonym, subject, message, privacyConsent } = await request.json();

    // Validate and sanitize inputs using security utilities
    let sanitizedPseudonym, sanitizedSubject, sanitizedMessage;
    
    try {
      sanitizedPseudonym = validateInput(pseudonym || '', inputLimits.pseudonym);
      sanitizedSubject = validateInput(subject || '', inputLimits.subject);
      sanitizedMessage = validateInput(message || '', inputLimits.message);
    } catch (validationError) {
      return new Response(JSON.stringify({ 
        error: validationError.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    if (!sanitizedSubject || !sanitizedMessage) {
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
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Email service not configured - environment variables missing');
        console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
        console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
        console.log('EMAIL_USER length:', process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
      }
      
      // Log the message for debugging (in production, you might want to store in a database)
      if (process.env.NODE_ENV === 'development') {
        console.log('=== NEW CONTACT FORM SUBMISSION (EMAIL NOT CONFIGURED) ===');
        console.log('From:', sanitizedPseudonym || 'Anonymous');
        console.log('Subject:', sanitizedSubject);
        console.log('Message:', sanitizedMessage);
        console.log('Date:', new Date().toISOString());
        console.log('=====================================');
      }
      
      return new Response(JSON.stringify({ 
        error: 'Email service is not configured. Please contact the administrator or try again later.' 
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
      if (process.env.NODE_ENV === 'development') {
        console.log('SMTP connection verified successfully');
      }
    } catch (verifyError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('SMTP verification failed:', verifyError);
      }
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
      subject: `PalChat Contact: ${sanitizedSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            New Contact Form Submission - PalChat
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Message Details:</h3>
            
            <p><strong>From:</strong> ${sanitizedPseudonym || 'Anonymous'}</p>
            <p><strong>Subject:</strong> ${sanitizedSubject}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Privacy Consent:</strong> ${privacyConsent ? 'Yes' : 'No'}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9; color: #666; font-size: 14px;">
            <p>This message was sent from the PalChat contact form.</p>
            <p>Sent at: ${new Date().toISOString()}</p>
          </div>
        </div>
      `
    };

    // Send email
    let emailResult;
    try {
      emailResult = await transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV === 'development') {
        console.log('Email sent successfully:', emailResult.messageId);
      }
    } catch (emailError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Email sending failed:', emailError);
      }
      throw emailError; // Re-throw to be caught by outer catch block
    }

    // Return success response only if email was actually sent
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Your message has been sent successfully! We\'ll respond while respecting your privacy.',
      messageId: emailResult.messageId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error);
    }
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send message. Please try again later.';
    let statusCode = 500;
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your Gmail app password and 2FA settings.';
      statusCode = 500;
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Email service connection failed. Please try again later.';
      statusCode = 503;
    } else if (error.message && error.message.includes('Invalid login')) {
      errorMessage = 'Invalid Gmail credentials. Please check your email and app password.';
      statusCode = 500;
    } else if (error.message && error.message.includes('Missing credentials')) {
      errorMessage = 'Email service is not properly configured. Please contact the administrator.';
      statusCode = 503;
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
      statusCode = 500;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
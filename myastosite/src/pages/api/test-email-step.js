import nodemailer from 'nodemailer';

export async function GET() {
  const steps = [];
  
  try {
    // Step 1: Check environment variables
    steps.push({
      step: 1,
      name: 'Environment Variables Check',
      status: 'checking',
      details: {}
    });
    
    const hasEmailUser = !!process.env.EMAIL_USER;
    const hasEmailPass = !!process.env.EMAIL_PASS;
    
    steps[0].status = hasEmailUser && hasEmailPass ? 'passed' : 'failed';
    steps[0].details = {
      EMAIL_USER_EXISTS: hasEmailUser,
      EMAIL_PASS_EXISTS: hasEmailPass,
      EMAIL_USER_PREVIEW: hasEmailUser ? `${process.env.EMAIL_USER.substring(0, 3)}***@${process.env.EMAIL_USER.split('@')[1] || 'unknown'}` : 'NOT_SET',
      EMAIL_PASS_LENGTH: hasEmailPass ? process.env.EMAIL_PASS.length : 0
    };
    
    if (!hasEmailUser || !hasEmailPass) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Environment variables not configured',
        steps: steps
      }, null, 2), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Step 2: Create transporter
    steps.push({
      step: 2,
      name: 'Create Email Transporter',
      status: 'checking',
      details: {}
    });
    
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
    
    steps[1].status = 'passed';
    steps[1].details = { message: 'Transporter created successfully' };
    
    // Step 3: Verify connection
    steps.push({
      step: 3,
      name: 'Verify SMTP Connection',
      status: 'checking',
      details: {}
    });
    
    try {
      await transporter.verify();
      steps[2].status = 'passed';
      steps[2].details = { message: 'SMTP connection verified successfully' };
    } catch (verifyError) {
      steps[2].status = 'failed';
      steps[2].details = { 
        error: verifyError.message,
        code: verifyError.code,
        suggestion: verifyError.code === 'EAUTH' ? 'Check Gmail app password and 2FA settings' : 'Check network connection'
      };
      
      return new Response(JSON.stringify({
        success: false,
        message: 'SMTP verification failed',
        steps: steps
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Step 4: Test email send
    steps.push({
      step: 4,
      name: 'Test Email Send',
      status: 'checking',
      details: {}
    });
    
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: 'dial25.scaly@icloud.com',
      subject: 'PalChat Test Email - ' + new Date().toISOString(),
      text: 'This is a test email from PalChat contact form.',
      html: '<h1>Test Email</h1><p>This is a test email from PalChat contact form.</p><p>Sent at: ' + new Date().toISOString() + '</p>'
    };
    
    try {
      const result = await transporter.sendMail(testEmail);
      steps[3].status = 'passed';
      steps[3].details = { 
        message: 'Test email sent successfully',
        messageId: result.messageId
      };
    } catch (sendError) {
      steps[3].status = 'failed';
      steps[3].details = { 
        error: sendError.message,
        code: sendError.code
      };
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Email sending failed',
        steps: steps
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // All steps passed
    return new Response(JSON.stringify({
      success: true,
      message: 'Email configuration is working perfectly!',
      steps: steps
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    steps.push({
      step: steps.length + 1,
      name: 'Unexpected Error',
      status: 'failed',
      details: { error: error.message }
    });
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Unexpected error occurred',
      steps: steps
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
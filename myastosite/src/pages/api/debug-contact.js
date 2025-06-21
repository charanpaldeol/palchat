export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      EMAIL_USER_EXISTS: !!process.env.EMAIL_USER,
      EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
      EMAIL_USER_PREVIEW: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***@${process.env.EMAIL_USER.split('@')[1] || 'unknown'}` : 'NOT_SET',
      EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
      NODE_ENV: process.env.NODE_ENV || 'not_set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not_set'
    };

    // Test nodemailer import
    let nodemailerStatus = 'not_imported';
    try {
      const nodemailer = await import('nodemailer');
      nodemailerStatus = 'imported_successfully';
    } catch (error) {
      nodemailerStatus = `import_failed: ${error.message}`;
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Debug information for contact form',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      nodemailer: nodemailerStatus,
      deployment: {
        platform: 'vercel',
        environment: process.env.VERCEL_ENV || 'unknown'
      }
    }, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
} 
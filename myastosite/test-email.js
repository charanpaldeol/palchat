import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailConfig() {
  console.log('🔍 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n❌ Missing environment variables. Please set EMAIL_USER and EMAIL_PASS.');
    return;
  }
  
  console.log(`\n📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`🔑 Password length: ${process.env.EMAIL_PASS.length} characters`);
  
  // Create transporter
  console.log('\n🔧 Creating transporter...');
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
  console.log('🔌 Testing SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Test sending email
    console.log('\n📤 Testing email send...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: 'dial25.scaly@icloud.com',
      subject: 'PalChat Test Email',
      text: 'This is a test email from PalChat contact form.',
      html: '<h1>Test Email</h1><p>This is a test email from PalChat contact form.</p>'
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('🔍 Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Error - Possible solutions:');
      console.log('1. Check if 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Verify you\'re using an App Password, not your regular password');
      console.log('3. Make sure the App Password was generated for "Mail"');
      console.log('4. Try generating a new App Password');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Gmail SMTP might be temporarily unavailable');
      console.log('3. Try again in a few minutes');
    }
  }
}

// Run the test
testEmailConfig().catch(console.error); 
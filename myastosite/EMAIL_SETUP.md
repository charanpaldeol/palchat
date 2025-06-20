# Email Setup for PalChat Contact Form

This guide explains how to set up email forwarding for the PalChat contact form to send emails to `dial25.scaly@icloud.com`.

## Prerequisites

1. A Gmail account (or other email service)
2. Gmail App Password (if using Gmail)
3. Vercel deployment (for environment variables)

## Setup Instructions

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the generated password

### 2. Environment Variables

Add these environment variables to your Vercel deployment:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Vercel Environment Variables Setup

1. Go to your Vercel dashboard
2. Select your PalChat project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password

### 4. Alternative Email Services

If you prefer not to use Gmail, you can modify the `src/pages/api/contact.js` file to use other email services:

#### Using Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

#### Using Custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## How It Works

1. Users fill out the contact form on the website
2. Form data is sent to `/api/contact` endpoint
3. The API creates a formatted email with the user's message
4. Email is sent to `dial25.scaly@icloud.com`
5. User receives confirmation message

## Email Format

The forwarded emails include:
- **Subject**: "PalChat Contact: [User's Subject]"
- **From**: Your configured email address
- **To**: dial25.scaly@icloud.com
- **Content**: Formatted HTML email with user's message and metadata

## Testing

1. Deploy the changes to Vercel
2. Fill out the contact form on your website
3. Check if the email is received at `dial25.scaly@icloud.com`
4. Verify the email format and content

## Troubleshooting

### Common Issues:

1. **"Failed to send message" error**:
   - Check if environment variables are set correctly
   - Verify Gmail app password is correct
   - Ensure 2FA is enabled on Gmail

2. **Emails not received**:
   - Check spam/junk folder
   - Verify the recipient email address
   - Check Vercel function logs for errors

3. **Authentication errors**:
   - Regenerate Gmail app password
   - Ensure using app password, not regular password

## Security Notes

- Never commit email credentials to version control
- Use environment variables for sensitive data
- Consider rate limiting for the contact form
- Monitor for spam/abuse

## Support

If you encounter issues, check:
1. Vercel function logs
2. Email service provider settings
3. Environment variable configuration 
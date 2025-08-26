// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT!),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

// export const sendVerificationEmail = async (email: string, otp: string) => {
//   const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: email,
//     subject: 'CollabIDE - Email Verification',
//     html: `
//       <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
//         <h2 style="color: #2563eb;">Welcome to CollabIDE!</h2>
//         <p>Please verify your email address by entering this code:</p>
//         <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
//           <h1 style="color: #1f2937; letter-spacing: 4px; margin: 0;">${otp}</h1>
//         </div>
//         <p><strong>This code expires in 15 minutes.</strong></p>
//         <p>If you didn't request this verification, please ignore this email.</p>
//       </div>
//     `,
//   }
  
//   return await transporter.sendMail(mailOptions)
// }

// export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
//   const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: email,
//     subject: 'CollabIDE - Password Reset',
//     html: `
//       <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
//         <h2 style="color: #2563eb;">Password Reset Request</h2>
//         <p>You requested to reset your password. Click the link below to proceed:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
//         </div>
//         <p><strong>This link expires in 1 hour.</strong></p>
//         <p>If you didn't request this reset, please ignore this email.</p>
//       </div>
//     `,
//   }
  
//   return await transporter.sendMail(mailOptions)
// }



import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add these options for better debugging
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development',
})

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify()
    console.log('Email transporter is ready')
  } catch (error) {
    console.error('Email transporter verification failed:', error)
  }
}

// Call verification only in development
if (process.env.NODE_ENV === 'development') {
  verifyTransporter()
}

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration missing, skipping email send in development')
      console.log(`Verification OTP for ${email}: ${otp}`)
      return { messageId: 'dev-mode' }
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'CollabIDE - Email Verification',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Welcome to CollabIDE!</h2>
          <p>Please verify your email address by entering this code:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1f2937; letter-spacing: 4px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This code expires in 15 minutes.</strong></p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Email sending failed:', error)
    
    // In development, log the OTP instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode - Verification OTP for ${email}: ${otp}`)
      return { messageId: 'dev-mode-fallback' }
    }
    
    throw error
  }
}

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration missing, skipping password reset email in development')
      console.log(`Password reset URL for ${email}: ${resetUrl}`)
      return { messageId: 'dev-mode' }
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'CollabIDE - Password Reset',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p><strong>This link expires in 1 hour.</strong></p>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      `,
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Password reset email sending failed:', error)
    
    // In development, log the reset URL instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode - Password reset URL for ${email}: ${resetUrl}`)
      return { messageId: 'dev-mode-fallback' }
    }
    
    throw error
  }
}

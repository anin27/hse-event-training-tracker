const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendRegistrationConfirmation({ toEmail, employeeName, eventTitle, eventDate, location }) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBC';

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Registration Confirmed: ${eventTitle}`,
    text: `Hi ${employeeName},\n\nYou have been successfully registered for "${eventTitle}" on ${formattedDate} at ${location}.\n\n- HSE Training Tracker`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Registration Confirmed</h2>
        <p>Hi ${employeeName},</p>
        <p>You have been successfully registered for the following training:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px 0; color: #555;">Event:</td><td style="padding: 6px 0; font-weight: bold;">${eventTitle}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">Date:</td><td style="padding: 6px 0;">${formattedDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">Location:</td><td style="padding: 6px 0;">${location || 'TBC'}</td></tr>
        </table>
        <p style="color: #777; font-size: 13px;">HSE Training Tracker</p>
      </div>
    `
  };

  await sgMail.send(msg);
}

async function sendEventCancellationEmail({ toEmail, employeeName, eventTitle, eventDate }) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBC';

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Training Cancelled: ${eventTitle}`,
    text: `Hi ${employeeName},\n\nWe're writing to let you know that "${eventTitle}" scheduled for ${formattedDate} has been cancelled. Your registration has been removed. Please check the training tracker for alternative sessions.\n\n- HSE Training Tracker`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #A32D2D;">Training cancelled</h2>
        <p>Hi ${employeeName},</p>
        <p>The following training has been cancelled and your registration has been removed:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px 0; color: #555;">Event:</td><td style="padding: 6px 0; font-weight: bold;">${eventTitle}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">Original date:</td><td style="padding: 6px 0;">${formattedDate}</td></tr>
        </table>
        <p>Please check the training tracker for alternative sessions.</p>
        <p style="color: #777; font-size: 13px;">HSE Training Tracker</p>
      </div>
    `
  };

  await sgMail.send(msg);
}

module.exports = { sendRegistrationConfirmation, sendEventCancellationEmail };
// Stub d'envoi d'email (console). Remplace par nodemailer/mailgun/SES selon besoin.
module.exports = async ({ to, subject, text, html }) => {
  console.log('📧 [FAKE MAIL] to:', to);
  console.log('subject:', subject);
  console.log('text:', text);
  if (html) console.log('html:', html);
  return true;
};

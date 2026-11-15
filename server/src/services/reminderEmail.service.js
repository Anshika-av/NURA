const nodemailer = require('nodemailer');

const createReminderEmailSender = (
  env = process.env,
  createTransport = nodemailer.createTransport
) => {
  const host = env.SMTP_HOST?.trim();
  const from = env.SMTP_FROM?.trim();
  const username = env.SMTP_USER?.trim();
  const password = env.SMTP_PASSWORD;
  const hasSettings = Boolean(host || from || username || password);

  if (!hasSettings) {
    return null;
  }

  if (!host || !from) {
    throw new Error('SMTP_HOST and SMTP_FROM are required for reminder delivery');
  }

  if (Boolean(username) !== Boolean(password)) {
    throw new Error('SMTP_USER and SMTP_PASSWORD must be configured together');
  }

  const port = env.SMTP_PORT ? Number(env.SMTP_PORT) : 587;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid port number');
  }

  const secureSetting = env.SMTP_SECURE?.trim().toLowerCase();
  if (secureSetting && !['true', 'false'].includes(secureSetting)) {
    throw new Error('SMTP_SECURE must be true or false');
  }

  const appUrl = env.APP_URL?.trim();
  if (appUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(appUrl);
    } catch {
      throw new Error('APP_URL must be a valid HTTP or HTTPS URL');
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('APP_URL must be a valid HTTP or HTTPS URL');
    }
  }

  const transport = createTransport({
    host,
    port,
    secure: secureSetting ? secureSetting === 'true' : port === 465,
    requireTLS: Boolean(username) && (secureSetting ? secureSetting !== 'true' : port !== 465),
    ...(username && { auth: { user: username, pass: password } }),
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
  });

  return ({ to }) => transport.sendMail({
    from,
    to,
    subject: 'A reminder from Nura',
    text: [
      'A reminder you scheduled in Nura is due. Sign in to view it.',
      appUrl,
      'If you no longer want these messages, update or cancel the reminder in your account.',
    ].filter(Boolean).join('\n\n'),
  });
};

module.exports = {
  createReminderEmailSender,
};

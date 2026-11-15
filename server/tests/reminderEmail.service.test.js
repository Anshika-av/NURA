const {
  createReminderEmailSender,
} = require('../src/services/reminderEmail.service');

describe('Reminder email configuration and content', () => {
  test('does not enable delivery when SMTP is not configured', () => {
    expect(createReminderEmailSender({
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      APP_URL: 'http://localhost:5173',
    })).toBeNull();
  });

  test('rejects partial SMTP configuration', () => {
    expect(() => createReminderEmailSender({
      SMTP_HOST: 'smtp.example.com',
    })).toThrow('SMTP_HOST and SMTP_FROM are required');
  });

  test('sends a generic reminder message without sensitive reminder details', async () => {
    const sendMail = jest.fn().mockResolvedValue({});
    const createTransport = jest.fn().mockReturnValue({ sendMail });
    const sendEmail = createReminderEmailSender({
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: 'smtp-user',
      SMTP_PASSWORD: 'smtp-password',
      SMTP_FROM: 'Nura <reminders@example.com>',
      APP_URL: 'https://nura.example.com',
    }, createTransport);

    await sendEmail({ to: 'person@example.com' });

    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: { user: 'smtp-user', pass: 'smtp-password' },
    }));
    expect(sendMail).toHaveBeenCalledWith({
      from: 'Nura <reminders@example.com>',
      to: 'person@example.com',
      subject: 'A reminder from Nura',
      text: expect.stringContaining('https://nura.example.com'),
    });
    expect(sendMail.mock.calls[0][0].text).not.toContain('period');
  });
});

import mailer from 'nodemailer';

const transporter = mailer.createTransport({
  host: `${process.env.SMTP_HOST}`,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: `${process.env.SMTP_USER}`,
    pass: `${process.env.SMTP_PASS}`
  }
});

export default transporter;
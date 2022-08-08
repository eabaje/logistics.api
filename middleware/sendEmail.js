const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const handlebars = require('handlebars');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require('fs');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
  };

  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions));

  const msg = {
    from: `${process.env.STMP_FROM_NAME} < ${process.env.STMP_FROM_EMAIL}>`,
    to: options.toEmail,
    template: options.template, // the name of the template file i.e email.handlebars
    context: options.msg,
    subject: options.subject,
    attachments: options.filename
      ? [
          {
            filename: options.filename, // <= Here: made sure file name match  __dirname,
            path: path.resolve(`./uploads/docs/${options.filename}`), // <= Here
            contentType: 'application/pdf',
          },
        ]
      : null,
  };

  // transporter.sendMail(msg);
  transporter.sendMail(msg, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent successfully: ' + info.response);
    }
  });
};

const sendEmailMailGun = async (options) => {
  const mailgunAuth = {
    auth: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMIAN,
    },
  };

  const emailTemplateSource = fs.readFileSync(path.resolve(`./views/${options.template}`), 'utf8');
  const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
  const template = handlebars.compile(emailTemplateSource);

  const htmlToSend = template(options.msg);

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.toEmail,
    subject: options.subject,
    html: htmlToSend,
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Successfully sent email.');
    }
  });
};

const mailFunc = {
  sendEmail: sendEmail,
  sendEmailMailGun: sendEmailMailGun,
};
module.exports = mailFunc;

const i18n = require("i18n");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const createError = require("../error-handler").createError;

const templates = {
  DEFAULT: "default",
  WELCOME: "welcome",
};

const getPlaceHolders = (templateType, templateOptions) => {
  let placeHolders = {
    subject: i18n.__(`mailing.views.${templateType}.subject`),
  };
  switch (templateType) {
    case templates.WELCOME:
      placeHolders = {
        ...placeHolders,
        headContent: i18n.__(`mailing.views.${templateType}.head_content`),
        bodyContent: i18n.__(
          `mailing.views.${templateType}.body_content`,
          `${process.env.MAILING_CONFIRM_EMAIL_URL}/auth/confirm-user?token=${templateOptions[templateType].token}`,
        ),
        contactContent: i18n.__(
          `mailing.views.${templateType}.contact_content`,
        ),
        goodbyeContent: i18n.__(
          `mailing.views.${templateType}.goodbye_content`,
        ),
        ...templateOptions[templateType],
      };
      break;
    default:
      placeHolders = {
        subject: i18n.__(`mailing.views.${templateType}.subject`),
        message: i18n.__(`mailing.views.${templateType}.message`),
      };
      break;
  }
  return placeHolders;
};

const send = async (emailData, templateType = "default") => {
  const templatePath = path.join(__dirname, "views", `${templateType}.ejs`);
  const template = fs.readFileSync(templatePath, "utf8");
  const templateOptions = getPlaceHolders(templateType, {
    welcome: { token: emailData.token },
  });
  const html = ejs.render(template, templateOptions);
  const mailOptions = {
    from: `${process.env.MAILING_MAIL_FROM} <${process.env.MAILING_USER}>`,
    // NOTE: At the moment you need to do this like this to test locally
    to: "oswald.hickle52@ethereal.email" || emailData.to,
    subject: i18n.__(`mailing.views.${templateType}.subject`),
    html: html,
  };
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILING_SERVICE,
      port: parseInt(process.env.MAILING_PORT, 10),
      auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASSWORD,
      },
      secure: false,
      // debug: true,
    });
    const sent = await transporter.sendMail(mailOptions);
    transporter.close();
    return sent;
  } catch (err) {
    return createError(500, err.name, {
      message: err.message,
      code: err.code ? err.code : null,
      email: mailOptions.to,
    });
  }
};

module.exports = {
  send,
  templates: templates,
};

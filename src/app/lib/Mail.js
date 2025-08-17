
import nodemailer from 'nodemailer'
import { htmlToText } from "html-to-text";

export const sendResponse = async (email, content) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const plainText = htmlToText(content, {
    wordwrap: 130,
    selectors: [
      { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
      { selector: "b", format: "inline", options: { uppercase: false, leading: "**", trailing: "**" } },
      { selector: "strong", format: "inline", options: { leading: "**", trailing: "**" } },
      { selector: "i", format: "inline", options: { leading: "*", trailing: "*" } },
    ],
  });


  const mailOptions = {
    from: `Authentication System <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Meeting Notes',
    text: plainText,
  }

  await transporter.sendMail(mailOptions)
}
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beroma78@gmail.com",
      pass: "vdibtdbobyanvuig",
    },
  });
  const info = await transporter.sendMail({
    from: '"bero👻" <beroma78@gmail.com>',
    to: to ? to : "",
    subject: subject ? subject : "hi",
    html: html ? html : "hello",
  });
  if(info.accepted.length){
    return true
  }
  return false
};

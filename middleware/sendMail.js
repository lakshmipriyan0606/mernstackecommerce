import { createTransport } from "nodemailer";
const sendMail = async (email, subject, text) => {

    
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465, // const port number in smtp
    auth: {
      user: process.env.GMAIl,
      pass: process.env.PASSKEY,
    },
  });

  transport.sendMail({
    from: process.env.GMAIl,
    to: email,
    subject: subject,
    text: text,
  });
};

export default sendMail;

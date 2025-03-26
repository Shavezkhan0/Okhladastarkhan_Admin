import nodemailer from "nodemailer";

export default async function emailOTP(req, res) {
  const RandomOTP = Math.floor(Math.random() * 1000000);

  if (req.method === "POST") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: {
        name: "OkhalaDastarkhan",
        address: process.env.EMAIL_USER,
      },
      to: [`${req.body.email}`], // list of receivers
      subject: "Opt verification for your gmail", // Subject line
      text: `Your OPT verivifation code is ${RandomOTP}`, // plain text body
    };

    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);

        res.status(200).json({
          message: "OTP send successfully",
          success: true,
          otp: RandomOTP,
        });
      } catch (error) {
        console.error("Error sending email:", error);
        res
          .status(500)
          .json({ error: "Error sending email", details: error.message });
      }
    };

    sendMail(transporter, mailOptions);
  } else {
    res.status(400).json({ error: "This method is not permitted" });
  }
}

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // ya SMTP details
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendOrderEmail({ sellerEmail, sellerName, buyerName, buyerEmail, productTitle }) {
  if (!sellerEmail) return;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: sellerEmail,
    subject: `Someone wants to buy your product: ${productTitle}`,
    text: `
Hi ${sellerName || "Seller"},

Good news! A student is interested in buying your product on ApnaCollegeOLX.

Product: ${productTitle}

Buyer details:
Name: ${buyerName}
Email: ${buyerEmail}

Please contact the buyer to discuss payment and delivery details.

Regards,
AnaCollegeOLX
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order email sent to", sellerEmail);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
}

module.exports = { sendOrderEmail };

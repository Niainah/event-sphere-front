import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { full_name, email, cin, occupation } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Bienvenue chez EventSphere',
      html: `
        <h1>Bonjour ${full_name},</h1>
        <p>Merci de vous être inscrit sur EventSphere.</p>
        <p>Vos informations :</p>
        <ul>
          <li><strong>CIN :</strong> ${cin}</li>
          <li><strong>Occupation :</strong> ${occupation}</li>
        </ul>
        <p>À bientôt !</p>
      `,
    });

    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ message: 'Erreur envoi email', error });
  }
}

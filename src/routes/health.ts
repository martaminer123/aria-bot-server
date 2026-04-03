import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/health", (_req, res) => {
  res.status(200).send("Aria is running");
});

router.get("/privacy", (_req, res) => {
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy – Aria</title>
  <style>
    body { font-family: Georgia, serif; max-width: 720px; margin: 60px auto; padding: 0 24px; color: #222; line-height: 1.7; }
    h1 { font-size: 2rem; margin-bottom: 4px; }
    h2 { font-size: 1.2rem; margin-top: 2rem; }
    p, li { font-size: 1rem; }
    ul { padding-left: 1.4rem; }
    .updated { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    a { color: #444; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p class="updated">Last updated: March 30, 2026</p>

  <p>This privacy policy explains how Aria, a personal WhatsApp assistant operated by <strong>Love Beauty Power by Marta</strong>, handles your information.</p>

  <h2>1. What Data We Collect</h2>
  <p>When you interact with Aria via WhatsApp, we may collect:</p>
  <ul>
    <li>Your WhatsApp phone number</li>
    <li>The content of messages you send to Aria</li>
    <li>Message timestamps and delivery metadata provided by WhatsApp</li>
  </ul>

  <h2>2. How We Use Your Data</h2>
  <p>The information collected is used solely to:</p>
  <ul>
    <li>Provide and operate the Aria assistant service</li>
    <li>Respond to your messages and fulfill your requests</li>
    <li>Improve the quality and relevance of Aria's responses</li>
  </ul>
  <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

  <h2>3. Data Retention</h2>
  <p>Message data is retained only as long as necessary to provide the service. You may request deletion of your data at any time by contacting us.</p>

  <h2>4. Third-Party Services</h2>
  <p>Aria is built on the WhatsApp Business Platform by Meta. Messages sent through WhatsApp are subject to <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank">WhatsApp's Privacy Policy</a> in addition to this policy.</p>

  <h2>5. Contact Us</h2>
  <p>If you have any questions or concerns about this privacy policy or your data, please reach out to us:</p>
  <p>
    <strong>Love Beauty Power by Marta</strong><br />
    Email: <a href="mailto:hello@lovebeautypowerbymarta.com">hello@lovebeautypowerbymarta.com</a>
  </p>
</body>
</html>`);
});

export default router;

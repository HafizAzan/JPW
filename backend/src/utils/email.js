import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function createTransport() {
  if (!env.smtp.host || !env.smtp.user) return null;

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

export async function sendEmail({ to, subject, html }) {
  const transport = createTransport();

  if (!transport) {
    console.log("[email:dev]", { to, subject, html });
    return { delivered: false, preview: true };
  }

  await transport.sendMail({ from: env.smtp.from, to, subject, html });
  return { delivered: true };
}

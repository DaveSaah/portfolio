import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
export const prerender = false;

import { contactFormSchema as ContactFormSchema } from '@/features/contact/type'; // Using alias for clarity if needed, or direct import
import { ui, type LanguageCode } from '@/i18n/ui';
import type {
  ContactFormTranslations,
  ContactFormApiResponse,
} from '@/features/contact/type';

const API_KEY = import.meta.env.API_KEY;
const TO_EMAIL = import.meta.env.TO_EMAIL;

export const POST: APIRoute = async ({ request }) => {
  let lang: LanguageCode = 'en'; // Default language
  let currentTranslations: ContactFormTranslations = ui[lang]
    .contactPage as ContactFormTranslations; // Default translations

  let formDataForValidation;
  try {
    const requestBody = await request.json();
    const requestLang = requestBody.lang as LanguageCode | undefined;
    if (requestLang && ui[requestLang]) {
      lang = requestLang;
      currentTranslations = ui[lang].contactPage as ContactFormTranslations;
    }
    // Separate formData for Zod validation (without lang property)
    const { lang: _lang, ...restOfBody } = requestBody;
    formDataForValidation = restOfBody;
  } catch (error) {
    // Use default (English) translations if JSON parsing fails or lang is not available
    const errorResponse: ContactFormApiResponse = {
      status: 'error',
      message: currentTranslations.toastErrorUnexpected,
      error: 'Invalid JSON input',
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validationResult = ContactFormSchema.safeParse(formDataForValidation);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: currentTranslations.toastErrorValidationFailed,
        errors: validationResult.error.flatten().fieldErrors,
      } as ContactFormApiResponse),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { firstName, lastName, email, subject, message } =
    validationResult.data;

  // Create transporter using Gmail and app password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: TO_EMAIL,
      pass: API_KEY,
    },
  });

  // Email options
  const mailOptions = {
    from: `"David Saah" <${TO_EMAIL}>`,
    to: email,
    subject: `${firstName} ${lastName}: ${subject}`,
    text: `You are receiving a copy of the message sent to David Saah <${TO_EMAIL}>

${message}
`,
  };

  // Send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });

  return new Response(
    JSON.stringify({
      status: 'success',
      message: `${currentTranslations.toastSuccessMessageSent}`,
    } as ContactFormApiResponse),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

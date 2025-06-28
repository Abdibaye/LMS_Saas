import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { Resend } from 'resend';
import { admin } from "better-auth/plugins"
const resend = new Resend(env.RESEND_API_KEY);

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: { 
        github: { 
           clientId: env.GITHUB_CLIENT_ID, 
           clientSecret: env.GITHUB_CLIENT_SECRET, 
        }, 
    }, 
    plugins: [
        emailOTP({ 
                async sendVerificationOTP({ email, otp, type}) { 
                    // Implement the sendVerificationOTP method to send the OTP to the user's email address
                     await resend.emails.send({
                        from: 'mls <onboarding@resend.dev>',
                        to: [email],
                        subject: 'MLS - Email Verification',
                        html: `<p>Your verification code is <strong>${otp}</strong>.</p>`,
                    });
                  }, 
        }),
        admin()
]

});  
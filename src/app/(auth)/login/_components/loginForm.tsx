"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/auth'
import { authClient } from '@/lib/auth.client'
import { error } from 'console'
import { GithubIcon, MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { set } from 'zod'

function LoginForm() {
    const router = useRouter();
     const [githubtransition, setGithubTransition] = useTransition();
     const [emailPending, setEmailTransition] = useTransition();
     const [email, setEmail] = useState("");
    
       async function handleGithubLogin() {
        setGithubTransition(async () => {
            await authClient.signIn.social({
          provider: 'github',
          callbackURL: '/',
          fetchOptions: {
            onSuccess: () => {
                toast.success("signed with github successfully")
            },
            onError: (error) => {
                toast.error("internal server error")    }
          },
       })
        });
       }

       function handleEmailLogin() {
        setEmailTransition(async () => {
            if (!email) {
                toast.error("Please enter your email address");
                return;
            }
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in", // or "email-verification", "forget-password"
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Verification code sent to your email");
                        // Redirect to verification request page
                        router.push(`/varify-request?email=${email}`);
                                    },
                    onError: (error) => {
                        console.error("Error sending verification code:", error);
                        toast.error("Failed to send verification code. Please try again.");
                    }
                }
            })
        });}
  return (
    <Card>
        <CardHeader>
            <CardTitle>
                Wellcom to Login!
            </CardTitle>
            <CardDescription>
                Login using github or email account
            </CardDescription>
        </CardHeader>
        
        <CardContent className='flex flex-col gap-4'>
            <Button disabled={githubtransition} onClick={handleGithubLogin} className='w-full' variant='outline'>
                {
                githubtransition ? (
                    <span className='flex items-center gap-2'>
                        <GithubIcon className='animate-spin' />
                        Signing in with github...
                    </span>
                ) : (
                    <span className='flex items-center gap-2'>
                        <GithubIcon />
                        Sign in with Github
                    </span>
                )
                }
            </Button>

            <div className='relative text-center text-sm text-muted-foreground after:absolute after:top-1/2 after:left-0 after:w-full after:h-[1px] after:bg-muted-foreground/50 after:-translate-y-1/2'>
                <span className='relative z-10 bg-card px-2'>Or continue with</span>
            </div>

            <div className='grid gap-3'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='email'>email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} required  type="email" placeholder='abdi@gmail.com'/>
                </div>

                <Button onClick={handleEmailLogin} disabled = {emailPending} >
                    <MailIcon className='mr-2' />
                    {emailPending ? "Sending verification code..." : "Continue with email"}
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default LoginForm

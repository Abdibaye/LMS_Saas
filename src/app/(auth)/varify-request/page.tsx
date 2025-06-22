"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth.client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'


function Page() {
    const router = useRouter();
    const [otp, setOtp] = useState("")
    const [emailPending, startTranstion] = useTransition();
    const  params = useSearchParams();
    const email = params.get('email') as string | null;
    function handleVerify() {
        startTranstion(async () => {
            await authClient.signIn.emailOtp({
                email: email || "",
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account verified successfully");
                        router.push("/"); // Redirect to home page after successful verification
                    },
                    onError: (error) => {
                        toast.error("Failed to verify account. Please check your OTP and try again.");
                    }
                }
            });
        });
    }
  return (
    <Card>
        <CardHeader className='text-center'>
            <CardTitle>
                Verification Request Sent
            </CardTitle>
            <CardDescription>
                Please check your email for the verification link.
            </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center gap-4'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <InputOTP value={otp} onChange={(value) => setOtp(value)} maxLength={6} className='gap-2'>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} /> 
                </InputOTPGroup>
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} /> 
                </InputOTPGroup>
                </InputOTP>
                <p className='text-sm text-muted-foreground'>Enter 6 digit code sent to your email</p>
            </div>
            <Button onClick={handleVerify} disabled={emailPending} className='w-full'>Verify Account</Button>
        </CardContent>
    </Card> 
  )

}


export default Page

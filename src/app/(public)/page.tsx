"use client";
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/themeToggle'
import { authClient } from '@/lib/auth.client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


interface featuresProps {  title: string;
  description: string;
  icon: string; // You can use an icon library or image URL here
}
const features:featuresProps[] = [
  {
    title: "Interactive Learning",
    description: "Engage with interactive content that makes learning fun and effective.",
    icon: "🖥️",
  },
  {
    title: "Expert Instructors",
    description: "Learn from industry experts and experienced educators.",
    icon: "👨‍🏫",
  },

  {
    title: "Flexible Schedule",
    description: "Study at your own pace with courses available 24/7.",
    icon: "⏰",
  },
  {
    title: "Community Support",
    description: "Join a community of learners and get support from peers and instructors.",
    icon: "🤝",
  },
];

function page() {
  const router = useRouter();
   const { 
        data: session, 
    } = authClient.useSession() 

  async function handleLogout() {
    await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
      toast.success("Logged out successfully");
    },
  },
});}
 
  return (
    <>
    <section className='relative py-20'>
        <div className='container mx-auto flex flex-col items-center justify-center space-y-8'>
            <Badge variant="outline">The Future of Online Education</Badge>
             <h1 className='text-4xl md:text-6xl font-bold tracking-tight text-center'>Elevate your Learning Experiance</h1>
             <p className='max-w-[700px] text-center text-muted-foreground md:text-xl'>Discover a new way to learn with modern, interactive learning managment system. Access high-quality
                courses anytime, anywhere
             </p>
             <div className='flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-4 md:space-y-0'>
                <Link className={buttonVariants({
                    variant: 'default',
                    size: 'lg',
                })} href='/login'>Get Started</Link>
                <Link className={buttonVariants({
                    variant: 'outline',
                })} href='courses'>Explore Courses</Link>
             </div>
        </div>
    </section>
    <section className='grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-8 container mx-auto py-20'>
        {features.map((feature, index) => (
          <Card key={index} className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <CardTitle> {feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-muted-foreground'>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
    </section> 
    </>
  )
}

export default page

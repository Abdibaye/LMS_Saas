
import { auth } from '@/lib/auth';
import LoginForm from './_components/loginForm'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';


async function page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session) {
        // If the user is already logged in, redirect them to the home page
        return redirect('/');
    }
  return (
    <LoginForm />
  )
}

export default page

'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSignUp } from '@clerk/nextjs';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Signup() {

  const { isLoaded, setActive, signUp } = useSignUp()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("");

  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });

      setPendingVerification(true)

      setMessage("A verification code has been sent to your email. Please enter the code to complete sign-up.");

    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2))
      setError(error.errors[0].message)
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault()

    if (!isLoaded) {
      return;
    }

    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({ code })

      if (completeSignup.status !== "complete") {
        console.log(JSON.stringify(completeSignup, null, 2))
        setMessage("Verification incomplete. Please try again.");
      }

      if (completeSignup.status === "complete") {
        // console.log(JSON.stringify(completeSignup, null, 2))
        // setMessage("Sign-up completed successfully! Redirecting...");
        await setActive({ session: completeSignup.createdSessionId })
        router.push("/dashboard")
      }

    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      setError(err.errors[0].message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up for Todo Master</CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && ( // Here, we render the message if it exists
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">Sign Up</Button>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter verification code" required />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && ( // Render the message during verification
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">Verify Email</Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
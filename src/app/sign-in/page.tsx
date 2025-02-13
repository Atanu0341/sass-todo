'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSignIn } from '@clerk/nextjs';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function SignIn() {

    const { isLoaded, signIn, setActive } = useSignIn()

    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("") // New message state
    const [showPassword, setShowPassword] = useState(false)

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
            return null;
        }

        try {
            const result = await signIn.create({
                identifier: emailAddress, password
            })

            if (result.status === 'complete') {
                setMessage("Sign-in successful!") // Log success message
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                console.log(JSON.stringify(result, null, 2))
                setMessage("Sign-in incomplete. Check the logs.") // Log incomplete status
            }
        } catch (err: any) {
            console.log("Error", err.errors[0].message)
            setError(err.errors[0].message)
            setMessage("An error occurred during sign-in.") // Log error message
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Sign In to Todo Master
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2" >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {message && (
                            <Alert>
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="font-medium text-primary hover:underline" >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignIn

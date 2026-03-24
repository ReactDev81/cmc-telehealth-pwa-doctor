"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth/AuthForm"
import AuthLayout from "@/components/auth/AuthLayout"
import axios from "axios"

interface LoginFormData {
    email: string
    password: string
}

const LoginPage = () => {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setMounted(true)
    }, [])

    const fields = [
        {
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
            validation: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
            },
        },
        {
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "Enter your password",
            required: true,
            validation: {
                minLength: 6,
                message: "Password must be at least 6 characters",
            },
        },
    ]

    const handleLogin = async (data: LoginFormData) => {
        // Basic validation
        if (!data.email || !data.password) {
            setErrorMessage("Please fill in all fields")
            return
        }

        setLoading(true)
        setErrorMessage("")

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            if (response.data.success && response.data.token) {
                // Store token (consider using httpOnly cookies for better security)
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("user", JSON.stringify(response.data.data))

                // Store token in cookie for middleware access
                document.cookie = `token=${response.data.token}; path=/; max-age=604800; samesite=lax`

                // Redirect to dashboard based on role
                if (response.data.data.role === "doctor") {
                    router.push("/doctor/dashboard")
                } else {
                    router.push("/patient/dashboard")
                }
            } else {
                setErrorMessage(response.data.message || "Login failed")
            }
        } catch (error: any) {
            console.error("Login Error:", error)

            if (error.response) {
                // The request was made and the server responded with a status code outside of 2xx
                setErrorMessage(error.response.data?.message || "Server error occurred")
            } else if (error.request) {
                // The request was made but no response was received
                setErrorMessage(
                    "No response from server. Please check your internet connection."
                )
            } else {
                // Something happened in setting up the request
                setErrorMessage("An error occurred. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout title="" subtitle="">
            <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                    {mounted && (
                        <Image
                            src="/assets/icon/logo-light.png"
                            alt="Company Logo"
                            width={120}
                            height={40}
                            priority
                            className="h-16 w-auto"
                            onError={() => setImageError(true)}
                            unoptimized
                        />
                    )}
                </div>

                {imageError && (
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
                            <span className="text-2xl font-bold text-primary-foreground">
                                A
                            </span>
                        </div>
                    </div>
                )}

                <p className="text-sm text-muted-foreground">
                    Sign in to your account to continue
                </p>

                {errorMessage && (
                    <div className="mt-3 rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                )}
            </div>

            <AuthForm
                fields={fields}
                buttonText={loading ? "Signing In..." : "Sign In"}
                onSubmit={handleLogin}
                showForgotPassword={true}
                alternateLink={{
                    text: "Don't have an account?",
                    href: "/register",
                    linkText: "Sign up",
                }}
            />
        </AuthLayout>
    )
}

export default LoginPage
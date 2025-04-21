// MemberForm.js
import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; // Assuming firebase.js is one directory up

export default function MemberForm({ setUsername, setSignedIn, onToggleForm }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }
        
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResetSent(false); // Reset password reset notification

        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Set the username from the user's displayName
            if (user.displayName) {
                setUsername(user.displayName);
            } else {
                // If displayName is not set, use email as a fallback
                setUsername(email.split('@')[0]);
            }
            
            // Set signed in state
            setSignedIn(true);
            
        } catch (error) {
            console.error("Error during sign in:", error);
            
            // Handle specific Firebase errors
            switch(error.code) {
                case 'auth/user-not-found':
                    setErrors({ form: "No account found with this email. Please sign up instead." });
                    break;
                case 'auth/wrong-password':
                    setErrors({ form: "Incorrect password. Please try again." });
                    break;
                case 'auth/invalid-email':
                    setErrors({ form: "Invalid email format" });
                    break;
                case 'auth/user-disabled':
                    setErrors({ form: "This account has been disabled" });
                    break;
                case 'auth/too-many-requests':
                    setErrors({ form: "Too many failed login attempts. Please try again later." });
                    break;
                default:
                    setErrors({ form: `An error occurred during sign in: ${error.message}` });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setErrors({}); // Clear any previous errors
        
        if (!email.trim()) {
            setErrors({ email: "Please enter your email to reset password" });
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }
        
        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
        } catch (error) {
            console.error("Error sending password reset:", error);
            
            switch(error.code) {
                case 'auth/user-not-found':
                    setErrors({ form: "No account found with this email" });
                    break;
                case 'auth/invalid-email':
                    setErrors({ form: "Invalid email format" });
                    break;
                default:
                    setErrors({ form: `Failed to send password reset: ${error.message}` });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {errors.form}
                </div>
            )}
            
            {resetSent && (
                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    Password reset email sent. Please check your inbox.
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Forgot your password?
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={onToggleForm}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Don't have an account? Sign up
                </button>
            </div>
        </form>
    );
}
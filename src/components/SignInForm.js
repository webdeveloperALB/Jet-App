// SignInForm.js
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // Assuming firebase.js is one directory up

export default function SignInForm({ setUsername, setSignedIn, onToggleForm }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validate full name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }
        
        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        // Validate password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        // Validate terms agreement
        if (!agreeToTerms) {
            newErrors.terms = "You must agree to the terms and conditions";
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Create new user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );
            
            const user = userCredential.user;
            
            // Update the user's profile with their full name
            await updateProfile(user, {
                displayName: formData.fullName
            });
            
            // Set username for UI
            setUsername(formData.fullName);
            
            // Set signed in state
            setSignedIn(true);
            
        } catch (error) {
            console.error("Error during sign up:", error);
            
            // Handle specific Firebase errors
            switch(error.code) {
                case 'auth/email-already-in-use':
                    setErrors({ form: "This email is already registered. Please sign in instead." });
                    break;
                case 'auth/invalid-email':
                    setErrors({ form: "Invalid email format" });
                    break;
                case 'auth/weak-password':
                    setErrors({ form: "Password is too weak. Please use at least 6 characters." });
                    break;
                default:
                    setErrors({ form: `Registration failed: ${error.message}` });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {errors.form}
                </div>
            )}

            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fullName ? "border-red-300" : "border-gray-300"
                    }`}
                />
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
            </div>

            <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    id="signup-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>
                <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirmPassword ? "border-red-300" : "border-gray-300"
                    }`}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
            </div>

            <div className="flex items-center">
                <input
                    id="agree-terms"
                    name="agreeTerms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <span className="text-blue-600">Terms and Conditions</span>
                </label>
            </div>
            {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={onToggleForm}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Already have an account? Sign in
                </button>
            </div>
        </form>
    );
}
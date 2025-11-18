import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Smartphone, ArrowLeft, Lock, Eye, EyeOff, Recycle } from 'lucide-react';
import { Logo } from './Logo';

interface LoginRegisterProps {
  onLogin: (phoneNumber: string, isAdmin: boolean) => void;
  onAdminResetPassword: () => void;
}

type AuthStep = 'phone' | 'otp' | 'password';
type ForgotPasswordStep = 'phone' | 'otp' | 'newPassword';

// Mock user database (in production, this would be in a backend)
const mockUsers: Record<string, { name: string; password: string }> = {};

export function LoginRegister({ onLogin, onAdminResetPassword }: LoginRegisterProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<AuthStep>('phone');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>('phone');
  
  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerOtp, setRegisterOtp] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Forgot password state
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  const [generatedOtp, setGeneratedOtp] = useState('');

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  };

  const handleSendOtp = (phone: string) => {
    if (phone.length === 10) {
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      
      // In a real app, you would send this OTP via SMS
      console.log('OTP sent:', otp);
      alert(`Demo OTP: ${otp}\n(In production, this would be sent via SMS)`);
    }
  };

  // LOGIN HANDLERS
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin login (phone: 1111111111, password: admin123)
    if (loginPhone === '1111111111' && loginPassword === 'admin123') {
      onLogin(loginPhone, true);
      return;
    }
    
    // Check if user exists and password matches
    const user = mockUsers[loginPhone];
    if (user && user.password === loginPassword) {
      onLogin(loginPhone, false);
    } else {
      alert('Invalid mobile number or password');
    }
  };

  // REGISTER HANDLERS
  const handleRegisterPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user already exists
    if (mockUsers[registerPhone]) {
      alert('This mobile number is already registered. Please login instead.');
      return;
    }
    
    handleSendOtp(registerPhone);
    setStep('otp');
  };

  const handleVerifyRegisterOtp = () => {
    if (registerOtp === generatedOtp) {
      setStep('password');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleRegisterPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Save user to mock database
    mockUsers[registerPhone] = {
      name: registerName,
      password: registerPassword
    };
    
    alert('Registration successful! You can now login.');
    
    // Switch to login tab and reset form
    setActiveTab('login');
    setStep('phone');
    setRegisterName('');
    setRegisterPhone('');
    setRegisterOtp('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setGeneratedOtp('');
  };

  // FORGOT PASSWORD HANDLERS
  const handleForgotPasswordPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists
    if (!mockUsers[forgotPhone]) {
      alert('This mobile number is not registered');
      return;
    }
    
    handleSendOtp(forgotPhone);
    setForgotPasswordStep('otp');
  };

  const handleVerifyForgotOtp = () => {
    if (forgotOtp === generatedOtp) {
      setForgotPasswordStep('newPassword');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotNewPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (forgotNewPassword !== forgotConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Update password
    mockUsers[forgotPhone].password = forgotNewPassword;
    
    alert('Password reset successful! You can now login with your new password.');
    
    // Reset forgot password flow
    setShowForgotPassword(false);
    setForgotPasswordStep('phone');
    setForgotPhone('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setGeneratedOtp('');
  };

  const handleResendOtp = () => {
    let phone = '';
    if (activeTab === 'register') {
      phone = registerPhone;
    } else if (showForgotPassword) {
      phone = forgotPhone;
    }
    handleSendOtp(phone);
  };

  const handleBack = () => {
    if (showForgotPassword) {
      if (forgotPasswordStep === 'phone') {
        setShowForgotPassword(false);
      } else if (forgotPasswordStep === 'otp') {
        setForgotPasswordStep('phone');
        setForgotOtp('');
      } else {
        setForgotPasswordStep('otp');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      }
    } else if (activeTab === 'register') {
      if (step === 'phone') {
        // Already at first step
      } else if (step === 'otp') {
        setStep('phone');
        setRegisterOtp('');
      } else {
        setStep('otp');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
      }
    }
    setGeneratedOtp('');
  };

  // FORGOT PASSWORD VIEW
  if (showForgotPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-600 p-4 rounded-full mb-4">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-green-600">ScrapCollect</h1>
            <p className="text-gray-600 text-center mt-2">
              Reset your password
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                {forgotPasswordStep === 'phone' && 'Enter your registered mobile number'}
                {forgotPasswordStep === 'otp' && 'Enter the OTP sent to your mobile'}
                {forgotPasswordStep === 'newPassword' && 'Set your new password'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forgotPasswordStep === 'phone' && (
                <form onSubmit={handleForgotPasswordPhoneSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-phone">Mobile Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="forgot-phone"
                        type="tel"
                        placeholder="9876543210"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(formatPhoneNumber(e.target.value))}
                        required
                        maxLength={10}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={forgotPhone.length !== 10}
                    >
                      Send OTP
                    </Button>
                  </div>
                </form>
              )}

              {forgotPasswordStep === 'otp' && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Number
                  </Button>
                  
                  <div className="space-y-2">
                    <Label>Enter OTP</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Sent to +91 {forgotPhone}
                    </p>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(value) => setForgotOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="link"
                      type="button"
                      onClick={handleResendOtp}
                      className="text-green-600"
                    >
                      Resend OTP
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={handleVerifyForgotOtp}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={forgotOtp.length !== 6}
                  >
                    Verify OTP
                  </Button>
                </div>
              )}

              {forgotPasswordStep === 'newPassword' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="forgot-new-password"
                        type={showForgotNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Minimum 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="forgot-confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="forgot-confirm-password"
                        type={showForgotConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Reset Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordStep('phone');
              }}
              className="text-green-600"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 p-3 rounded-2xl mb-4">
            <Logo size={48} className="text-white" />
          </div>
          <h1 className="text-green-600">Scrap Square</h1>
          <p className="text-gray-600 text-center mt-2">
            Smart Recycling Solutions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v as 'login' | 'register');
          setStep('phone');
          setRegisterOtp('');
          setRegisterPassword('');
          setRegisterConfirmPassword('');
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your mobile number and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone">Mobile Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-phone"
                        type="tel"
                        placeholder="9876543210"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(formatPhoneNumber(e.target.value))}
                        required
                        maxLength={10}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-green-600 h-auto p-0"
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loginPhone.length !== 10 || !loginPassword}
                  >
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  {step === 'phone' && 'Enter your details to get started'}
                  {step === 'otp' && 'Verify your mobile number'}
                  {step === 'password' && 'Set a secure password'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 'phone' && (
                  <form onSubmit={handleRegisterPhoneSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Mobile Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="9876543210"
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(formatPhoneNumber(e.target.value))}
                          required
                          maxLength={10}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        10-digit mobile number without country code
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!registerName || registerPhone.length !== 10}
                    >
                      Continue
                    </Button>
                  </form>
                )}

                {step === 'otp' && (
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      className="mb-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Change Number
                    </Button>
                    
                    <div className="space-y-2">
                      <Label>Enter OTP</Label>
                      <p className="text-sm text-gray-600 mb-3">
                        Sent to +91 {registerPhone}
                      </p>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={registerOtp}
                          onChange={(value) => setRegisterOtp(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        variant="link"
                        type="button"
                        onClick={handleResendOtp}
                        className="text-green-600"
                      >
                        Resend OTP
                      </Button>
                    </div>

                    <Button
                      type="button"
                      onClick={handleVerifyRegisterOtp}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={registerOtp.length !== 6}
                    >
                      Verify OTP
                    </Button>
                  </div>
                )}

                {step === 'password' && (
                  <form onSubmit={handleRegisterPasswordSubmit} className="space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      className="mb-2"
                      type="button"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Minimum 6 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="register-confirm-password"
                          type={showRegisterConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showRegisterConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Create Account
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 mb-1">
              <strong>Admin Login:</strong>
            </p>
            <p className="text-xs text-blue-600">
              Phone: 1111111111 | Password: admin123
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={onAdminResetPassword}
              className="text-blue-700 h-auto p-0 text-xs mt-1"
            >
              Admin: Reset Password
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
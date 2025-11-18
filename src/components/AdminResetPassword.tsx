import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Logo } from './Logo';
import { ArrowLeft, Lock, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminResetPasswordProps {
  onBack: () => void;
  onResetComplete: () => void;
}

export function AdminResetPassword({ onBack, onResetComplete }: AdminResetPasswordProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Admin phone number - only this admin can reset
  const ADMIN_PHONE = '9876543210';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate admin phone
    if (phone !== ADMIN_PHONE) {
      setError('Invalid admin phone number');
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log('Generated OTP for admin:', otp); // In production, this would be sent via SMS
    
    toast.success(`OTP sent to ${phone}`);
    toast.info(`Demo OTP: ${otp}`, { duration: 10000 });
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    toast.success('OTP verified successfully!');
    setStep('password');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Update admin password
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[ADMIN_PHONE]) {
        users[ADMIN_PHONE].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        toast.success('Admin password reset successfully!');
        onResetComplete();
      } else {
        setError('Admin account not found');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 p-4 rounded-2xl">
            <Logo size={40} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-gray-900 mb-2">Admin Password Reset</h2>
          <p className="text-gray-600 text-sm">
            {step === 'phone' && 'Enter your admin phone number'}
            {step === 'otp' && 'Enter the OTP sent to your phone'}
            {step === 'password' && 'Create your new password'}
          </p>
        </div>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Admin Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                Only the admin account (ending in 3210) can reset password
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700">
              Send OTP
            </Button>

            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                OTP sent to {phone}. Check console for demo OTP.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700">
              Verify OTP
            </Button>

            <Button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              variant="outline"
              className="w-full h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Phone Number
            </Button>
          </form>
        )}

        {/* New Password Step */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {newPassword && newPassword.length >= 6 && newPassword === confirmPassword && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Passwords match! Ready to reset.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700">
              Reset Password
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

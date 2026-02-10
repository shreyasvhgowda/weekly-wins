import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register' | 'otp-request' | 'otp-verify';

export default function Auth() {
  const { user, loading, signUp, signIn, signInWithOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email, password, displayName);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Check your email', description: 'We sent you a verification link. Please verify your email before logging in.' });
      setMode('login');
    }
  };

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signInWithOtp(email);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Failed to send code', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Code sent!', description: 'Check your email for the 6-digit code.' });
      setMode('otp-verify');
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await verifyOtp(email, otpCode);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Verification failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'login' && '🎯 Welcome Back'}
            {mode === 'register' && '✨ Create Account'}
            {mode === 'otp-request' && '🔐 Two-Factor Login'}
            {mode === 'otp-verify' && '📧 Enter Code'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' && 'Sign in to your Weekly To-Do account'}
            {mode === 'register' && 'Start planning your week'}
            {mode === 'otp-request' && 'We\'ll send a code to your email'}
            {mode === 'otp-verify' && 'Enter the 6-digit code from your email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-center space-y-2 text-sm">
                <button type="button" onClick={() => setMode('otp-request')} className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                  Sign in with email code (2FA)
                </button>
                <div>
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <button type="button" onClick={() => setMode('register')} className="text-foreground font-medium hover:underline underline-offset-4">
                    Register
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regEmail">Email</Label>
                <Input id="regEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPassword">Password</Label>
                <Input id="regPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create Account'}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button type="button" onClick={() => setMode('login')} className="text-foreground font-medium hover:underline underline-offset-4">
                  Sign in
                </button>
              </div>
            </form>
          )}

          {mode === 'otp-request' && (
            <form onSubmit={handleOtpRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpEmail">Email</Label>
                <Input id="otpEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Sending code...' : 'Send Code'}
              </Button>
              <div className="text-center text-sm">
                <button type="button" onClick={() => setMode('login')} className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                  Back to password login
                </button>
              </div>
            </form>
          )}

          {mode === 'otp-verify' && (
            <form onSubmit={handleOtpVerify} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
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
              <Button type="submit" className="w-full" disabled={submitting || otpCode.length < 6}>
                {submitting ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              <div className="text-center text-sm">
                <button type="button" onClick={() => { setMode('otp-request'); setOtpCode(''); }} className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                  Resend code
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

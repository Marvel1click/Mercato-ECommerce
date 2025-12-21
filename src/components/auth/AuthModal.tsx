import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AuthModal() {
  const { signIn, signUp } = useAuth();
  const { isAuthModalOpen, setAuthModalOpen, authModalView, setAuthModalView, showToast } = useUI();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError('');
  };

  const handleClose = () => {
    setAuthModalOpen(false);
    resetForm();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      showToast('Welcome back!');
      handleClose();
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
    } else {
      showToast('Account created successfully!');
      handleClose();
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      showToast('Password reset instructions sent to your email', 'info');
      setAuthModalView('login');
      setLoading(false);
    }, 1000);
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={handleClose} size="sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {authModalView === 'login' && 'Welcome Back'}
          {authModalView === 'register' && 'Create Account'}
          {authModalView === 'forgot' && 'Reset Password'}
        </h2>
        <p className="text-gray-500 mt-1">
          {authModalView === 'login' && 'Sign in to access your account'}
          {authModalView === 'register' && 'Join the Mercato family'}
          {authModalView === 'forgot' && 'Enter your email to reset password'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {authModalView === 'login' && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setAuthModalView('forgot')}
              className="text-sm text-terracotta-600 hover:text-terracotta-700"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>

          <p className="text-center text-gray-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthModalView('register');
                resetForm();
              }}
              className="text-terracotta-600 font-medium hover:text-terracotta-700"
            >
              Sign Up
            </button>
          </p>
        </form>
      )}

      {authModalView === 'register' && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>

          <p className="text-center text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthModalView('login');
                resetForm();
              }}
              className="text-terracotta-600 font-medium hover:text-terracotta-700"
            >
              Sign In
            </button>
          </p>
        </form>
      )}

      {authModalView === 'forgot' && (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>

          <p className="text-center text-gray-500">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthModalView('login');
                resetForm();
              }}
              className="text-terracotta-600 font-medium hover:text-terracotta-700"
            >
              Sign In
            </button>
          </p>
        </form>
      )}
    </Modal>
  );
}

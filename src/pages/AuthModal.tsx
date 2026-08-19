import React, { useState, useEffect } from 'react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((mode === 'signin' || mode === 'signup') && !acceptTerms) {
      toast.error('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success('Password reset link sent to your email address!');
          setMode('signin');
        }
        return;
      }

      if (mode === 'signup') {
        const res = await signUp(email, password, name);
        if (res.error) {
          // Supabase free plan rate limit — give the user a clear action
          if (res.error.toLowerCase().includes('rate limit') || res.error.toLowerCase().includes('email rate')) {
            toast.error('Too many sign-up attempts. Please wait a few minutes and try again, or sign up with Google instead.');
          } else {
            toast.error(res.error);
          }
        } else {
          toast.success(res.message || 'Account created successfully! Welcome to Doclly.');
          setEmail('');
          setPassword('');
          setName('');
          onClose();
        }
        return;
      }

      // mode === 'signin'
      const res = await signIn(email, password);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Welcome back to Doclly!');
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptTerms) {
      toast.error('Please agree to the Terms of Service to continue.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Authenticated with Google successfully!');
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={
        mode === 'signin'
          ? 'Sign in to Doclly'
          : mode === 'signup'
          ? 'Create your free account'
          : 'Reset your password'
      }
      description={
        mode === 'signin'
          ? 'Access your workspace, cloud documents, and saved tools.'
          : mode === 'signup'
          ? 'Get access to 30+ document utilities and AI features.'
          : 'Enter your email to receive a secure recovery link.'
      }
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] text-xs sm:text-sm font-semibold text-[#111111] rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E5E5E5] w-full" />
              <span className="bg-white px-2 text-[10px] sm:text-[11px] text-gray-400 uppercase font-semibold">
                or email
              </span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-[#111111] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-[#111111] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#111111]">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] sm:text-[11px] text-[#111111] font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          )}

          {/* Terms and conditions agreement checkbox */}
          {mode !== 'forgot' && (
            <div className="flex items-start gap-2 pt-1 select-none">
              <input
                type="checkbox"
                id="modalTermsCheckbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-[#D1D5DB] text-[#FFC800] focus:ring-[#FFC800] accent-[#FFC800] cursor-pointer shrink-0"
              />
              <label htmlFor="modalTermsCheckbox" className="text-[11px] sm:text-xs text-[#4B5563] leading-tight cursor-pointer">
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#111111] font-bold underline hover:text-black"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#111111] font-bold underline hover:text-black"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || ((mode === 'signin' || mode === 'signup') && !acceptTerms)}
            className="w-full mt-2 py-2 sm:py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center bg-[#FFC800] bg-gradient-to-b from-white/30 to-transparent hover:bg-[#F5B800] text-[#111111] border border-[#DC9F00] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_8px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-all cursor-pointer disabled:opacity-50 select-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="pt-3 border-t border-[#E5E5E5] text-center text-xs text-[#6B7280]">
          {mode === 'signin' ? (
            <p>
              Don&rsquo;t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-[#111111] font-bold hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-[#111111] font-bold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              onClick={() => setMode('signin')}
              className="text-[#111111] font-bold hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

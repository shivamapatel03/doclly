import React, { useState } from 'react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { Lock, Mail, User } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    if (mode === 'forgot') {
      toast.success('Password reset link sent to your email address!');
      setMode('signin');
      return;
    }

    toast.success(mode === 'signin' ? 'Welcome back to Doclly!' : 'Account created successfully!');
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);
    toast.success('Authenticated with Google successfully!');
    onClose();
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
      <div className="space-y-4">
        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] text-xs sm:text-sm font-semibold text-[#111111] rounded-xl transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span className="bg-white px-2 text-[11px] text-gray-400 uppercase font-semibold">
                or email
              </span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#111111]">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#111111] font-semibold hover:underline"
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
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {mode === 'signin'
              ? 'Sign In'
              : mode === 'signup'
              ? 'Create Account'
              : 'Send Reset Link'}
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="pt-3 border-t border-[#E5E5E5] text-center text-xs text-[#6B7280]">
          {mode === 'signin' ? (
            <p>
              Don&rsquo;t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-[#111111] font-bold hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-[#111111] font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              onClick={() => setMode('signin')}
              className="text-[#111111] font-bold hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

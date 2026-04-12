import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'clinic' | 'admin'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Fetch user profile to get role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const userRole = profileData?.role || 'patient';
      localStorage.setItem('userRole', userRole);

      onClose();
      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      navigate(`${langPrefix}/dashboard`, { state: { role: userRole } });
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (signUpError) throw signUpError;

      localStorage.setItem('userRole', role);
      onClose();
      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      navigate(`${langPrefix}/dashboard`, { state: { role } });
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 z-[999] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          setShowForgotPassword(false);
        }
      }}>
        <div className="bg-white rounded-2xl p-10 w-full max-w-[400px] relative shadow-lg animate-fade-up">
          <button onClick={() => { onClose(); setShowForgotPassword(false); }} className="absolute top-4 right-4 bg-gray-100 border-none cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200 text-gray-600">
            <X className="w-4 h-4" />
          </button>
          <h2 className="font-serif text-[1.8rem] text-navy mb-1.5">{t.modal.forgotPassword}</h2>
          <p className="text-[0.88rem] text-gray-400 mb-7">{t.modal.forgotPasswordDesc}</p>
          
          <form onSubmit={(e) => { e.preventDefault(); setShowForgotPassword(false); onClose(); }}>
            <div className="mb-4">
              <label className="block text-[0.78rem] font-semibold text-gray-600 mb-1.5">E-mail</label>
              <input required type="email" placeholder="max@beispiel.de" className="w-full py-3 px-3.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.9rem] text-text bg-off-white outline-none transition-colors focus:border-blue focus:bg-white" />
            </div>
            <button type="submit" className="w-full py-3.5 mt-2 bg-gradient-to-br from-blue to-blue-dark text-white border-none rounded-md font-sans text-[0.95rem] font-semibold cursor-pointer transition-transform hover:-translate-y-[1px]">
              {t.modal.resetPassword}
            </button>
            <div className="mt-4 text-center">
              <button type="button" onClick={() => setShowForgotPassword(false)} className="text-[0.85rem] text-blue hover:underline bg-transparent border-none cursor-pointer">
                {t.modal.backToLogin}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-[450px] relative shadow-lg animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 border-none cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200 text-gray-600">
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`flex-1 py-3 text-[1rem] font-semibold transition-colors border-b-2 ${activeTab === 'login' ? 'border-blue text-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            {t.modal.login}
          </button>
          <button 
            className={`flex-1 py-3 text-[1rem] font-semibold transition-colors border-b-2 ${activeTab === 'signup' ? 'border-blue text-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            onClick={() => { setActiveTab('signup'); setError(null); }}
          >
            {t.modal.signup}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-[0.78rem] font-semibold text-gray-600 mb-1.5">E-mail</label>
              <input required name="email" type="email" placeholder="E-mail" className="w-full py-3 px-3.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.9rem] text-text bg-off-white outline-none transition-colors focus:border-blue focus:bg-white" />
            </div>
            <div className="mb-2">
              <label className="block text-[0.78rem] font-semibold text-gray-600 mb-1.5">{t.modal.password}</label>
              <input required name="password" type="password" placeholder="••••••••" className="w-full py-3 px-3.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.9rem] text-text bg-off-white outline-none transition-colors focus:border-blue focus:bg-white" />
            </div>
            <div className="mb-6 text-right">
              <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[0.8rem] text-blue hover:underline bg-transparent border-none cursor-pointer">
                {t.modal.forgotPassword}?
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-br from-blue to-blue-dark text-white border-none rounded-md font-sans text-[0.95rem] font-semibold cursor-pointer transition-transform hover:-translate-y-[1px] disabled:opacity-70">
              {loading ? t.modal.loggingIn : t.modal.loginBtn}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-[0.78rem] font-semibold text-gray-600 mb-1.5">E-mail</label>
              <input required name="email" type="email" placeholder="max@beispiel.de" className="w-full py-3 px-3.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.9rem] text-text bg-off-white outline-none transition-colors focus:border-blue focus:bg-white" />
            </div>
            <div className="mb-4">
              <label className="block text-[0.78rem] font-semibold text-gray-600 mb-1.5">{t.modal.password}</label>
              <input required name="password" type="password" placeholder="••••••••" className="w-full py-3 px-3.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.9rem] text-text bg-off-white outline-none transition-colors focus:border-blue focus:bg-white" />
            </div>
            <div className="mb-6">
              <label className="block text-[0.78rem] font-semibold text-gray-600 mb-2.5">{t.modal.signupAs}</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="role" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} className="w-4 h-4 text-blue focus:ring-blue" />
                  <span className="text-[0.9rem] text-gray-700">{t.modal.patient}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="role" value="clinic" checked={role === 'clinic'} onChange={() => setRole('clinic')} className="w-4 h-4 text-blue focus:ring-blue" />
                  <span className="text-[0.9rem] text-gray-700">{t.modal.clinic}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="w-4 h-4 text-blue focus:ring-blue" />
                  <span className="text-[0.9rem] text-gray-700">{t.modal.admin}</span>
                </label>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-br from-blue to-blue-dark text-white border-none rounded-md font-sans text-[0.95rem] font-semibold cursor-pointer transition-transform hover:-translate-y-[1px] disabled:opacity-70">
              {loading ? t.modal.signingUp : t.modal.signupBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

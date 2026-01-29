'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useToast } from '@/lib/useToast';
import styles from './AuthForms.module.css';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { show } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login(email, password);
      show('Login successful!', 'success');
      router.push('/dashboard');
    } catch (error: any) {
      show(error.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className={styles.link}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { show } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(email, password);
      show('Registration successful!', 'success');
      router.push('/dashboard');
    } catch (error: any) {
      show(error.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Register</h2>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password (min 6 chars)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Enter password"
          />
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className={styles.link}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

import React from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useFormState } from '../hooks/useFormState';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import logoImage from '../assets/logo.png';
import '../styles/LoginPage.css';

/**
 * Login page component for user authentication
 */
export const LoginPage: React.FC = () => {
  const { values, handleChange } = useFormState({
    username: '',
    password: '',
  });

  // Authentication hook

  const { login, error } = useAuth();

  //handle submition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <div className="login-page">
      <Header />

      <div className="container">
        <div className="login-container form-container">
          {/* Logo*/}
          <div className="text-center mb-4">
            <img src={logoImage} alt="JaMoveo Logo" className="login-logo" />
          </div>

          <h2 className="text-center mb-2">Welcome to JaMoveo</h2>

          {error && <div className="error-message text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />

            <Input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <Button type="submit" variant="primary" className="w-100">
              {'Login'}
            </Button>
          </form>

          <div className="text-center mt-2">
            <p>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { LoginFormProps } from '../interfaces';

/**
 *handles user auth
 **/

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  //state to hold form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        {/* Username and Password fields */}

        <Input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />

        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {/* Login button */}
        <Button type="submit" variant="primary">
          Login
        </Button>
      </form>
    </div>
  );
};

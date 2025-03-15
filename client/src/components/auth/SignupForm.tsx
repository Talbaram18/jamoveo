import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { UserRole } from '../../types/user';
import { SignupFormProps } from '../interfaces';

/**
 *handles user registration for both musicians and admins
 **/

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  //handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup({
      username,
      password,
      instrument: isAdmin ? undefined : instrument,
      role: isAdmin ? UserRole.ADMIN : UserRole.PLAYER,
    });
  };

  return (
    <div className="signup-form">
      <div className="role-toggle">
        <Button
          variant={!isAdmin ? 'primary' : 'outline'}
          onClick={() => setIsAdmin(false)}
        >
          {/*Musican signup */}
          Musician
        </Button>
        <Button
          variant={isAdmin ? 'primary' : 'outline'}
          onClick={() => setIsAdmin(true)}
        >
          {/*Admin signup */}
          Admin
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {/* Username and Password fields for both */}

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
        {/* fields for players */}

        {!isAdmin && (
          <Input
            type="select"
            name="instrument"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            options={[
              { value: 'guitar', label: 'Guitar' },
              { value: 'drums', label: 'Drums' },
              { value: 'bass', label: 'Bass' },
              { value: 'vocals', label: 'Vocals' },
              { value: 'keyboard', label: 'Keyboard' },
              { value: 'saxophone', label: 'Saxophone' },
            ]}
            placeholder="Select Instrument"
            required
          />
        )}
        {/*creating the account */}

        <Button type="submit" variant="primary">
          {isAdmin ? 'Create Admin Account' : 'Create Musician Account'}
        </Button>
      </form>
    </div>
  );
};

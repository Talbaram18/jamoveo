import React from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useFormState } from '../hooks/useFormState';
import { useToggle } from '../hooks/useToggle';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { INSTRUMENTS } from '../utils/constants';
import { UserRole } from '../types/user';
/**
 * SignupPage Component
 *
 * Handles user registration for both musicians and admins.
 * */
export const SignupPage: React.FC = () => {
  const { values, handleChange, setValues } = useFormState({
    username: '',
    password: '',
    instrument: '',
    isAdmin: false,
  });

  const { isToggled: isAdmin, toggle: toggleAdmin } = useToggle(false);

  const { signup, error } = useAuth();

  // Update no instrument when admin toggle changes
  React.useEffect(() => {
    setValues((prev) => ({
      ...prev,
      instrument: isAdmin ? '' : prev.instrument,
    }));
  }, [isAdmin, setValues]);

  //handles form submition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({
      username: values.username,
      password: values.password,
      instrument: isAdmin ? undefined : values.instrument,
      role: isAdmin ? UserRole.ADMIN : UserRole.PLAYER,
    });
  };

  return (
    <div className="signup-page">
      <Header />

      <div className="container">
        <div className="signup-container form-container">
          <h2 className="text-center mb-2">
            {isAdmin ? 'Admin Signup' : 'Musician Signup'}
          </h2>

          <div className="signup-toggle text-center mb-2">
            <Button
              variant={!isAdmin ? 'primary' : 'outline'}
              onClick={() => toggleAdmin()}
            >
              Musician
            </Button>
            <Button
              variant={isAdmin ? 'primary' : 'outline'}
              onClick={() => toggleAdmin()}
            >
              Admin
            </Button>
          </div>

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

            {!isAdmin && (
              <Input
                type="select"
                name="instrument"
                value={values.instrument}
                onChange={handleChange}
                options={INSTRUMENTS}
                placeholder="Select Instrument"
                required
              />
            )}

            <Button type="submit" variant="primary" className="w-100">
              {isAdmin ? 'Create Admin Account' : 'Create Musician Account'}
            </Button>
          </form>

          <div className="text-center mt-2">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useFormWithValidation } from '../hooks/useFormWithValidation';
import { loginUser } from '../utils/api';

function SignInPage() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    try {
      const { token, user } = await loginUser(values.email, values.password);
      login(token, user);
      navigate('/');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Algo salió mal');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="form__title">Iniciar sesión</h1>
      <div className="form__input-container">
        <label className="form__label">
          Correo electrónico
          <input
            className="form__input"
            name="email"
            type="email"
            required
            value={values.email ?? ''}
            onChange={handleChange}
          />
        </label>
        {errors.email && <p className="form__error">{errors.email}</p>}
      </div>
      <div className="form__input-container">
        <label className="form__label">
          Contraseña
          <input
            className="form__input"
            name="password"
            type="password"
            required
            minLength={8}
            value={values.password ?? ''}
            onChange={handleChange}
          />
        </label>
        {errors.password && <p className="form__error">{errors.password}</p>}
      </div>
      <button type="submit" disabled={!isValid} className="form__submit-btn">
        Iniciar sesión
      </button>
      {submitError && <p className="form__error">{submitError}</p>}
      <p className="form__text">
        ¿Todavía no tienes cuenta? <Link to="/signup">Regístrate</Link>
      </p>
    </form>
  );
}

export default SignInPage;

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '../hooks/useFormWithValidation';
import { registerUser } from '../utils/api';

function SignUpPage() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    try {
      await registerUser(values.email, values.password, values.name);
      navigate('/signin');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Algo salió mal');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="form__title">Registrarse</h1>
      <div className="form__input-container">
        <label className="form__label">
          Nombre
          <input
            className="form__input"
            name="name"
            type="text"
            required
            value={values.name ?? ''}
            onChange={handleChange}
          />
        </label>
        {errors.name && <p className="form__error">{errors.name}</p>}
      </div>
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
        Registrarse
      </button>
      {submitError && <p className="form__error">{submitError}</p>}
      <p className="form__text">
        ¿Ya tienes cuenta? <Link to="/signin">Inicia sesión</Link>
      </p>
    </form>
  );
}

export default SignUpPage;

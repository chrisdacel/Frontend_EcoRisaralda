import React from 'react';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { register as apiRegister } from './services/api';
import Alert from './components/Alert';
import { fetchCountries } from './services/api';

export default function RegisterPage({ onNavigateHome, onNavigateLogin, onNavigatePreferences, onNavigateConfirm }) {
      const [dropdownOpen, setDropdownOpen] = useState(false);
    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
  const { setUser } = useAuth();
  const role = 'turist'; // Registro solo turista
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
    // Fetch countries on mount
    React.useEffect(() => {
      fetchCountries()
        .then((data) => {
          setCountries(Array.isArray(data) ? data : []);
        })
        .catch(() => setCountries([]));
    }, []);
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ageError, setAgeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validatePassword = (pwd) => {
    if (!pwd) {
      setPasswordError('');
      return false;
    }
    
    if (pwd.length < 8 || pwd.length > 64) {
      setPasswordError('La contraseña debe tener entre 8 y 64 caracteres');
      return false;
    }
    
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('La contraseña debe incluir al menos una letra mayúscula');
      return false;
    }
    
    if (!/[a-z]/.test(pwd)) {
      setPasswordError('La contraseña debe incluir al menos una letra minúscula');
      return false;
    }
    
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('La contraseña debe incluir al menos un dígito');
      return false;
    }

    if (!/^[A-Za-z0-9@?#$%()_=*\\:;'.\/\+<>¿,\[\]]+$/.test(pwd)) {
      setPasswordError('La contraseña contiene caracteres no permitidos');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const age = calculateAge(birthDate);
    if (age !== null && age < 16) {
      setError('Debes ser mayor de 16 años para registrarte');
      return;
    }

    if (!validatePassword(password)) {
      setError(passwordError);
      return;
    }

    // Validar email básico
    if (!email.includes('@') || !email.includes('.')) {
      setError('El correo debe contener al menos un @ y un punto (.)');
      return;
    }
    
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await apiRegister(
        name.trim(),
        email.trim(),
        password,
        role,
        lastName.trim(),
        country || null,
        birthDate || null
      );
      setSuccess('Registro exitoso. Te enviamos un correo para confirmar la cuenta.');
      setName('');
      setLastName('');
      setEmail('');
      setCountry('');
      setBirthDate('');
      setPassword('');
      setPassword2('');
      // Redirigir a confirmar cuenta después de 2 segundos
      setTimeout(() => {
        if (onNavigateConfirm) {
          onNavigateConfirm(email.trim());
        } else if (onNavigateLogin) {
          onNavigateLogin();
        }
      }, 2000);
    } catch (err) {
      const msg = err?.message || err?.error || 'No se pudo registrar';
      setError(typeof msg === 'string' ? msg : 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10 mt-20 md:mt-0">
        {/* Intro izquierda */}
        <div className="hidden flex-1 md:flex md:flex-col md:pr-4 lg:pr-10">
          <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
          <h1 className="mt-4 lg:mt-6 text-3xl lg:text-5xl leading-tight font-semibold">
            Crea tu cuenta para explorar experiencias responsables.
          </h1>
          <p className="mt-3 lg:mt-4 max-w-xl text-sm lg:text-base text-emerald-100/80">
            Elige tu rol para disfrutar de contenido personalizado: como Turista descubre destinos; como Operador, publica y gestiona tus sitios.
          </p>
        </div>

        {/* Formulario derecha */}
        <div className="w-full md:w-[440px] lg:w-[520px]">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Crear cuenta</h2>
              <p className="mt-1 text-sm text-emerald-100/80">Completa tus datos para comenzar</p>
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30">
                Registro de Turista
              </span>
            </div>

            {error && (
                <Alert type="error" className="mb-4">
                  {error}
                </Alert>
            )}
            {success && (
                <Alert type="success" className="mb-4">
                  {success}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 50);
                      setName(val);
                      if (val.length > 0 && val.length < 2) {
                        setNameError('El nombre debe tener al menos 2 caracteres');
                      } else {
                        setNameError('');
                      }
                    }}
                    required
                    minLength={2}
                    maxLength={50}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Tu nombre (2-50 caracteres)"
                  />
                  {nameError && (
                    <p className="mt-1 text-xs text-red-300">{nameError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Apellido</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 50);
                      setLastName(val);
                      if (val.length > 0 && val.length < 2) {
                        setLastNameError('El apellido debe tener al menos 2 caracteres');
                      } else {
                        setLastNameError('');
                      }
                    }}
                    required
                    minLength={2}
                    maxLength={50}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Tu apellido (2-50 caracteres)"
                  />
                  {lastNameError && (
                    <p className="mt-1 text-xs text-red-300">{lastNameError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      if (val.length > 0 && (!val.includes('@') || !val.includes('.'))) {
                        setEmailError('El correo debe contener al menos un @ y un punto (.)');
                      } else {
                        setEmailError('');
                      }
                    }}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="tu@correo.com"
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-300">{emailError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-100">País</label>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white text-left outline-none focus:ring-2 focus:ring-emerald-400/60 transition flex items-center justify-between"
                      onClick={() => setDropdownOpen((open) => !open)}
                    >
                      <span>
                        {country
                          ? (countries.find(c => c.id === country)?.name || 'Selecciona tu país')
                          : 'Selecciona tu país'}
                      </span>
                      <span
                        className={`ml-2 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        aria-hidden="true"
                      >
                        {/* Chevron Down SVG */}
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute z-10 mt-2 w-full rounded-lg bg-white shadow-lg ring-1 ring-black/10">
                        <div className="max-h-60 overflow-y-auto">
                          {countries.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className="w-full text-left px-4 py-2 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 focus:bg-emerald-100 focus:text-emerald-700"
                              onClick={() => {
                                setCountry(c.id);
                                setDropdownOpen(false);
                              }}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-emerald-100 truncate">Fecha de nacimiento</label>
                  <div className="mt-1 flex w-full min-w-0 items-center overflow-hidden rounded-lg border border-white/10 bg-white/10 focus-within:ring-2 focus-within:ring-emerald-400/60 transition-all">
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => {
                        setBirthDate(e.target.value);
                        const age = calculateAge(e.target.value);
                        if (age !== null && age < 16) {
                          setAgeError('Debes ser mayor de 16 años para registrarte');
                        } else {
                          setAgeError('');
                        }
                      }}
                      required
                      style={{ color: birthDate ? 'white' : 'rgba(209, 250, 229, 0.6)' }}
                      className="w-full flex-1 bg-transparent px-3 py-2 outline-none"
                    />
                  </div>
                  {ageError && (
                    <p className="mt-1 text-xs text-red-300">{ageError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                    minLength={8}
                    maxLength={64}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="8-64 caracteres"
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-300">{passwordError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => {
                      setPassword2(e.target.value);
                      if (e.target.value !== password) {
                        setPasswordMatchError('Las contraseñas no coinciden');
                      } else {
                        setPasswordMatchError('');
                      }
                    }}
                    required
                    minLength={8}
                    maxLength={64}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Repite tu contraseña"
                  />
                  {passwordMatchError && (
                    <p className="mt-1 text-xs text-red-300">{passwordMatchError}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  ageError !== '' ||
                  passwordError !== '' ||
                  emailError !== '' ||
                  name.trim().length < 2 ||
                  lastName.trim().length < 2 ||
                  password.trim().length === 0 ||
                  password2.trim().length === 0 ||
                  !country ||
                  passwordMatchError !== ''
                }
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>

              <p className="text-center text-xs text-emerald-100/70">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={onNavigateLogin} className="underline underline-offset-4 hover:text-emerald-100">Inicia sesión</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

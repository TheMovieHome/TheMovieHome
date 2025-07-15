import { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [useMockAuth, setUseMockAuth] = useState(false); // Toggle para modo mock

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api/users';

  // Dados mockados para login sem API
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@test.com',
      password: '123456'
    },
    {
      id: 2,
      username: 'user',
      email: 'user@test.com',
      password: '123456'
    },
    {
      id: 3,
      username: 'demo',
      email: 'demo@test.com',
      password: 'demo123'
    }
  ];

  const carouselImages = [
    {
      url: 'https://image.tmdb.org/t/p/original/4fGg4PKmrCeCEt5idrIVftdpLxB.jpg',
      title: 'Descubra Novos Filmes',
      description: 'Explore milhares de filmes e séries incríveis'
    },
    {
      url: 'https://image.tmdb.org/t/p/original/iYLKMV7PIBtFmtygRrhSiyzcVsF.jpg',
      title: 'Assista com Amigos',
      description: 'Crie watch parties e compartilhe momentos especiais'
    },
    {
      url: 'https://image.tmdb.org/t/p/original/2l5UHZBcp9cx1PwKLdisJ0gV9jB.jpg',
      title: 'Reviews e Avaliações',
      description: 'Compartilhe suas opiniões e descubra novas recomendações'
    },
    {
      url: 'https://image.tmdb.org/t/p/original/ywe9S1cOyIhR5yWzK7511NuQ2YX.jpg',
      title: 'Sua Lista Personalizada',
      description: 'Organize seus filmes favoritos em listas personalizadas'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!loginData.password) newErrors.password = 'Senha é obrigatória';
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerData.username.trim()) newErrors.username = 'Nome é obrigatório';
    if (!registerData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) newErrors.email = 'Email inválido';
    if (!registerData.password) newErrors.password = 'Senha é obrigatória';
    else if (registerData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    return newErrors;
  };

  // Função para login mockado
  const handleMockLogin = () => {
    const formErrors = validateLogin();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    // Simula delay de API
    setTimeout(() => {
      const user = mockUsers.find(u =>
        u.email === loginData.email && u.password === loginData.password
      );

      if (user) {
        onLogin({
          id: user.id,
          name: user.username,
          email: user.email
        });
        console.log('Mock login realizado:', user);
      } else {
        setErrors({ general: 'Credenciais inválidas' });
      }
      setLoading(false);
    }, 1000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Se estiver no modo mock, usar login mockado
    if (useMockAuth) {
      handleMockLogin();
      return;
    }

    // Código original da API
    const formErrors = validateLogin();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        const user = users.find(u => u.email === loginData.email);

        if (user) {
          onLogin({
            id: user.id,
            name: user.username,
            email: user.email
          });
          console.log('Usuário logado:', user);
        } else {
          setErrors({ general: 'Credenciais inválidas' });
        }
      } else {
        setErrors({ general: 'Erro no servidor' });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErrors({ general: 'Erro de conexão - Tente ativar o modo demo' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateRegister();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password
        })
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        setIsLogin(true);
        setRegisterData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        const errorMessage = await response.text();
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setErrors({ general: 'Erro de conexão' });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="login-container">
      {/* Lado esquerdo - Carrossel */}
      <div className="carousel-section">
        <div className="carousel-wrapper">
          {/* Slides do carrossel */}
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image.url})`
              }}
            >
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2 className="carousel-title">
                    {image.title}
                  </h2>
                  <p className="carousel-description">
                    {image.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Controles do carrossel */}
          <button
            onClick={prevSlide}
            className="carousel-control prev"
          >
            <svg className="carousel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="carousel-control next"
          >
            <svg className="carousel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Logo */}
          <div className="logo">
            <h1>
              <span className="logo-icon">🎬</span>
              MovieHome
            </h1>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="form-section">
        <div className="form-container">
          {/* Toggle para modo demo */}
          <div className="demo-toggle" style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '14px',
              color: '#666'
            }}>
              <input
                type="checkbox"
                checked={useMockAuth}
                onChange={(e) => setUseMockAuth(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Modo Demo (sem API)
            </label>
          </div>

          {/* Informações de login demo */}
          {useMockAuth && (
            <div style={{
              backgroundColor: '#f0f8ff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#333'
            }}>
              <strong>Contas de teste:</strong>
              <ul style={{ margin: '10px 0 0 20px', listStyle: 'disc' }}>
                <li>admin@test.com / 123456</li>
                <li>user@test.com / 123456</li>
                <li>demo@test.com / demo123</li>
              </ul>
            </div>
          )}

          {/* Toggle Login/Register */}
          <div className="toggle-container">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className={`toggle-button ${isLogin ? 'active' : ''}`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className={`toggle-button ${!isLogin ? 'active' : ''}`}
            >
              Cadastrar
            </button>
          </div>

          {/* Erro geral */}
          {errors.general && (
            <div className="error-message general">
              <p>{errors.general}</p>
            </div>
          )}

          {/* Formulário de Login */}
          {isLogin ? (
            <form className="form" onSubmit={handleLoginSubmit}>
              <div className="form-header">
                <h2>Bem-vindo!</h2>
                <p>Entre na sua conta</p>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Senha"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="forgot-password">
                <a href="#">Esqueceu a senha?</a>
              </div>
            </form>
          ) : (
            /* Formulário de Cadastro */
            <form className="form" onSubmit={handleRegisterSubmit}>
              <div className="form-header">
                <h2>Criar conta</h2>
                <p>Junte-se à nossa comunidade</p>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Nome de usuário"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Senha"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirmar senha"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
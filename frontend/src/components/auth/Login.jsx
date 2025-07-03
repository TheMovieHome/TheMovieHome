import { useState, useEffect } from 'react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Imagens do carrossel - relacionadas a filmes/streaming
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
    }, 5000);
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateLogin();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    // Simulando chamada API
    setTimeout(() => {
      alert('Login realizado com sucesso!');
      setLoading(false);
    }, 1500);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateRegister();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    // Simulando chamada API
    setTimeout(() => {
      alert('Cadastro realizado com sucesso!');
      setIsLogin(true);
      setLoading(false);
    }, 1500);
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
                backgroundImage: `url(${image.url})`,
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
          <button onClick={prevSlide} className="carousel-control prev">
            <svg className="carousel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextSlide} className="carousel-control next">
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
              {errors.general}
            </div>
          )}

          {/* Formulário de Login */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="form">
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
            <form onSubmit={handleRegisterSubmit} className="form">
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
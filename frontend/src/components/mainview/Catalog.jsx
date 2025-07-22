import React, { useState, useEffect, useRef } from 'react';
import './Catalog.css';
import UserAvatar from './UserAvatar'; // Importando o novo componente
import VideoPlayer from './VideoPlayer'; // Importando o VideoPlayer
// Importando ícones do Lucide React
import {
  Menu,
  Search,
  X,
  Star,
  User,
  Users,
  UserPlus,
  Check,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowLeft,
  Loader,
  Heart,
  HeartOff,
  BookmarkPlus
} from 'lucide-react';

const MovieCatalog = ({ user, onLogout }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Estados para a barra lateral de amizades
  const [isFriendsSidebarOpen, setIsFriendsSidebarOpen] = useState(false);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const [friendSearchLoading, setFriendSearchLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'requests', 'friends', 'reviews'

  // Estados para reviews - MODIFICADO PARA ARMAZENAMENTO LOCAL
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [movieReviews, setMovieReviews] = useState([]); // Apenas reviews do usuário logado para o filme atual
  const [userReviews, setUserReviews] = useState([]); // Todos os reviews do usuário logado
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    classificacao: 5,
    comentario: ''
  });
  const [editingReview, setEditingReview] = useState(null);

  // Estados para o VideoPlayer
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentMovieForPlayer, setCurrentMovieForPlayer] = useState(null);

  // Estados para Lista de Desejos
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMovies, setWishlistMovies] = useState([]);

  // Refs para os carrosséis
  const carouselRefs = useRef({});

  // FUNÇÕES DE LISTA DE DESEJOS

  // Função para carregar lista de desejos do backend
  const loadWishlist = async () => {
    if (!user || !user.id) return;

    setWishlistLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/ListaDeDesejo');
      if (response.ok) {
        const wishlistData = await response.json();
        setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        console.log('Lista de desejos carregada:', wishlistData);
      } else {
        console.error('Erro ao carregar lista de desejos:', response.status);
        setWishlist([]);
      }
    } catch (error) {
      console.error('Erro ao carregar lista de desejos:', error);
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Função para adicionar filme à lista de desejos
  const addToWishlist = async (movie) => {
    const movieProps = getMovieProps(movie);
    const imdbId = movieProps.imdbId || movie.imdbID;

    if (!imdbId) {
      alert('ID do filme não encontrado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/ListaDeDesejo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbId: imdbId })
      });

      if (response.ok) {
        setWishlist(prev => [...prev, imdbId]);
        alert('Filme adicionado à lista de desejos!');
        console.log('Filme adicionado à wishlist:', imdbId);
        // Recarregar filmes da wishlist
        loadWishlistMovies();
      } else {
        console.error('Erro ao adicionar à lista de desejos:', response.status);
        alert('Erro ao adicionar filme à lista de desejos.');
      }
    } catch (error) {
      console.error('Erro ao adicionar à lista de desejos:', error);
      alert('Erro ao adicionar filme à lista de desejos.');
    }
  };

  // Função para remover filme da lista de desejos
  const removeFromWishlist = async (movie) => {
    const movieProps = getMovieProps(movie);
    const imdbId = movieProps.imdbId || movie.imdbID;

    if (!imdbId) {
      alert('ID do filme não encontrado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/ListaDeDesejo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbId: imdbId })
      });

      if (response.ok || response.status === 204) {
        setWishlist(prev => prev.filter(id => id !== imdbId));
        alert('Filme removido da lista de desejos!');
        console.log('Filme removido da wishlist:', imdbId);
        // Recarregar filmes da wishlist
        loadWishlistMovies();
      } else {
        console.error('Erro ao remover da lista de desejos:', response.status);
        alert('Erro ao remover filme da lista de desejos.');
      }
    } catch (error) {
      console.error('Erro ao remover da lista de desejos:', error);
      alert('Erro ao remover filme da lista de desejos.');
    }
  };

  // Função para verificar se um filme está na lista de desejos
  const isInWishlist = (movie) => {
    const movieProps = getMovieProps(movie);
    const imdbId = movieProps.imdbId || movie.imdbID;
    return wishlist.includes(imdbId);
  };

  // Função para alternar filme na lista de desejos
  const toggleWishlist = async (movie) => {
    if (isInWishlist(movie)) {
      await removeFromWishlist(movie);
    } else {
      await addToWishlist(movie);
    }
  };

  // Função para buscar detalhes dos filmes da wishlist
  const loadWishlistMovies = async () => {
    if (wishlist.length === 0) {
      setWishlistMovies([]);
      return;
    }

    const movies = [];

    for (const imdbId of wishlist) {
      try {
        const response = await fetch(`http://localhost:8080/api/movies/busca?termo=${imdbId}`);
        const data = await response.json();

        if (data.Search && Array.isArray(data.Search) && data.Search.length > 0) {
          const movie = data.Search.find(m => m.imdbID === imdbId);
          if (movie) {
            movies.push(movie);
          }
        } else if (data.procura && Array.isArray(data.procura) && data.procura.length > 0) {
          const movie = data.procura.find(m => m.imdbID === imdbId);
          if (movie) {
            movies.push(movie);
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar filme ${imdbId}:`, error);
      }
    }

    setWishlistMovies(movies);
  };

  // FUNÇÕES DE ARMAZENAMENTO LOCAL PARA REVIEWS

  // Função para obter chave do localStorage baseada no usuário
  const getLocalStorageKey = () => {
    return `movieReviews_${user.id}`;
  };

  // Função para carregar reviews do localStorage
  const loadLocalReviews = () => {
    try {
      const key = getLocalStorageKey();
      const storedReviews = localStorage.getItem(key);
      return storedReviews ? JSON.parse(storedReviews) : [];
    } catch (error) {
      console.error('Erro ao carregar reviews do localStorage:', error);
      return [];
    }
  };

  // Função para salvar reviews no localStorage
  const saveLocalReviews = (reviews) => {
    try {
      const key = getLocalStorageKey();
      localStorage.setItem(key, JSON.stringify(reviews));
    } catch (error) {
      console.error('Erro ao salvar reviews no localStorage:', error);
    }
  };

  // Função para gerar ID único para review
  const generateReviewId = () => {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Função para carregar reviews de um filme específico (apenas do usuário logado)
  const loadMovieReviews = (imdbId) => {
    if (!imdbId) return;

    setReviewsLoading(true);
    try {
      const allUserReviews = loadLocalReviews();
      const movieSpecificReviews = allUserReviews.filter(review => review.imdbId === imdbId);
      setMovieReviews(movieSpecificReviews);
      console.log('Reviews do filme carregados (local):', movieSpecificReviews);
    } catch (error) {
      console.error('Erro ao carregar reviews do filme:', error);
      setMovieReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Função para carregar todos os reviews do usuário
  const loadUserReviews = () => {
    if (!user || !user.id) return;

    try {
      const allUserReviews = loadLocalReviews();
      setUserReviews(allUserReviews);
      console.log('Reviews do usuário carregados (local):', allUserReviews);
    } catch (error) {
      console.error('Erro ao carregar reviews do usuário:', error);
      setUserReviews([]);
    }
  };

  // Função para criar ou atualizar review (armazenamento local)
  const submitReview = () => {
    if (!selectedMovie || !reviewForm.comentario.trim()) {
      alert('Por favor, preencha o comentário do review.');
      return;
    }

    const movieProps = getMovieProps(selectedMovie);
    const imdbId = movieProps.imdbId || selectedMovie.imdbID;

    if (!imdbId) {
      alert('ID do filme não encontrado.');
      return;
    }

    try {
      const allUserReviews = loadLocalReviews();

      if (editingReview) {
        // Atualizar review existente
        const updatedReviews = allUserReviews.map(review =>
          review.id === editingReview.id
            ? {
                ...review,
                classificacao: reviewForm.classificacao,
                comentario: reviewForm.comentario.trim(),
                dataAtualizacao: new Date().toISOString()
              }
            : review
        );

        saveLocalReviews(updatedReviews);
        alert('Review atualizado com sucesso!');
      } else {
        // Criar novo review
        const newReview = {
          id: generateReviewId(),
          imdbId: imdbId,
          movieTitle: movieProps.title,
          movieYear: movieProps.year,
          moviePoster: movieProps.poster,
          classificacao: reviewForm.classificacao,
          comentario: reviewForm.comentario.trim(),
          username: user.username || user.email,
          userId: user.id,
          dataCriacao: new Date().toISOString()
        };

        const updatedReviews = [...allUserReviews, newReview];
        saveLocalReviews(updatedReviews);
        alert('Review criado com sucesso!');
      }

      // Recarregar reviews
      loadMovieReviews(imdbId);
      loadUserReviews();

      // Fechar modal e resetar form
      setIsReviewModalOpen(false);
      setReviewForm({ classificacao: 5, comentario: '' });
      setEditingReview(null);

    } catch (error) {
      console.error('Erro ao salvar review:', error);
      alert('Erro ao salvar review. Tente novamente.');
    }
  };

  // Função para deletar review (armazenamento local)
  const deleteReview = (reviewId) => {
    if (!confirm('Tem certeza que deseja deletar este review?')) {
      return;
    }

    try {
      const allUserReviews = loadLocalReviews();
      const updatedReviews = allUserReviews.filter(review => review.id !== reviewId);

      saveLocalReviews(updatedReviews);
      alert('Review deletado com sucesso!');

      // Recarregar reviews
      if (selectedMovie) {
        const movieProps = getMovieProps(selectedMovie);
        const imdbId = movieProps.imdbId || selectedMovie.imdbID;
        loadMovieReviews(imdbId);
      }
      loadUserReviews();

    } catch (error) {
      console.error('Erro ao deletar review:', error);
      alert('Erro ao deletar review. Tente novamente.');
    }
  };

  // FUNÇÕES DO VIDEO PLAYER

  // Função para abrir o video player
  const openVideoPlayer = (movie) => {
    setCurrentMovieForPlayer(movie);
    setIsVideoPlayerOpen(true);
  };

  // Função para fechar o video player
  const closeVideoPlayer = () => {
    setIsVideoPlayerOpen(false);
    setCurrentMovieForPlayer(null);
  };

  // Categorias temáticas com filmes específicos (mantém as mesmas do código original)
  const movieCategories = [
    {
      id: 'horror-classics',
      name: 'Clássicos do Terror',
      searchTerm: 'horror',
      movies: [
        {
          id: 'exorcist',
          title: 'O Exorcista',
          year: '1973',
          poster: 'https://image.tmdb.org/t/p/original/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg',
          description: 'Uma jovem garota é possuída por uma entidade demoníaca misteriosa.',
          searchTerm: 'exorcist',
          imdbId: 'tt0070047'
        },
        {
          id: 'shining',
          title: 'O Iluminado',
          year: '1980',
          poster: 'https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg',
          description: 'Um escritor aceita um emprego como zelador de inverno em um hotel isolado.',
          searchTerm: 'shining',
          imdbId: 'tt0081505'
        },
        {
          id: 'psycho',
          title: 'Psicose',
          year: '1960',
          poster: 'https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg',
          description: 'Uma secretária rouba dinheiro e foge para um motel isolado.',
          searchTerm: 'psycho',
          imdbId: 'tt0054215'
        },
        {
          id: 'nightmare',
          title: 'A Hora do Pesadelo',
          year: '1984',
          poster: 'https://image.tmdb.org/t/p/original/avHGIO93jgCZLf33ec2aahgZJX6.jpg',
          description: 'Adolescentes são aterrorizados em seus sonhos por Freddy Krueger.',
          searchTerm: 'nightmare elm street',
          imdbId: 'tt0087800'
        },
        {
          id: 'carrie',
          title: 'Carrie - A Estranha',
          year: '1976',
          poster: 'https://image.tmdb.org/t/p/w500/uc3OvgmbnYaS5Y0BOjSmC1EmSz1.jpg',
          description: 'Uma adolescente tímida e oprimida por sua mãe religiosa descobre poderes telecinéticos.',
          searchTerm: 'carrie',
          imdbId: 'tt0074285'
        },
        {
          id: 'rosemarys-baby',
          title: 'O Bebê de Rosemary',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/original/nclYFGpVzfbiORO5ELVVdxzt9Vg.jpg',
          description: 'Uma jovem mulher grávida suspeita que seus vizinhos têm planos sinistros para seu bebê.',
          searchTerm: 'rosemarys baby',
          imdbId: 'tt0063522'
        },
        {
          id: 'night-of-the-living-dead',
          title: 'A Noite dos Mortos-Vivos',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/w500/inNUOa9WZGdyRXQlt7eqmHtCttl.jpg',
          description: 'Um grupo de sobreviventes se refugia em uma fazenda isolada durante um apocalipse zumbi.',
          searchTerm: 'night of the living dead',
          imdbId: 'tt0063350'
        },
        {
          id: 'halloween',
          title: 'Halloween',
          year: '1978',
          poster: 'https://image.tmdb.org/t/p/w500/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg',
          description: 'Michael Myers escapa de um hospital psiquiátrico e retorna à sua cidade natal para aterrorizar.',
          searchTerm: 'halloween',
          imdbId: 'tt0077651'
        }
      ]
    },
    {
      id: 'sci-fi-classics',
      name: 'Ficção Científica Clássica',
      searchTerm: 'science fiction',
      movies: [
        {
          id: 'blade-runner',
          title: 'Blade Runner',
          year: '1982',
          poster: 'https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
          description: 'Em 2019, um blade runner deve perseguir e eliminar quatro replicantes.',
          searchTerm: 'blade runner',
          imdbId: 'tt0083658'
        },
        {
          id: 'alien',
          title: 'Alien',
          year: '1979',
          poster: 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
          description: 'A tripulação de uma nave espacial encontra uma forma de vida mortal.',
          searchTerm: 'alien',
          imdbId: 'tt0078748'
        },
        {
          id: 'matrix',
          title: 'Matrix',
          year: '1999',
          poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
          description: 'Um hacker descobre que a realidade é uma simulação computacional.',
          searchTerm: 'matrix',
          imdbId: 'tt0133093'
        },
        {
          id: 'terminator',
          title: 'O Exterminador do Futuro',
          year: '1984',
          poster: 'https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg',
          description: 'Um cyborg assassino é enviado do futuro para matar Sarah Connor.',
          searchTerm: 'terminator',
          imdbId: 'tt0088247'
        },
        {
          id: 'metropolis',
          title: 'Metropolis',
          year: '1927',
          poster: 'https://image.tmdb.org/t/p/original/vZIJxGnjcswPCAa52jhbl01FQkV.jpg',
          description: 'Em uma cidade futurística dividida entre a classe trabalhadora e os planejadores da cidade, o filho do mestre da cidade se apaixona por uma mulher da classe trabalhadora.',
          searchTerm: 'metropolis',
          imdbId: 'tt0017136'
        },
        {
          id: '2001-space-odyssey',
          title: '2001: Uma Odisseia no Espaço',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg',
          description: 'A humanidade encontra um misterioso artefato enterrado na superfície lunar e parte para descobrir suas origens com a ajuda do computador HAL 9000.',
          searchTerm: '2001 space odyssey',
          imdbId: 'tt0062622'
        },
        {
          id: 'planet-of-the-apes',
          title: 'O Planeta dos Macacos',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/original/2r9iKnlSYEk4daQadsXfcjHfIjQ.jpg',
          description: 'Uma tripulação de astronautas colide com um planeta em um futuro distante, onde os macacos são inteligentes e a espécie dominante.',
          searchTerm: 'planet of the apes',
          imdbId: 'tt0063442'
        },
        {
          id: 'terminator-2',
          title: 'O Exterminador do Futuro 2: O Julgamento Final',
          year: '1991',
          poster: 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg',
          description: 'Um ciborgue, idêntico ao que falhou em matar Sarah Connor, agora deve proteger o filho de dez anos dela, John, de um ciborgue ainda mais avançado e poderoso.',
          searchTerm: 'terminator 2 judgment day',
          imdbId: 'tt0103064'
        }
      ]
    },
    {
      id: 'action-classics',
      name: 'Ação Clássica',
      searchTerm: 'action',
      movies: [
        {
          id: 'die-hard',
          title: 'Duro de Matar',
          year: '1988',
          poster: 'https://image.tmdb.org/t/p/w500/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg',
          description: 'Um policial de Nova York enfrenta terroristas em um arranha-céu.',
          searchTerm: 'die hard',
          imdbId: 'tt0095016'
        },
        {
          id: 'predator',
          title: 'Predador',
          year: '1987',
          poster: 'https://image.tmdb.org/t/p/original/k3mW4qfJo6SKqe6laRyNGnbB9n5.jpg',
          description: 'Comandos em missão na selva enfrentam um caçador alienígena.',
          searchTerm: 'predator',
          imdbId: 'tt0093773'
        },
        {
          id: 'top-gun',
          title: 'Top Gun',
          year: '1986',
          poster: 'https://image.tmdb.org/t/p/w500/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg',
          description: 'Jovens pilotos da Marinha competem na escola de elite Top Gun.',
          searchTerm: 'top gun',
          imdbId: 'tt0092099'
        },
        {
          id: 'rocky',
          title: 'Rocky',
          year: '1976',
          poster: 'https://image.tmdb.org/t/p/original/uhX5kYBMcW9AT0FwWGElx19rpL6.jpg',
          description: 'Um boxeador amador tem a chance de lutar contra o campeão mundial.',
          searchTerm: 'rocky',
          imdbId: 'tt0075148'
        },
        {
          id: 'die-hard-3',
          title: 'Duro de Matar 3: A Vingança',
          year: '1995',
          poster: 'https://image.tmdb.org/t/p/original/buqmCdFQEWwEpL3agGgg2GVjN2d.jpg',
          description: 'John McClane é forçado a sair da suspensão para jogar um jogo de Simon Says por um terrorista que plantou bombas por toda Nova York.',
          searchTerm: 'die hard with a vengeance',
          imdbId: 'tt0112864'
        },
        {
          id: 'the-thing',
          title: 'O Enigma de Outro Mundo',
          year: '1982',
          poster: 'https://image.tmdb.org/t/p/w500/tzGY49kseSE9QAKk47uuDGwnSCu.jpg',
          description: 'Uma equipe de pesquisa na Antártida é caçada por um alienígena que muda de forma e assume a aparência de suas vítimas.',
          searchTerm: 'the thing',
          imdbId: 'tt0084787'
        },
        {
          id: 'star-wars-iv',
          title: 'Star Wars: Episódio IV - Uma Nova Esperança',
          year: '1977',
          poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
          description: 'Luke Skywalker se une a um Cavaleiro Jedi, um piloto arrogante, um Wookiee e dois dróides para salvar a galáxia da estação de batalha destruidora de mundos do Império.',
          searchTerm: 'star wars a new hope',
          imdbId: 'tt0076759'
        },
        {
          id: 'indiana-jones',
          title: 'Indiana Jones e os Caçadores da Arca Perdida',
          year: '1981',
          poster: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
          description: 'O arqueólogo Indiana Jones embarca em uma aventura para encontrar a lendária Arca da Aliança antes dos nazistas.',
          searchTerm: 'indiana jones raiders of the lost ark',
          imdbId: 'tt0082971'
        }
      ]
    },
    {
      id: 'comedy-classics',
      name: 'Comédias Clássicas',
      searchTerm: 'comedy',
      movies: [
        {
          id: 'ghostbusters',
          title: 'Os Caça-Fantasmas',
          year: '1984',
          poster: 'https://image.tmdb.org/t/p/original/7E8nLijS9AwwUEPu2oFYOVKhdFA.jpg',
          description: 'Três parapsicólogos começam um negócio de caça-fantasmas em Nova York.',
          searchTerm: 'ghostbusters',
          imdbId: 'tt0087332'
        },
        {
          id: 'back-future',
          title: 'De Volta para o Futuro',
          year: '1985',
          poster: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
          description: 'Um adolescente viaja acidentalmente ao passado em uma máquina do tempo.',
          searchTerm: 'back to the future',
          imdbId: 'tt0088763'
        },
        {
          id: 'groundhog',
          title: 'Feitiço do Tempo',
          year: '1993',
          poster: 'https://image.tmdb.org/t/p/original/gCgt1WARPZaXnq523ySQEUKinCs.jpg',
          description: 'Um meteorologista fica preso vivendo o mesmo dia repetidamente.',
          searchTerm: 'groundhog day',
          imdbId: 'tt0107048'
        },
        {
          id: 'airplane',
          title: 'Apertem os Cintos... O Piloto Sumiu',
          year: '1980',
          poster: 'https://image.tmdb.org/t/p/original/7Q3efxd3AF1vQjlSxnlerSA7RzN.jpg',
          description: 'Comédia paródia sobre desastres em voos comerciais.',
          searchTerm: 'airplane',
          imdbId: 'tt0080339'
        },
        {
          id: 'monty-python-holy-grail',
          title: 'Monty Python Em Busca do Cálice Sagrado',
          year: '1975',
          poster: 'https://image.tmdb.org/t/p/original/hWx1ANiWEWWyzKPN0us35HCGnhQ.jpg',
          description: 'O Rei Arthur e seus Cavaleiros da Távola Redonda embarcam em uma busca hilária pelo Santo Graal.',
          searchTerm: 'monty python holy grail',
          imdbId: 'tt0071853'
        },
        {
          id: 'blazing-saddles',
          title: 'Banzé no Oeste',
          year: '1974',
          poster: 'https://image.tmdb.org/t/p/original/vNw1gOEDdYTDeNMuuq8OmiEHrfH.jpg',
          description: 'Um xerife negro é nomeado para uma cidade racista no Velho Oeste.',
          searchTerm: 'blazing saddles',
          imdbId: 'tt0071230'
        },
        {
          id: 'animal-house',
          title: 'Clube dos Cafajestes',
          year: '1978',
          poster: 'https://image.tmdb.org/t/p/original/fWooBbipMRIKeSRhEzmeaDV0T8H.jpg',
          description: 'Um grupo de desajustados em uma fraternidade tenta se divertir enquanto enfrenta a administração da faculdade.',
          searchTerm: 'animal house',
          imdbId: 'tt0077975'
        },
        {
          id: 'caddyshack',
          title: 'Clube dos Pilantras',
          year: '1980',
          poster: 'https://image.tmdb.org/t/p/original/lXnNz7zOXCsftMDVoU3VSo0Eioi.jpg',
          description: 'Um novo caddy se envolve com os membros excêntricos de um clube de golfe exclusivo.',
          searchTerm: 'caddyshack',
          imdbId: 'tt0080487'
        }
      ]
    }
  ];

  // Função para abrir modal de review
  const openReviewModal = (existingReview = null) => {
    if (existingReview) {
      setEditingReview(existingReview);
      setReviewForm({
        classificacao: existingReview.classificacao,
        comentario: existingReview.comentario
      });
    } else {
      setEditingReview(null);
      setReviewForm({ classificacao: 5, comentario: '' });
    }
    setIsReviewModalOpen(true);
  };

  // Função para fechar modal de review
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewForm({ classificacao: 5, comentario: '' });
    setEditingReview(null);
  };

  // Função para renderizar estrelas de classificação
  const renderStars = (rating, interactive = false, onChange = null) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive && onChange ? () => onChange(i) : undefined}
        >
          <Star
            size={16}
            color="#4ade80"
            fill={i <= rating ? "#4ade80" : "none"}
          />
        </span>
      );
    }
    return <div className="stars-container">{stars}</div>;
  };

  // ===== FUNÇÕES ORIGINAIS (mantidas) =====

  // Função para rolar o carrossel
  const scrollCarousel = (categoryId, direction) => {
    const carousel = carouselRefs.current[categoryId];
    if (!carousel) return;

    const scrollAmount = 240;
    const currentScroll = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (direction === 'left') {
      carousel.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      carousel.scrollTo({
        left: Math.min(maxScroll, currentScroll + scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  // Função para verificar se pode rolar
  const canScroll = (categoryId, direction) => {
    const carousel = carouselRefs.current[categoryId];
    if (!carousel) return false;

    const currentScroll = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (direction === 'left') {
      return currentScroll > 0;
    } else {
      return currentScroll < maxScroll;
    }
  };

  // Função para buscar filmes similares via API
  const fetchSimilarMovies = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/movies/busca?termo=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      console.log('Resposta da API (similares):', data);

      if (data.Search && Array.isArray(data.Search)) {
        setSimilarMovies(data.Search);
      } else if (data.procura && Array.isArray(data.procura)) {
        setSimilarMovies(data.procura);
      } else {
        console.warn('Estrutura de dados inesperada:', data);
        setSimilarMovies([]);
      }
    } catch (error) {
      console.error('Erro ao buscar filmes similares:', error);
      setSimilarMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para pesquisar filmes
  const searchMovies = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/movies/busca?termo=${encodeURIComponent(term)}`);
      const data = await response.json();

      console.log('Resposta da API (pesquisa):', data);

      if (data.Search && Array.isArray(data.Search)) {
        setSearchResults(data.Search);
        setIsSearching(true);
      } else if (data.procura && Array.isArray(data.procura)) {
        setSearchResults(data.procura);
        setIsSearching(true);
      } else {
        console.warn('Estrutura de dados inesperada:', data);
        setSearchResults([]);
        setIsSearching(true);
      }
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setSearchResults([]);
      setIsSearching(true);
    } finally {
      setSearchLoading(false);
    }
  };

  // Função para buscar usuários para adicionar como amigos via API
  const searchFriends = async (term) => {
    if (!term.trim()) {
      setFriendSearchResults([]);
      return;
    }

    setFriendSearchLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/users/nome/${encodeURIComponent(term)}`);

      if (!response.ok) {
        if (response.status === 404) {
          setFriendSearchResults([]);
          return;
        }
        throw new Error('Erro ao buscar usuários');
      }

      let usersData = await response.json();
      console.log('Usuários encontrados:', usersData);

      const users = Array.isArray(usersData) ? usersData : [usersData];
      const filteredUsers = users.length > 0 ? users.filter(foundUser => foundUser && foundUser.id !== user.id) : [];

      setFriendSearchResults(filteredUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setFriendSearchResults([]);
    } finally {
      setFriendSearchLoading(false);
    }
  };

  // Função para carregar solicitações pendentes
  const loadPendingRequests = async () => {
    if (!user || !user.id) return;
    try {
      const response = await fetch(`http://localhost:8080/api/amizades/pendentes/${user.id}`);
      if (response.ok) {
        const requests = await response.json();
        setPendingRequests(requests);
        console.log('Solicitações pendentes carregadas:', requests);
      } else {
        setPendingRequests([]);
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações pendentes:', error);
      setPendingRequests([]);
    }
  };

  // Função para carregar lista de amigos
  const loadFriends = async () => {
    if (!user || !user.id) return;
    try {
      const response = await fetch(`http://localhost:8080/api/amizades/amigos/${user.id}`);
      if (response.ok) {
        const friendsList = await response.json();
        setFriends(friendsList);
        console.log('Lista de amigos carregada:', friendsList);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Erro ao carregar lista de amigos:', error);
      setFriends([]);
    }
  };

  // Função para verificar se existe relacionamento entre dois usuários
  const checkExistingRelationship = async (userId1, userId2) => {
    try {
      const response = await fetch(`http://localhost:8080/api/amizades/verificar?id1=${userId1}&id2=${userId2}`);

      if (response.ok) {
        const friendship = await response.json();
        return friendship;
      } else if (response.status === 404) {
        return null;
      }

      return null;
    } catch (error) {
      console.error('Erro ao verificar relacionamento:', error);
      return null;
    }
  };

  // Debounce para pesquisa de filmes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce para pesquisa de amigos
  useEffect(() => {
    const timer = setTimeout(() => {
      searchFriends(friendSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [friendSearchTerm]);

  // Carregar dados iniciais quando o componente monta
  useEffect(() => {
    if (user && user.id) {
      loadPendingRequests();
      loadFriends();
      loadUserReviews(); // Carrega reviews do localStorage
      loadWishlist(); // Carrega lista de desejos do backend
    }
  }, [user]);

  // Carregar filmes da wishlist quando a lista de IDs muda
  useEffect(() => {
    loadWishlistMovies();
  }, [wishlist]);

  // Atualização automática das solicitações
  useEffect(() => {
    if (user && user.id && isFriendsSidebarOpen) {
      const intervalId = setInterval(() => {
        console.log("Atualizando solicitações...");
        loadPendingRequests();
      }, 10000);

      return () => {
        console.log("Parando atualização automática.");
        clearInterval(intervalId);
      };
    }
  }, [user, isFriendsSidebarOpen]);

  // Carregar reviews quando um filme é selecionado
  useEffect(() => {
    if (selectedMovie) {
      const movieProps = getMovieProps(selectedMovie);
      const imdbId = movieProps.imdbId || selectedMovie.imdbID;
      if (imdbId) {
        loadMovieReviews(imdbId); // Carrega reviews do localStorage
      }
    }
  }, [selectedMovie]);

  // Função para enviar solicitação de amizade via API
  const sendFriendRequest = async (targetUserId) => {
    try {
      const existingFriendship = await checkExistingRelationship(user.id, targetUserId);

      if (existingFriendship) {
        alert('Vocês já são amigos!');
        return;
      }

      const hasPendingRequest = pendingRequests.some(req =>
        (req.solicitante.id === user.id && req.solicitado.id === targetUserId) ||
        (req.solicitante.id === targetUserId && req.solicitado.id === user.id)
      );

      if (hasPendingRequest) {
        alert('Já existe uma solicitação pendente entre vocês.');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/amizades/solicitar?solicitanteId=${user.id}&solicitadoId=${targetUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newRequest = await response.json();
        console.log('Solicitação de amizade enviada:', newRequest);

        setSentRequests(prev => [...prev, targetUserId]);
        loadPendingRequests();

        alert('Solicitação de amizade enviada com sucesso!');
      } else {
        const errorText = await response.text();
        console.error('Erro ao enviar solicitação:', errorText);

        if (errorText.includes('Já existe uma relação')) {
          alert('Já existe uma relação entre vocês.');
        } else if (errorText.includes('não é possível enviar solicitação para si mesmo')) {
          alert('Não é possível enviar solicitação para si mesmo.');
        } else {
          alert('Erro ao enviar solicitação de amizade. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação de amizade:', error);
      alert('Erro ao enviar solicitação de amizade. Verifique sua conexão.');
    }
  };

  // Função para responder a uma solicitação de amizade
  const respondToFriendRequest = async (requestId, accept) => {
    try {
      const response = await fetch(`http://localhost:8080/api/amizades/${requestId}/responder?aceitar=${accept}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`Solicitação ${accept ? 'aceita' : 'rejeitada'} com sucesso!`);

        loadPendingRequests();
        loadFriends();

      } else {
        const errorText = await response.text();
        console.error('Erro ao responder solicitação:', errorText);
        if (errorText.includes('já foi respondida')) {
          alert('Esta solicitação já foi respondida.');
          loadPendingRequests();
        } else {
          alert('Erro ao responder solicitação. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      alert('Erro ao responder solicitação. Verifique sua conexão.');
    }
  };

  // Função para remover amizade
  const removeFriend = async (friendshipId) => {
    if (!confirm('Tem certeza que deseja remover esta amizade?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/amizades/${friendshipId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Amizade removida');
        loadFriends();
        alert('Amizade removida com sucesso!');
      } else {
        const errorText = await response.text();
        console.error('Erro ao remover amizade:', errorText);
        alert('Erro ao remover amizade. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao remover amizade:', error);
      alert('Erro ao remover amizade. Verifique sua conexão.');
    }
  };

  // Função para alternar a barra lateral de amizades
  const toggleFriendsSidebar = () => {
    setIsFriendsSidebarOpen(!isFriendsSidebarOpen);

    if (!isFriendsSidebarOpen && user && user.id) {
      loadPendingRequests();
      loadFriends();
      loadUserReviews();
    }
  };

  // Função para obter avatar baseado no nome do usuário - ATUALIZADA PARA USAR O NOVO COMPONENTE
  const getUserAvatar = (userName) => {
    return (
      <UserAvatar
        userName={userName}
        size={24}
        backgroundColor="#4ade80"
        iconColor="#000000"
      />
    );
  };

  // Função para verificar se uma solicitação já foi enviada
  const isRequestSent = (targetUserId) => {
    return sentRequests.includes(targetUserId);
  };

  // Função para verificar se existe solicitação pendente
  const hasPendingRequest = (targetUserId) => {
    return pendingRequests.some(req =>
      (req.solicitante.id === user.id && req.solicitado.id === targetUserId) ||
      (req.solicitante.id === targetUserId && req.solicitado.id === user.id)
    );
  };

  // Função para verificar se são amigos
  const areFriends = (targetUserId) => {
    return friends.some(friend =>
      (friend.solicitante.id === targetUserId && friend.solicitado.id === user.id) ||
      (friend.solicitante.id === user.id && friend.solicitado.id === targetUserId)
    );
  };

  // Função para obter o status do botão de amizade
  const getFriendButtonStatus = (targetUserId) => {
    if (isRequestSent(targetUserId)) {
      return { text: 'Enviado', disabled: true, className: 'sent', icon: <Check size={16} color="#4ade80" /> };
    }

    if (hasPendingRequest(targetUserId)) {
      return { text: 'Pendente', disabled: true, className: 'pending', icon: <Clock size={16} color="#4ade80" /> };
    }

    if (areFriends(targetUserId)) {
      return { text: 'Amigos', disabled: true, className: 'friends', icon: <Check size={16} color="#4ade80" /> };
    }

    return { text: 'Adicionar', disabled: false, className: '', icon: <UserPlus size={16} color="#4ade80" /> };
  };

  // Função para obter o nome do amigo
  const getFriendName = (friendship) => {
    if (friendship.solicitante.id === user.id) {
      return friendship.solicitado.name;
    } else {
      return friendship.solicitante.name;
    }
  };

  // Função para obter o username do amigo
  const getFriendUsername = (friendship) => {
    if (friendship.solicitante.id === user.id) {
      return friendship.solicitado.username || friendship.solicitado.email;
    } else {
      return friendship.solicitante.username || friendship.solicitante.email;
    }
  };

  // Função chamada quando clica em um filme específico
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    const searchTermForSimilar = movie.searchTerm || movie.titulo || movie.Title || movie.title;
    fetchSimilarMovies(searchTermForSimilar);
  };

  // Função para voltar ao catálogo principal
  const handleBackToCatalog = () => {
    setSelectedMovie(null);
    setSimilarMovies([]);
    setMovieReviews([]);
  };

  // Função para limpar pesquisa
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Função para obter propriedades do filme (compatibilidade entre DTOs e dados locais)
  const getMovieProps = (movie) => {
    return {
      title: movie.title || movie.titulo || movie.Title,
      year: movie.year || movie.ano || movie.Year,
      poster: movie.poster || movie.Poster,
      description: movie.description || movie.plot || movie.Plot,
      imdbId: movie.imdbId || movie.imdbID,
      type: movie.tipo || movie.Type
    };
  };

  // Função para renderizar o conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <>
            <div className="friends-search-container">
              <div className="friends-search-input-wrapper">
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={friendSearchTerm}
                  onChange={(e) => setFriendSearchTerm(e.target.value)}
                  className="friends-search-input"
                />
                <div className="friends-search-icon">
                  {friendSearchLoading ? <Loader size={16} color="#4ade80" /> : <Search size={16} color="#4ade80" />}
                </div>
              </div>
            </div>

            <div className="friends-search-results">
              {friendSearchResults.length > 0 ? (
                friendSearchResults.map(foundUser => {
                  const buttonStatus = getFriendButtonStatus(foundUser.id);
                  return (
                    <div key={foundUser.id} className="friend-result-item">
                      <div className="friend-avatar">{getUserAvatar(foundUser.name)}</div>
                      <div className="friend-info">
                        <div className="friend-name">{foundUser.name}</div>
                        <div className="friend-username">@{foundUser.username || foundUser.email}</div>
                      </div>
                      <button
                        onClick={() => sendFriendRequest(foundUser.id)}
                        disabled={buttonStatus.disabled}
                        className={`add-friend-btn ${buttonStatus.className}`}
                      >
                        {buttonStatus.icon}
                        {buttonStatus.text}
                      </button>
                    </div>
                  );
                })
              ) : friendSearchTerm ? (
                <div className="no-friends-found">
                  <p>Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="friends-placeholder">
                  <p>Digite para buscar usuários</p>
                </div>
              )}
            </div>
          </>
        );

      case 'requests':
        return (
          <div className="friends-search-results">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(request => (
                <div key={request.id} className="friend-result-item">
                  <div className="friend-avatar">{getUserAvatar(request.solicitante.name)}</div>
                  <div className="friend-info">
                    <div className="friend-name">{request.solicitante.name}</div>
                    <div className="friend-username">@{request.solicitante.username || request.solicitante.email}</div>
                    <div className="request-date">
                      {new Date(request.dataCriacao).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="request-actions">
                    <button
                      onClick={() => respondToFriendRequest(request.id, true)}
                      className="accept-btn"
                    >
                      <Check size={16} color="#4ade80" />
                      Aceitar
                    </button>
                    <button
                      onClick={() => respondToFriendRequest(request.id, false)}
                      className="reject-btn"
                    >
                      <X size={16} color="#ef4444" />
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="friends-placeholder">
                <p>Nenhuma solicitação pendente</p>
              </div>
            )}
          </div>
        );

      case 'friends':
        return (
          <div className="friends-search-results">
            {friends.length > 0 ? (
              friends.map(friendship => (
                <div key={friendship.id} className="friend-result-item">
                  <div className="friend-avatar">{getUserAvatar(getFriendName(friendship))}</div>
                  <div className="friend-info">
                    <div className="friend-name">{getFriendName(friendship)}</div>
                    <div className="friend-username">@{getFriendUsername(friendship)}</div>
                    <div className="friendship-date">
                      Amigos desde {new Date(friendship.dataCriacao).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(friendship.id)}
                    className="remove-friend-btn"
                  >
                    <X size={16} color="#ef4444" />
                    Remover
                  </button>
                </div>
              ))
            ) : (
              <div className="friends-placeholder">
                <p>Você ainda não tem amigos</p>
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="friends-search-results">
            <div className="reviews-header">
              <h4>Meus Reviews</h4>
            </div>
            {userReviews.length > 0 ? (
              userReviews.map(review => (
                <div key={review.id} className="review-item user-review-item">
                  <div className="review-header">
                    <div className="review-movie-info">
                      <div className="review-movie-title">{review.movieTitle} ({review.movieYear})</div>
                      <div className="review-rating">
                        {renderStars(review.classificacao)}
                        <span className="rating-text">({review.classificacao}/10)</span>
                      </div>
                    </div>
                    <div className="review-actions">
                      <button
                        onClick={() => openReviewModal(review)}
                        className="edit-review-btn"
                      >
                        <Edit size={16} color="#4ade80" />
                        Editar
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="delete-review-btn"
                      >
                        <Trash2 size={16} color="#ef4444" />
                        Deletar
                      </button>
                    </div>
                  </div>
                  <div className="review-comment">
                    {review.comentario}
                  </div>
                </div>
              ))
            ) : (
              <div className="friends-placeholder">
                <p>Você ainda não fez nenhum review</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Se um filme foi selecionado, mostra a página de detalhes
  if (selectedMovie) {
    const movieProps = getMovieProps(selectedMovie);

    return (
      <div className="catalog-container">
        {/* Header - Página de detalhes do filme */}
        <header className="catalog-header">
          <div className="header-content">
            <div className="user-menu">
              <button
                className="menu-icon-btn"
                onClick={toggleFriendsSidebar}
                title="Menu"
              >
                <Menu size={24} color="#4ade80" />
                {pendingRequests.length > 0 && (
                  <span className="notification-badge">{pendingRequests.length}</span>
                )}
              </button>
              <span className="user-welcome">Olá, {user.name}!</span>
            </div>

            <button onClick={handleBackToCatalog} className="back-btn">
              <ArrowLeft size={17} color="#000000" />
              Voltar ao Catálogo
            </button>

            <button onClick={onLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </header>

        {/* Detalhes do filme selecionado */}
        <section className="movie-detail-section">
          <div className="movie-detail-container">
            <div className="movie-detail-poster">
              <img
                src={movieProps.poster !== 'N/A' ? movieProps.poster : '/placeholder-poster.jpg'}
                alt={movieProps.title}
                onError={(e) => {
                  e.target.src = '/placeholder-poster.jpg';
                }}
              />
            </div>
            <div className="movie-detail-info">
              <h1>{movieProps.title}</h1>
              <p className="movie-year">Ano: {movieProps.year}</p>
              <p className="movie-description">
                {movieProps.description || 'Descrição não disponível.'}
              </p>
              {selectedMovie.imdbRating && (
                <p className="movie-rating">
                  <Star size={16} color="#4ade80" fill="#4ade80" />
                  Avaliação IMDb: {selectedMovie.imdbRating}/10
                </p>
              )}

              {/* Botões de ação do filme - ADICIONADO BOTÃO ASSISTIR E WISHLIST */}
              <div className="movie-actions">
                <button
                  onClick={() => openVideoPlayer(selectedMovie)}
                  className="watch-btn"
                >
                  <Play size={15} color="#000000" />
                  Assistir Filme
                </button>

                <button
                  onClick={() => openReviewModal()}
                  className="review-btn"
                >
                  <Edit size={16} color="#4ade80" />
                  Fazer Review
                </button>

                <button
                  onClick={() => toggleWishlist(selectedMovie)}
                  className={`wishlist-btn ${isInWishlist(selectedMovie) ? 'in-wishlist' : ''}`}
                >
                  {isInWishlist(selectedMovie) ? (
                    <>
                      <Heart size={16} color="#ef4444" fill="#ef4444" />
                      Na Lista
                    </>
                  ) : (
                    <>
                      <Heart size={16} color="#4ade80" />
                      Adicionar à Lista
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Reviews do Filme - MODIFICADA PARA MOSTRAR APENAS REVIEWS DO USUÁRIO LOGADO */}
        <section className="movie-reviews-section">
          <h2>Meus Reviews deste Filme</h2>
          {reviewsLoading ? (
            <div className="loading">
              <Loader size={24} color="#4ade80" />
              Carregando reviews...
            </div>
          ) : (
            <div className="reviews-container">
              {movieReviews.length > 0 ? (
                movieReviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="review-avatar">{getUserAvatar(review.username)}</div>
                        <div className="review-user-info">
                          <div className="review-username">@{review.username}</div>
                          <div className="review-rating">
                            {renderStars(review.classificacao)}
                            <span className="rating-text">({review.classificacao}/10)</span>
                          </div>
                        </div>
                      </div>
                      <div className="review-actions">
                        <button
                          onClick={() => openReviewModal(review)}
                          className="edit-review-btn"
                        >
                          <Edit size={16} color="#4ade80" />
                          Editar
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="delete-review-btn"
                        >
                          <Trash2 size={16} color="#ef4444" />
                          Deletar
                        </button>
                      </div>
                    </div>
                    <div className="review-comment">
                      {review.comentario}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-reviews">Você ainda não fez nenhum review para este filme.</p>
              )}
            </div>
          )}
        </section>

        {/* Filmes similares/recomendados */}
        <section className="similar-movies-section">
          <h2>Filmes Similares</h2>
          {loading ? (
            <div className="loading">
              <Loader size={24} color="#4ade80" />
              Carregando filmes similares...
            </div>
          ) : (
            <div className="movies-grid">
              {similarMovies.length > 0 ? (
                similarMovies.slice(0, 12).map((movie, index) => {
                  const similarMovieProps = getMovieProps(movie);
                  return (
                    <div key={index} className="movie-card" onClick={() => handleMovieClick(movie)}>
                      <div className="movie-poster">
                        <img
                          src={similarMovieProps.poster !== 'N/A' ? similarMovieProps.poster : '/placeholder-poster.jpg'}
                          alt={similarMovieProps.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-poster.jpg';
                          }}
                        />
                        <div className="movie-overlay">
                          <div className="play-button">
                            <Play size={32} color="#000000" fill="#000000" />
                          </div>
                          <button
                            className="wishlist-overlay-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(movie);
                            }}
                          >
                            {isInWishlist(movie) ? (
                              <Heart size={20} color="#ef4444" fill="#ef4444" />
                            ) : (
                              <Heart size={20} color="#ffffff" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="movie-info">
                        <h3 className="movie-title">{similarMovieProps.title}</h3>
                        <div className="movie-details">
                          <span className="movie-year">{similarMovieProps.year}</span>
                          {movie.imdbRating && (
                            <span className="movie-rating">
                              <Star size={14} color="#4ade80" fill="#4ade80" />
                              {movie.imdbRating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Nenhum filme similar encontrado.</p>
              )}
            </div>
          )}
        </section>

        {/* Modal de Review */}
        {isReviewModalOpen && (
          <div className="modal-overlay" onClick={closeReviewModal}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingReview ? 'Editar Review' : 'Fazer Review'}</h3>
                <button onClick={closeReviewModal} className="close-modal-btn">
                  <X size={20} color="#4ade80" />
                </button>
              </div>
              <div className="modal-content">
                <div className="movie-info-modal">
                  <h4>{movieProps.title} ({movieProps.year})</h4>
                </div>

                <div className="rating-section">
                  <label>Classificação:</label>
                  {renderStars(reviewForm.classificacao, true, (rating) =>
                    setReviewForm(prev => ({ ...prev, classificacao: rating }))
                  )}
                  <span className="rating-text">({reviewForm.classificacao}/10)</span>
                </div>

                <div className="comment-section">
                  <label>Comentário:</label>
                  <textarea
                    value={reviewForm.comentario}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comentario: e.target.value }))}
                    placeholder="Escreva seu review sobre o filme..."
                    rows={6}
                    className="review-textarea"
                  />
                </div>

                <div className="modal-actions">
                  <button onClick={closeReviewModal} className="cancel-btn">
                    Cancelar
                  </button>
                  <button onClick={submitReview} className="submit-btn">
                    {editingReview ? 'Atualizar' : 'Publicar'} Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VideoPlayer Component */}
        {isVideoPlayerOpen && currentMovieForPlayer && (
          <VideoPlayer
            isOpen={isVideoPlayerOpen}
            onClose={closeVideoPlayer}
            movieTitle={getMovieProps(currentMovieForPlayer).title}
            movieYear={getMovieProps(currentMovieForPlayer).year}
          />
        )}

        {/* Barra Lateral */}
        <div className={`friends-sidebar ${isFriendsSidebarOpen ? 'open' : ''}`}>
          <div className="friends-sidebar-header">
            <h3>
              <Users size={20} color="#4ade80" />
              Menu
            </h3>
            <button onClick={toggleFriendsSidebar} className="close-sidebar-btn">
              <X size={20} color="#4ade80" />
            </button>
          </div>

          <div className="friends-tabs">
            <button
              className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Buscar
            </button>
            <button
              className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Solicitações ({pendingRequests.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Amigos ({friends.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({userReviews.length})
            </button>
          </div>

          {renderTabContent()}
        </div>

        {/* Overlay para fechar a barra lateral */}
        {isFriendsSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleFriendsSidebar}></div>
        )}
      </div>
    );
  }

  // Página principal do catálogo com categorias
  return (
    <div className="catalog-container">
      {/* Header - Página principal */}
      <header className="catalog-header">
        <div className="header-content">
          <div className="user-menu">
            <button
              className="menu-icon-btn"
              onClick={toggleFriendsSidebar}
              title="Menu"
            >
              <Menu size={24} color="#4ade80" />
              {pendingRequests.length > 0 && (
                <span className="notification-badge">{pendingRequests.length}</span>
              )}
            </button>
            <span className="user-welcome">Olá, {user.name}!</span>
          </div>

          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Pesquisar filmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icons">
                {searchLoading ? (
                  <div className="search-loading">
                    <Loader size={20} color="#4ade80" />
                  </div>
                ) : (
                  <>
                    <button className="search-icon">
                      <Search size={20} color="#4ade80" />
                    </button>
                    {searchTerm && (
                      <button
                        className="clear-search"
                        onClick={handleClearSearch}
                      >
                        <X size={20} color="#4ade80" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <button onClick={onLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      {/* Resultados da Pesquisa ou Categorias */}
      <main className="categories-main">
        {isSearching ? (
          <section className="search-results-section">
            <div className="search-results-header">
              <h2>Resultados da Pesquisa: "{searchTerm}"</h2>
              <button onClick={handleClearSearch} className="back-to-catalog-btn">
                <ArrowLeft size={16} color="#4ade80" />
                Voltar às Categorias
              </button>
            </div>

            {searchLoading ? (
              <div className="loading">
                <Loader size={24} color="#4ade80" />
                Pesquisando filmes...
              </div>
            ) : (
              <div className="movies-grid">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 20).map((movie, index) => {
                    const movieProps = getMovieProps(movie);
                    return (
                      <div
                        key={movieProps.imdbId || index}
                        className="movie-card"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <div className="movie-poster">
                          <img
                            src={movieProps.poster !== 'N/A' ? movieProps.poster : '/placeholder-poster.jpg'}
                            alt={movieProps.title}
                            onError={(e) => {
                              e.target.src = '/placeholder-poster.jpg';
                            }}
                          />
                          <div className="movie-overlay">
                            <div className="play-button">
                              <Play size={32} color="#000000" fill="#000000" />
                            </div>
                            <button
                              className="wishlist-overlay-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(movie);
                              }}
                            >
                              {isInWishlist(movie) ? (
                                <Heart size={20} color="#ef4444" fill="#ef4444" />
                              ) : (
                                <Heart size={20} color="#ffffff" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="movie-info">
                          <h3 className="movie-title">{movieProps.title}</h3>
                          <div className="movie-details">
                            <span className="movie-year">{movieProps.year}</span>
                            <span className="movie-type">{movieProps.type}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-results">
                    <h3>Nenhum filme encontrado</h3>
                    <p>Tente pesquisar com outros termos</p>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* CARROSSEL DA LISTA DE DESEJOS - NOVA SEÇÃO */}
            {wishlistMovies.length > 0 && (
              <section className="category-section">
                <h2 className="category-title">
                  <Heart size={20} color="#4ade80" fill="#4ade80" style={{ marginRight: '0.5rem' }} />
                  Minha Lista de Desejos ({wishlistMovies.length})
                </h2>

                <div className="movies-carousel">
                  <button
                    className="carousel-arrow left"
                    onClick={() => scrollCarousel('wishlist', 'left')}
                    disabled={!canScroll('wishlist', 'left')}
                    aria-label="Rolar para a esquerda"
                  >
                    <ChevronLeft size={24} color="#4ade80" />
                  </button>

                  <div
                    className="movies-row"
                    ref={el => carouselRefs.current['wishlist'] = el}
                  >
                    {wishlistMovies.map((movie, index) => {
                      const movieProps = getMovieProps(movie);
                      return (
                        <div
                          key={movieProps.imdbId || index}
                          className="movie-card carousel-card"
                          onClick={() => handleMovieClick(movie)}
                        >
                          <div className="movie-poster">
                            <img
                              src={movieProps.poster !== 'N/A' ? movieProps.poster : '/placeholder-poster.jpg'}
                              alt={movieProps.title}
                              onError={(e) => {
                                e.target.src = '/placeholder-poster.jpg';
                              }}
                            />
                            <div className="movie-overlay">
                              <div className="play-button">
                                <Play size={32} color="#000000" fill="#000000" />
                              </div>
                              <button
                                className="wishlist-overlay-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromWishlist(movie);
                                }}
                              >
                                <Heart size={20} color="#ef4444" fill="#ef4444" />
                              </button>
                            </div>
                          </div>
                          <div className="movie-info">
                            <h3 className="movie-title">{movieProps.title}</h3>
                            <span className="movie-year">{movieProps.year}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="carousel-arrow right"
                    onClick={() => scrollCarousel('wishlist', 'right')}
                    disabled={!canScroll('wishlist', 'right')}
                    aria-label="Rolar para a direita"
                  >
                    <ChevronRight size={24} color="#4ade80" />
                  </button>
                </div>
              </section>
            )}

            {/* CATEGORIAS ORIGINAIS */}
            {movieCategories.map(category => (
              <section key={category.id} className="category-section">
                <h2 className="category-title">{category.name}</h2>

                <div className="movies-carousel">
                  <button
                    className="carousel-arrow left"
                    onClick={() => scrollCarousel(category.id, 'left')}
                    disabled={!canScroll(category.id, 'left')}
                    aria-label="Rolar para a esquerda"
                  >
                    <ChevronLeft size={24} color="#4ade80" />
                  </button>

                  <div
                    className="movies-row"
                    ref={el => carouselRefs.current[category.id] = el}
                  >
                    {category.movies.map(movie => (
                      <div
                        key={movie.id}
                        className="movie-card carousel-card"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <div className="movie-poster">
                          <img src={movie.poster} alt={movie.title} />
                          <div className="movie-overlay">
                            <div className="play-button">
                              <Play size={32} color="#000000" fill="#000000" />
                            </div>
                            <button
                              className="wishlist-overlay-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(movie);
                              }}
                            >
                              {isInWishlist(movie) ? (
                                <Heart size={20} color="#ef4444" fill="#ef4444" />
                              ) : (
                                <Heart size={20} color="#ffffff" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="movie-info">
                          <h3 className="movie-title">{movie.title}</h3>
                          <span className="movie-year">{movie.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="carousel-arrow right"
                    onClick={() => scrollCarousel(category.id, 'right')}
                    disabled={!canScroll(category.id, 'right')}
                    aria-label="Rolar para a direita"
                  >
                    <ChevronRight size={24} color="#4ade80" />
                  </button>
                </div>
              </section>
            ))}
          </>
        )}
      </main>

      {/* VideoPlayer Component - TAMBÉM DISPONÍVEL NA PÁGINA PRINCIPAL */}
      {isVideoPlayerOpen && currentMovieForPlayer && (
        <VideoPlayer
          isOpen={isVideoPlayerOpen}
          onClose={closeVideoPlayer}
          movieTitle={getMovieProps(currentMovieForPlayer).title}
          movieYear={getMovieProps(currentMovieForPlayer).year}
        />
      )}

      {/* Barra Lateral - REMOVIDA A ABA WISHLIST */}
      <div className={`friends-sidebar ${isFriendsSidebarOpen ? 'open' : ''}`}>
        <div className="friends-sidebar-header">
          <h3>
            <Users size={20} color="#4ade80" />
            Menu
          </h3>
          <button onClick={toggleFriendsSidebar} className="close-sidebar-btn">
            <X size={20} color="#4ade80" />
          </button>
        </div>

        <div className="friends-tabs">
          <button
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Buscar
          </button>
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Solicitações ({pendingRequests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Amigos ({friends.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({userReviews.length})
          </button>
        </div>

        {renderTabContent()}
      </div>

      {/* Overlay para fechar a barra lateral */}
      {isFriendsSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleFriendsSidebar}></div>
      )}
    </div>
  );
};

export default MovieCatalog;


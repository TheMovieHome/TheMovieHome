import React, { useState, useEffect } from 'react';
import './Catalog.css';

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
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'requests', 'friends'

  // Categorias temáticas com filmes específicos
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
          searchTerm: 'exorcist'
        },
        {
          id: 'shining',
          title: 'O Iluminado',
          year: '1980',
          poster: 'https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg',
          description: 'Um escritor aceita um emprego como zelador de inverno em um hotel isolado.',
          searchTerm: 'shining'
        },
        {
          id: 'psycho',
          title: 'Psicose',
          year: '1960',
          poster: 'https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg',
          description: 'Uma secretária rouba dinheiro e foge para um motel isolado.',
          searchTerm: 'psycho'
        },
        {
          id: 'nightmare',
          title: 'A Hora do Pesadelo',
          year: '1984',
          poster: 'https://image.tmdb.org/t/p/original/avHGIO93jgCZLf33ec2aahgZJX6.jpg',
          description: 'Adolescentes são aterrorizados em seus sonhos por Freddy Krueger.',
          searchTerm: 'nightmare elm street'
        },
        {
          id: 'carrie',
          title: 'Carrie - A Estranha',
          year: '1976',
          poster: 'https://image.tmdb.org/t/p/w500/uc3OvgmbnYaS5Y0BOjSmC1EmSz1.jpg',
          description: 'Uma adolescente tímida e oprimida por sua mãe religiosa descobre poderes telecinéticos.',
          searchTerm: 'carrie'
        },
        {
          id: 'rosemarys-baby',
          title: 'O Bebê de Rosemary',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/original/nclYFGpVzfbiORO5ELVVdxzt9Vg.jpg',
          description: 'Uma jovem mulher grávida suspeita que seus vizinhos têm planos sinistros para seu bebê.',
          searchTerm: 'rosemarys baby'
        },
        {
          id: 'night-of-the-living-dead',
          title: 'A Noite dos Mortos-Vivos',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/w500/inNUOa9WZGdyRXQlt7eqmHtCttl.jpg',
          description: 'Um grupo de sobreviventes se refugia em uma fazenda isolada durante um apocalipse zumbi.',
          searchTerm: 'night of the living dead'
        },
        {
          id: 'halloween',
          title: 'Halloween',
          year: '1978',
          poster: 'https://image.tmdb.org/t/p/w500/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg',
          description: 'Michael Myers escapa de um hospital psiquiátrico e retorna à sua cidade natal para aterrorizar.',
          searchTerm: 'halloween'
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
          searchTerm: 'blade runner'
        },
        {
          id: 'alien',
          title: 'Alien',
          year: '1979',
          poster: 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
          description: 'A tripulação de uma nave espacial encontra uma forma de vida mortal.',
          searchTerm: 'alien'
        },
        {
          id: 'matrix',
          title: 'Matrix',
          year: '1999',
          poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
          description: 'Um hacker descobre que a realidade é uma simulação computacional.',
          searchTerm: 'matrix'
        },
        {
          id: 'terminator',
          title: 'O Exterminador do Futuro',
          year: '1984',
          poster: 'https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg',
          description: 'Um cyborg assassino é enviado do futuro para matar Sarah Connor.',
          searchTerm: 'terminator'
        },
        {
          id: 'metropolis',
          title: 'Metropolis',
          year: '1927',
          poster: 'https://image.tmdb.org/t/p/original/vZIJxGnjcswPCAa52jhbl01FQkV.jpg',
          description: 'Em uma cidade futurística dividida entre a classe trabalhadora e os planejadores da cidade, o filho do mestre da cidade se apaixona por uma mulher da classe trabalhadora.',
          searchTerm: 'metropolis'
        },
        {
          id: '2001-space-odyssey',
          title: '2001: Uma Odisseia no Espaço',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg',
          description: 'A humanidade encontra um misterioso artefato enterrado na superfície lunar e parte para descobrir suas origens com a ajuda do computador HAL 9000.',
          searchTerm: '2001 space odyssey'
        },
        {
          id: 'planet-of-the-apes',
          title: 'O Planeta dos Macacos',
          year: '1968',
          poster: 'https://image.tmdb.org/t/p/original/2r9iKnlSYEk4daQadsXfcjHfIjQ.jpg',
          description: 'Uma tripulação de astronautas colide com um planeta em um futuro distante, onde os macacos são inteligentes e a espécie dominante.',
          searchTerm: 'planet of the apes'
        },
        {
          id: 'terminator-2',
          title: 'O Exterminador do Futuro 2: O Julgamento Final',
          year: '1991',
          poster: 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg',
          description: 'Um ciborgue, idêntico ao que falhou em matar Sarah Connor, agora deve proteger o filho de dez anos dela, John, de um ciborgue ainda mais avançado e poderoso.',
          searchTerm: 'terminator 2 judgment day'
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
          searchTerm: 'die hard'
        },
        {
          id: 'predator',
          title: 'Predador',
          year: '1987',
          poster: 'https://image.tmdb.org/t/p/original/k3mW4qfJo6SKqe6laRyNGnbB9n5.jpg',
          description: 'Comandos em missão na selva enfrentam um caçador alienígena.',
          searchTerm: 'predator'
        },
        {
          id: 'top-gun',
          title: 'Top Gun',
          year: '1986',
          poster: 'https://image.tmdb.org/t/p/w500/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg',
          description: 'Jovens pilotos da Marinha competem na escola de elite Top Gun.',
          searchTerm: 'top gun'
        },
        {
          id: 'rocky',
          title: 'Rocky',
          year: '1976',
          poster: 'https://image.tmdb.org/t/p/original/uhX5kYBMcW9AT0FwWGElx19rpL6.jpg',
          description: 'Um boxeador amador tem a chance de lutar contra o campeão mundial.',
          searchTerm: 'rocky'
        },
        {
          id: 'die-hard-3',
          title: 'Duro de Matar 3: A Vingança',
          year: '1995',
          poster: 'https://image.tmdb.org/t/p/original/buqmCdFQEWwEpL3agGgg2GVjN2d.jpg',
          description: 'John McClane é forçado a sair da suspensão para jogar um jogo de Simon Says por um terrorista que plantou bombas por toda Nova York.',
          searchTerm: 'die hard with a vengeance'
        },
        {
          id: 'the-thing',
          title: 'O Enigma de Outro Mundo',
          year: '1982',
          poster: 'https://image.tmdb.org/t/p/w500/tzGY49kseSE9QAKk47uuDGwnSCu.jpg',
          description: 'Uma equipe de pesquisa na Antártida é caçada por um alienígena que muda de forma e assume a aparência de suas vítimas.',
          searchTerm: 'the thing'
        },
        {
          id: 'star-wars-iv',
          title: 'Star Wars: Episódio IV - Uma Nova Esperança',
          year: '1977',
          poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
          description: 'Luke Skywalker se une a um Cavaleiro Jedi, um piloto arrogante, um Wookiee e dois dróides para salvar a galáxia da estação de batalha destruidora de mundos do Império.',
          searchTerm: 'star wars a new hope'
        },
        {
          id: 'indiana-jones',
          title: 'Indiana Jones e os Caçadores da Arca Perdida',
          year: '1981',
          poster: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
          description: 'O arqueólogo Indiana Jones embarca em uma aventura para encontrar a lendária Arca da Aliança antes dos nazistas.',
          searchTerm: 'indiana jones raiders of the lost ark'
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
          searchTerm: 'ghostbusters'
        },
        {
          id: 'back-future',
          title: 'De Volta para o Futuro',
          year: '1985',
          poster: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
          description: 'Um adolescente viaja acidentalmente ao passado em uma máquina do tempo.',
          searchTerm: 'back to the future'
        },
        {
          id: 'groundhog',
          title: 'Feitiço do Tempo',
          year: '1993',
          poster: 'https://image.tmdb.org/t/p/original/gCgt1WARPZaXnq523ySQEUKinCs.jpg',
          description: 'Um meteorologista fica preso vivendo o mesmo dia repetidamente.',
          searchTerm: 'groundhog day'
        },
        {
          id: 'airplane',
          title: 'Apertem os Cintos... O Piloto Sumiu',
          year: '1980',
          poster: 'https://image.tmdb.org/t/p/original/7Q3efxd3AF1vQjlSxnlerSA7RzN.jpg',
          description: 'Comédia paródia sobre desastres em voos comerciais.',
          searchTerm: 'airplane'
        },
        {
          id: 'monty-python-holy-grail',
          title: 'Monty Python Em Busca do Cálice Sagrado',
          year: '1975',
          poster: 'https://image.tmdb.org/t/p/original/hWx1ANiWEWWyzKPN0us35HCGnhQ.jpg',
          description: 'O Rei Arthur e seus Cavaleiros da Távola Redonda embarcam em uma busca hilária pelo Santo Graal.',
          searchTerm: 'monty python holy grail'
        },
        {
          id: 'blazing-saddles',
          title: 'Banzé no Oeste',
          year: '1974',
          poster: 'https://image.tmdb.org/t/p/original/vNw1gOEDdYTDeNMuuq8OmiEHrfH.jpg',
          description: 'Um xerife negro é nomeado para uma cidade racista no Velho Oeste.',
          searchTerm: 'blazing saddles'
        },
        {
          id: 'animal-house',
          title: 'Clube dos Cafajestes',
          year: '1978',
          poster: 'https://image.tmdb.org/t/p/original/fWooBbipMRIKeSRhEzmeaDV0T8H.jpg',
          description: 'Um grupo de desajustados em uma fraternidade tenta se divertir enquanto enfrenta a administração da faculdade.',
          searchTerm: 'animal house'
        },
        {
          id: 'caddyshack',
          title: 'Clube dos Pilantras',
          year: '1980',
          poster: 'https://image.tmdb.org/t/p/original/lXnNz7zOXCsftMDVoU3VSo0Eioi.jpg',
          description: 'Um novo caddy se envolve com os membros excêntricos de um clube de golfe exclusivo.',
          searchTerm: 'caddyshack'
        }
      ]
    }
  ];

  // Função para buscar filmes similares via API
  const fetchSimilarMovies = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/movies/busca?termo=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      console.log('Resposta da API (similares):', data); // Debug

      // Primeiro tenta acessar 'Search' (conforme retornado pela API)
      if (data.Search && Array.isArray(data.Search)) {
        setSimilarMovies(data.Search);
      } else if (data.procura && Array.isArray(data.procura)) {
        // Fallback para 'procura'
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

      console.log('Resposta da API (pesquisa):', data); // Debug

      // Primeiro tenta acessar 'Search' (conforme retornado pela API)
      if (data.Search && Array.isArray(data.Search)) {
        setSearchResults(data.Search);
        setIsSearching(true);
      } else if (data.procura && Array.isArray(data.procura)) {
        // Fallback para 'procura'
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
      // Buscar usuários via API
      const response = await fetch(`http://localhost:8080/api/users/buscar?termo=${encodeURIComponent(term)}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const users = await response.json();
      console.log('Usuários encontrados:', users);

      // Filtrar o usuário atual da lista de resultados
      const filteredUsers = users.filter(foundUser => foundUser.id !== user.id);

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
    try {
      const response = await fetch(`http://localhost:8080/api/amizades/pendentes/${user.id}`);
      if (response.ok) {
        const requests = await response.json();
        setPendingRequests(requests);
        console.log('Solicitações pendentes carregadas:', requests);
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações pendentes:', error);
    }
  };

  // Função para carregar lista de amigos
  const loadFriends = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/amizades/amigos/${user.id}`);
      if (response.ok) {
        const friendsList = await response.json();
        setFriends(friendsList);
        console.log('Lista de amigos carregada:', friendsList);
      }
    } catch (error) {
      console.error('Erro ao carregar lista de amigos:', error);
    }
  };

  // Função para verificar se existe relacionamento entre dois usuários
  const checkExistingRelationship = async (userId1, userId2) => {
    try {
      // Primeiro verifica se existe qualquer relacionamento
      const response = await fetch(`http://localhost:8080/api/amizades/verificar?id1=${userId1}&id2=${userId2}`);

      if (response.ok) {
        const friendship = await response.json();
        return friendship; // Retorna a amizade aceita se existir
      } else if (response.status === 404) {
        // Não existe amizade aceita, mas pode existir pendente
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
    }
  }, [user]);

  // Função para enviar solicitação de amizade via API
  const sendFriendRequest = async (targetUserId) => {
    try {
      // Verificar se já existe uma amizade aceita
      const existingFriendship = await checkExistingRelationship(user.id, targetUserId);

      if (existingFriendship) {
        alert('Vocês já são amigos!');
        return;
      }

      // Verificar se já existe uma solicitação pendente
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

        // Adicionar à lista de solicitações enviadas para feedback visual
        setSentRequests(prev => [...prev, targetUserId]);

        // Recarregar solicitações pendentes
        loadPendingRequests();

        alert('Solicitação de amizade enviada com sucesso!');
      } else {
        const errorText = await response.text();
        console.error('Erro ao enviar solicitação:', errorText);

        // Tratar erros específicos do serviço
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
        console.log(`Solicitação ${accept ? 'aceita' : 'rejeitada'}`);

        // Recarregar listas
        loadPendingRequests();
        loadFriends();

        alert(`Solicitação ${accept ? 'aceita' : 'rejeitada'} com sucesso!`);
      } else {
        const errorText = await response.text();
        console.error('Erro ao responder solicitação:', errorText);

        if (errorText.includes('já foi respondida')) {
          alert('Esta solicitação já foi respondida.');
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

        // Recarregar lista de amigos
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

    // Recarregar dados quando abrir a barra lateral
    if (!isFriendsSidebarOpen && user && user.id) {
      loadPendingRequests();
      loadFriends();
    }
  };

  // Função para obter avatar baseado no nome do usuário
  const getUserAvatar = (userName) => {
    const avatars = ['👤', '👩', '👨', '👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🔬', '👩‍🏫', '👨‍⚕️', '👩‍⚕️'];
    const index = userName ? userName.length % avatars.length : 0;
    return avatars[index];
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
      return { text: '✓ Enviado', disabled: true, className: 'sent' };
    }

    if (hasPendingRequest(targetUserId)) {
      return { text: '⏳ Pendente', disabled: true, className: 'pending' };
    }

    if (areFriends(targetUserId)) {
      return { text: '✓ Amigos', disabled: true, className: 'friends' };
    }

    return { text: '+ Adicionar', disabled: false, className: '' };
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
    // Para filmes da pesquisa, usa o título para buscar similares
    const searchTermForSimilar = movie.searchTerm || movie.titulo || movie.Title || movie.title;
    fetchSimilarMovies(searchTermForSimilar);
  };

  // Função para voltar ao catálogo principal
  const handleBackToCatalog = () => {
    setSelectedMovie(null);
    setSimilarMovies([]);
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
                  {friendSearchLoading ? '⏳' : '🔍'}
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
                      ✓ Aceitar
                    </button>
                    <button
                      onClick={() => respondToFriendRequest(request.id, false)}
                      className="reject-btn"
                    >
                      ✕ Rejeitar
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
                    ✕ Remover
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
            {/* Logo - à esquerda */}
            <div className="logo">
              <h1>🎬 CineCatalog</h1>
            </div>

            {/* Botão de voltar */}
            <button onClick={handleBackToCatalog} className="back-btn">
              ← Voltar ao Catálogo
            </button>

            {/* Menu do usuário */}
            <div className="user-menu">
              <button onClick={toggleFriendsSidebar} className="friends-btn">
                👥 Amigos
                {pendingRequests.length > 0 && (
                  <span className="notification-badge">{pendingRequests.length}</span>
                )}
              </button>
              <span className="user-welcome">Olá, {user.name}!</span>
              <button onClick={onLogout} className="logout-btn">
                Sair
              </button>
            </div>
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
                <p className="movie-rating">⭐ Avaliação IMDb: {selectedMovie.imdbRating}/10</p>
              )}
            </div>
          </div>
        </section>

        {/* Filmes similares/recomendados */}
        <section className="similar-movies-section">
          <h2>Filmes Similares</h2>
          {loading ? (
            <div className="loading">Carregando filmes similares...</div>
          ) : (
            <div className="movies-grid">
              {similarMovies.length > 0 ? (
                similarMovies.slice(0, 12).map((movie, index) => {
                  const similarMovieProps = getMovieProps(movie);
                  return (
                    <div key={index} className="movie-card">
                      <div className="movie-poster">
                        <img
                          src={similarMovieProps.poster !== 'N/A' ? similarMovieProps.poster : '/placeholder-poster.jpg'}
                          alt={similarMovieProps.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-poster.jpg';
                          }}
                        />
                      </div>
                      <div className="movie-info">
                        <h3 className="movie-title">{similarMovieProps.title}</h3>
                        <div className="movie-details">
                          <span className="movie-year">{similarMovieProps.year}</span>
                          {movie.imdbRating && (
                            <span className="movie-rating">⭐ {movie.imdbRating}</span>
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

        {/* Barra Lateral de Amizades */}
        <div className={`friends-sidebar ${isFriendsSidebarOpen ? 'open' : ''}`}>
          <div className="friends-sidebar-header">
            <h3>👥 Gerenciar Amigos</h3>
            <button onClick={toggleFriendsSidebar} className="close-sidebar-btn">
              ✕
            </button>
          </div>

          {/* Abas para alternar entre buscar usuários e gerenciar amizades */}
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
          {/* Logo - à esquerda */}
          <div className="logo">
            <h1>🎬 CineCatalog</h1>
          </div>

          {/* Barra de Pesquisa - centralizada absolutamente */}
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
                  <div className="search-loading">⏳</div>
                ) : (
                  <>
                    <button className="search-icon">🔍</button>
                    {searchTerm && (
                      <button
                        className="clear-search"
                        onClick={handleClearSearch}
                      >
                        ✕
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu do usuário - à direita */}
          <div className="user-menu">
            <button onClick={toggleFriendsSidebar} className="friends-btn">
              👥 Amigos
              {pendingRequests.length > 0 && (
                <span className="notification-badge">{pendingRequests.length}</span>
              )}
            </button>
            <span className="user-welcome">Olá, {user.name}!</span>
            <button onClick={onLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Resultados da Pesquisa ou Categorias */}
      <main className="categories-main">
        {isSearching ? (
          // Resultados da pesquisa
          <section className="search-results-section">
            <div className="search-results-header">
              <h2>Resultados da Pesquisa: "{searchTerm}"</h2>
              <button onClick={handleClearSearch} className="back-to-catalog-btn">
                ← Voltar às Categorias
              </button>
            </div>

            {searchLoading ? (
              <div className="loading">Pesquisando filmes...</div>
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
                            <div className="play-button">▶</div>
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
          // Categorias temáticas
          movieCategories.map(category => (
            <section key={category.id} className="category-section">
              <h2 className="category-title">{category.name}</h2>

              <div className="movies-carousel">
                <div className="movies-row">
                  {category.movies.map(movie => (
                    <div
                      key={movie.id}
                      className="movie-card carousel-card"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className="movie-poster">
                        <img src={movie.poster} alt={movie.title} />
                        <div className="movie-overlay">
                          <div className="play-button">▶</div>
                        </div>
                      </div>
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <span className="movie-year">{movie.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}
      </main>

      {/* Barra Lateral de Amizades */}
      <div className={`friends-sidebar ${isFriendsSidebarOpen ? 'open' : ''}`}>
        <div className="friends-sidebar-header">
          <h3>👥 Gerenciar Amigos</h3>
          <button onClick={toggleFriendsSidebar} className="close-sidebar-btn">
            ✕
          </button>
        </div>

        {/* Abas para alternar entre buscar usuários e gerenciar amizades */}
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


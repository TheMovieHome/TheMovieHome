package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.dto.CriarReviewDTO;
import com.ricardocode.Syncine.dto.RetornoReviewDTO;
import com.ricardocode.Syncine.model.Review;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.repository.ReviewRepository;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UsuarioRepository usuarioRepository;


    public ReviewService(ReviewRepository reviewRepository,  UsuarioRepository usuarioRepository) {
        this.reviewRepository = reviewRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public RetornoReviewDTO criarReview(CriarReviewDTO criarReviewDTO, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(
                ()-> new IllegalStateException("usuario não encontrado"));

        Review newReview = new Review();
        newReview.setImdbId(criarReviewDTO.imdbId());
        newReview.setUsuario(usuario);
        newReview.setClassificacao(criarReviewDTO.classificacao());
        newReview.setTextoReview(criarReviewDTO.comentario());

        Review savedReview = reviewRepository.save(newReview);

        return new RetornoReviewDTO(
                savedReview.getId(),
                savedReview.getImdbId(),
                savedReview.getClassificacao(),
                savedReview.getTextoReview(),
                savedReview.getUsuario().getUsername()
        );
    }

    public List<RetornoReviewDTO> getReviewPorFilme(String imdbId) {
        return reviewRepository.findByImdbId(imdbId).stream()
                .map(review -> new RetornoReviewDTO(
                        review.getId(),
                        review.getImdbId(),
                        review.getClassificacao(),
                        review.getTextoReview(),
                        review.getUsuario().getUsername()
                )).collect(Collectors.toList());
    }

    public List<RetornoReviewDTO> getReviewsDoUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        return reviewRepository.findByUsuario(usuario).stream()
                .map(review -> new RetornoReviewDTO(
                        review.getId(),
                        review.getImdbId(),
                        review.getClassificacao(),
                        review.getTextoReview(),
                        review.getUsuario().getUsername()
                )).collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId, Long usuarioId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review não encontrada com o id: " + reviewId));

        if (!review.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalStateException("Acesso negado. Você não pode deletar a review de outra pessoa.");
        }

        reviewRepository.deleteById(reviewId);
    }

    public RetornoReviewDTO atualizarReview(Long reviewId, CriarReviewDTO reviewDto, Long usuarioId) {
        Review reviewExistente = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review não encontrada com o id: " + reviewId));

        if (!reviewExistente.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalStateException("Acesso negado. Você não pode editar a review de outra pessoa.");
        }

        reviewExistente.setClassificacao(reviewDto.classificacao());
        reviewExistente.setTextoReview(reviewDto.comentario());

        Review reviewAtualizada = reviewRepository.save(reviewExistente);

        return new RetornoReviewDTO(
                reviewAtualizada.getId(),
                reviewAtualizada.getImdbId(),
                reviewAtualizada.getClassificacao(),
                reviewAtualizada.getTextoReview(),
                reviewAtualizada.getUsuario().getUsername()
        );
    }
}


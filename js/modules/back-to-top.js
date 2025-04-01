/**
 * Luz Interior - Portal Espírita
 * Módulo de Botão Voltar ao Topo
 * js/modules/back-to-top.js
 * Versão: 1.0.0
 */

import { browserSupport } from '../main.js'

/**
 * Inicializa o botão de voltar ao topo
 */
export function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top')

  // Se não encontrar o botão, sai da função
  if (!backToTopButton) return

  // Adiciona event listener para scroll
  window.addEventListener('scroll', handleScroll)

  // Adiciona event listener para o botão
  backToTopButton.addEventListener('click', scrollToTop)

  /**
   * Gerencia a visibilidade do botão baseado no scroll
   */
  function handleScroll() {
    // Mostra o botão apenas quando o scroll ultrapassa 300px
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible')
    } else {
      backToTopButton.classList.remove('visible')
    }
  }

  /**
   * Rola a página para o topo suavemente
   */
  function scrollToTop() {
    // Verifica se o navegador suporta scroll suave
    if (browserSupport.smoothScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      // Fallback para navegadores que não suportam scroll suave
      window.scrollTo(0, 0)
    }
  }
}

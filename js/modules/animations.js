/**
 * Luz Interior - Portal Espírita
 * Módulo de Animações
 * js/modules/animations.js
 * Versão: 1.0.0
 */

import { browserSupport } from '../main.js'

/**
 * Inicializa as animações da página
 */
export function initAnimations() {
  // Verifica se o usuário prefere reduzir animações
  if (prefersReducedMotion()) {
    // Adiciona classe global para remover animações
    document.documentElement.classList.add('reduced-motion')
    return
  }

  // Inicializa animações de aparecimento ao scroll
  initScrollAnimations()

  // Inicializa animações específicas da página inicial
  initHomepageAnimations()

  // Inicializa animações para citações espirituais
  initQuoteAnimations()
}

/**
 * Verifica se o usuário prefere reduzir animações
 * @returns {boolean} True se o usuário prefere reduzir animações
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Inicializa animações ativadas ao rolar a página
 */
function initScrollAnimations() {
  // Elementos que serão animados ao aparecerem na tela
  const animatedElements = document.querySelectorAll('.animate-on-scroll')

  // Se não houver elementos para animar, sai da função
  if (!animatedElements.length) return

  // Configura o Intersection Observer se o navegador suportar
  if (browserSupport.intersectionObserver) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target

            // Adiciona a classe de animação com delay baseado no atributo data-delay
            const delay = element.dataset.delay || 0

            setTimeout(() => {
              // Adiciona a classe de animação específica
              const animationClass = element.dataset.animation || 'fade-in'
              element.classList.add(animationClass)

              // Adiciona classe de visibilidade
              element.classList.add('is-visible')

              // Remove o observador após animar
              observer.unobserve(element)
            }, delay)
          }
        })
      },
      {
        // Configura o threshold para 20% do elemento estar visível
        threshold: 0.2,
        // Adiciona uma margem para iniciar a animação um pouco antes
        rootMargin: '0px 0px -100px 0px'
      }
    )

    // Adiciona cada elemento ao observer
    animatedElements.forEach(element => {
      observer.observe(element)
    })
  } else {
    // Fallback para navegadores que não suportam Intersection Observer
    // Simplesmente mostra todos os elementos
    animatedElements.forEach(element => {
      element.classList.add('is-visible')

      // Adiciona a classe de animação específica
      const animationClass = element.dataset.animation || 'fade-in'
      element.classList.add(animationClass)
    })
  }
}

/**
 * Inicializa animações específicas da página inicial
 */
function initHomepageAnimations() {
  // Verifica se está na página inicial
  const heroSection = document.querySelector('.hero')
  if (!heroSection) return

  // Adiciona partículas à decoração da hero
  addHeroParticles()

  // Animação da seção de livros em destaque
  animateFeaturedBooks()
}

/**
 * Adiciona partículas animadas à seção hero
 */
function addHeroParticles() {
  const heroDecoration = document.querySelector('.hero__decoration')
  if (!heroDecoration) return

  // Limpa qualquer conteúdo existente
  while (heroDecoration.firstChild) {
    heroDecoration.removeChild(heroDecoration.firstChild)
  }

  // Cria 5 partículas
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('span')
    particle.style.top = `${Math.random() * 100}%`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 5}s`
    heroDecoration.appendChild(particle)
  }
}

/**
 * Anima a seção de livros em destaque
 */
function animateFeaturedBooks() {
  const bookCards = document.querySelectorAll('.featured-books .book-card')
  if (!bookCards.length) return

  bookCards.forEach((card, index) => {
    // Adiciona classe para animar
    card.classList.add('animate-on-scroll')
    card.dataset.animation = 'fade-in-up'
    card.dataset.delay = 100 * index
  })
}

/**
 * Inicializa animações para citações espirituais
 */
function initQuoteAnimations() {
  const quoteSection = document.querySelector('.quote-section')
  if (!quoteSection) return

  // Adiciona classe de animação ao texto da citação
  const quoteText = quoteSection.querySelector('.quote__text')
  if (quoteText) {
    quoteText.classList.add('animate-on-scroll')
    quoteText.dataset.animation = 'fade-in'
  }

  // Adiciona classe de animação ao autor da citação
  const quoteAuthor = quoteSection.querySelector('.quote__author')
  if (quoteAuthor) {
    quoteAuthor.classList.add('animate-on-scroll')
    quoteAuthor.dataset.animation = 'fade-in-up'
    quoteAuthor.dataset.delay = 300
  }
}

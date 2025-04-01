/**
 * Luz Interior - Portal Espírita
 * Módulo de Carrosséis
 * Versão: 1.0.0
 */

// Configurações padrão do carrossel
const defaultOptions = {
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  loop: true,
  navButtons: true,
  dots: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }
  ]
}

/**
 * Inicializa todos os carrosséis da página
 */
export function initCarousels() {
  // Carrossel de livros em destaque
  const booksCarousel = document.querySelector('.books-carousel')
  if (booksCarousel) {
    createCarousel(booksCarousel, {
      ...defaultOptions,
      autoplay: true,
      slidesToShow: 4
    })
  }

  // Outros carrosséis podem ser adicionados aqui
  const testimonialCarousel = document.querySelector('.testimonial-carousel')
  if (testimonialCarousel) {
    createCarousel(testimonialCarousel, {
      ...defaultOptions,
      slidesToShow: 1,
      dots: true
    })
  }
}

/**
 * Cria um carrossel em um elemento
 * @param {HTMLElement} element - Elemento do carrossel
 * @param {Object} options - Opções de configuração
 */
function createCarousel(element, options) {
  // Mescla opções padrão com as fornecidas
  const settings = { ...defaultOptions, ...options }

  // Armazena estado do carrossel
  const state = {
    currentSlide: 0,
    totalSlides: 0,
    slideWidth: 0,
    isTransitioning: false,
    autoplayInterval: null,
    slides: [],
    container: null,
    track: null,
    nextButton: null,
    prevButton: null,
    dots: []
  }

  // Inicializa o carrossel
  function init() {
    // Configura a estrutura do DOM
    setupDOM()

    // Calcula dimensões
    calculateDimensions()

    // Adiciona os elementos de navegação
    if (settings.navButtons) {
      addNavigationButtons()
    }

    if (settings.dots) {
      addDots()
    }

    // Configura os slides iniciais
    setupSlides()

    // Adiciona event listeners
    attachEventListeners()

    // Inicia autoplay se configurado
    if (settings.autoplay) {
      startAutoplay()
    }

    // Marca como inicializado
    element.classList.add('carousel-initialized')
  }

  /**
   * Configura a estrutura do DOM para o carrossel
   */
  function setupDOM() {
    // Captura os slides existentes
    state.slides = Array.from(element.children).filter(
      child => !child.classList.contains('carousel-btn')
    )
    state.totalSlides = state.slides.length

    // Cria container e track
    state.container = document.createElement('div')
    state.container.classList.add('carousel__container')

    state.track = document.createElement('div')
    state.track.classList.add('carousel__track')

    // Move os slides para dentro do track
    state.slides.forEach(slide => {
      slide.classList.add('carousel__slide')
      state.track.appendChild(slide)
    })

    // Monta a estrutura
    state.container.appendChild(state.track)

    // Limpa o elemento original e adiciona a nova estrutura
    Array.from(element.children).forEach(child => {
      if (!child.classList.contains('carousel-btn')) {
        element.removeChild(child)
      }
    })

    element.prepend(state.container)

    // Adiciona classe base ao elemento
    element.classList.add('carousel')
  }

  /**
   * Calcula as dimensões do carrossel
   */
  function calculateDimensions() {
    const containerWidth = state.container.clientWidth
    state.slideWidth = containerWidth / settings.slidesToShow

    // Aplica largura aos slides
    state.slides.forEach(slide => {
      slide.style.width = `${state.slideWidth}px`
    })

    // Aplica largura total ao track (com margem para clones em loop)
    state.track.style.width = `${
      state.slideWidth * (state.totalSlides + 2 * settings.slidesToShow)
    }px`

    // Posiciona na primeira slide real
    updateSlidePosition()
  }

  /**
   * Adiciona botões de navegação
   */
  function addNavigationButtons() {
    // Verifica se já existem botões
    state.prevButton = element.querySelector('.carousel-btn--prev')
    state.nextButton = element.querySelector('.carousel-btn--next')

    // Cria botões se não existirem
    if (!state.prevButton) {
      state.prevButton = document.createElement('button')
      state.prevButton.classList.add('carousel-btn', 'carousel-btn--prev')
      state.prevButton.setAttribute('aria-label', 'Anterior')
      state.prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>'
      element.appendChild(state.prevButton)
    }

    if (!state.nextButton) {
      state.nextButton = document.createElement('button')
      state.nextButton.classList.add('carousel-btn', 'carousel-btn--next')
      state.nextButton.setAttribute('aria-label', 'Próximo')
      state.nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'
      element.appendChild(state.nextButton)
    }
  }

  /**
   * Adiciona indicadores de slides (dots)
   */
  function addDots() {
    const dotsContainer = document.createElement('div')
    dotsContainer.classList.add('carousel__dots')

    for (
      let i = 0;
      i < Math.ceil(state.totalSlides / settings.slidesToScroll);
      i++
    ) {
      const dot = document.createElement('button')
      dot.classList.add('carousel__dot')
      dot.setAttribute('aria-label', `Slide ${i + 1}`)

      if (i === 0) {
        dot.classList.add('active')
      }

      dot.addEventListener('click', () => {
        goToSlide(i * settings.slidesToScroll)
      })

      dotsContainer.appendChild(dot)
      state.dots.push(dot)
    }

    element.appendChild(dotsContainer)
  }

  /**
   * Configura slides para carrossel infinito
   */
  function setupSlides() {
    if (settings.loop) {
      // Clone últimos slides para o início
      for (let i = 0; i < settings.slidesToShow; i++) {
        const index = state.totalSlides - 1 - i
        if (index >= 0) {
          const clone = state.slides[index].cloneNode(true)
          clone.classList.add('clone')
          state.track.insertBefore(clone, state.track.firstChild)
        }
      }

      // Clone primeiros slides para o final
      for (let i = 0; i < settings.slidesToShow; i++) {
        if (i < state.totalSlides) {
          const clone = state.slides[i].cloneNode(true)
          clone.classList.add('clone')
          state.track.appendChild(clone)
        }
      }

      // Ajusta posição inicial
      state.currentSlide = settings.slidesToShow
      updateSlidePosition(0)
    }
  }

  /**
   * Adiciona event listeners
   */
  function attachEventListeners() {
    // Botões de navegação
    if (state.prevButton) {
      state.prevButton.addEventListener('click', prevSlide)
    }

    if (state.nextButton) {
      state.nextButton.addEventListener('click', nextSlide)
    }

    // Redimensionamento da janela
    window.addEventListener(
      'resize',
      debounce(() => {
        calculateDimensions()
      }, 200)
    )

    // Pausa autoplay ao passar o mouse
    if (settings.pauseOnHover && settings.autoplay) {
      element.addEventListener('mouseenter', stopAutoplay)
      element.addEventListener('mouseleave', startAutoplay)
    }

    // Adiciona navegação por toque
    let startX,
      moveX,
      threshold = 50
    let isDragging = false

    element.addEventListener(
      'touchstart',
      e => {
        stopAutoplay()
        startX = e.touches[0].clientX
        isDragging = true
      },
      { passive: true }
    )

    element.addEventListener(
      'touchmove',
      e => {
        if (!isDragging) return
        moveX = e.touches[0].clientX
      },
      { passive: true }
    )

    element.addEventListener(
      'touchend',
      e => {
        if (!isDragging) return
        isDragging = false

        if (startX && moveX) {
          const diff = startX - moveX

          if (Math.abs(diff) > threshold) {
            if (diff > 0) {
              nextSlide()
            } else {
              prevSlide()
            }
          }
        }

        startX = null
        moveX = null

        if (settings.autoplay) {
          startAutoplay()
        }
      },
      { passive: true }
    )
  }

  /**
   * Atualiza a posição dos slides
   */
  function updateSlidePosition(transition = 300) {
    const offset = -state.currentSlide * state.slideWidth

    state.track.style.transition = transition
      ? `transform ${transition}ms ease`
      : 'none'
    state.track.style.transform = `translateX(${offset}px)`

    // Atualiza dots
    if (settings.dots) {
      const activeDotIndex = Math.floor(
        (state.currentSlide - (settings.loop ? settings.slidesToShow : 0)) /
          settings.slidesToScroll
      )
      state.dots.forEach((dot, index) => {
        if (index === activeDotIndex) {
          dot.classList.add('active')
        } else {
          dot.classList.remove('active')
        }
      })
    }
  }

  /**
   * Vai para o slide anterior
   */
  function prevSlide() {
    if (state.isTransitioning) return

    state.isTransitioning = true
    state.currentSlide -= settings.slidesToScroll

    updateSlidePosition()

    if (settings.loop) {
      // Verifica se precisa voltar ao final
      if (state.currentSlide < settings.slidesToShow) {
        setTimeout(() => {
          state.currentSlide =
            state.totalSlides +
            (settings.slidesToShow - settings.slidesToScroll)
          updateSlidePosition(0)
          state.isTransitioning = false
        }, 300)
      } else {
        setTimeout(() => {
          state.isTransitioning = false
        }, 300)
      }
    } else {
      // Limita ao primeiro slide
      if (state.currentSlide < 0) {
        state.currentSlide = 0
        updateSlidePosition()
      }

      setTimeout(() => {
        state.isTransitioning = false
      }, 300)
    }

    resetAutoplay()
  }

  /**
   * Vai para o próximo slide
   */
  function nextSlide() {
    if (state.isTransitioning) return

    state.isTransitioning = true
    state.currentSlide += settings.slidesToScroll

    updateSlidePosition()

    if (settings.loop) {
      // Verifica se precisa voltar ao início
      if (state.currentSlide >= state.totalSlides + settings.slidesToShow) {
        setTimeout(() => {
          state.currentSlide = settings.slidesToShow
          updateSlidePosition(0)
          state.isTransitioning = false
        }, 300)
      } else {
        setTimeout(() => {
          state.isTransitioning = false
        }, 300)
      }
    } else {
      // Limita ao último slide
      const maxSlide = state.totalSlides - settings.slidesToShow
      if (state.currentSlide > maxSlide) {
        state.currentSlide = maxSlide
        updateSlidePosition()
      }

      setTimeout(() => {
        state.isTransitioning = false
      }, 300)
    }

    resetAutoplay()
  }

  /**
   * Vai para um slide específico
   */
  function goToSlide(index) {
    if (state.isTransitioning) return

    state.isTransitioning = true

    const targetSlide = settings.loop ? index + settings.slidesToShow : index
    state.currentSlide = targetSlide

    updateSlidePosition()

    setTimeout(() => {
      state.isTransitioning = false
    }, 300)

    resetAutoplay()
  }

  /**
   * Inicia o autoplay
   */
  function startAutoplay() {
    if (!settings.autoplay) return

    stopAutoplay()

    state.autoplayInterval = setInterval(() => {
      nextSlide()
    }, settings.autoplaySpeed)
  }

  /**
   * Para o autoplay
   */
  function stopAutoplay() {
    if (state.autoplayInterval) {
      clearInterval(state.autoplayInterval)
      state.autoplayInterval = null
    }
  }

  /**
   * Reinicia o autoplay
   */
  function resetAutoplay() {
    if (settings.autoplay) {
      stopAutoplay()
      startAutoplay()
    }
  }

  /**
   * Utilitário para debounce de funções
   */
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Inicializa o carrossel
  init()

  // Retorna API pública
  return {
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide,
    refresh: calculateDimensions,
    play: startAutoplay,
    pause: stopAutoplay
  }
}

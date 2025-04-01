/**
 * Luz Interior - Portal Espírita
 * JavaScript Principal
 * Versão: 1.0.0
 */

// Importação de módulos
import { initThemeToggle } from './modules/theme-toggle.js'
import { initBackToTop } from './modules/back-to-top.js'
import { initMobileMenu } from './modules/mobile-menu.js'
import { initCookieConsent } from './modules/cookie-consent.js'
import { initNotifications } from './modules/notifications.js'
import { initAnimations } from './modules/animations.js'
import { initCarousels } from './modules/carousels.js'
import { initModals } from './modules/modals.js'

// Função de inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('Luz Interior - Inicializando aplicação...')

  // Inicializa todos os módulos
  initThemeToggle()
  initBackToTop()
  initMobileMenu()
  initCookieConsent()
  initNotifications()
  initAnimations()
  initCarousels()
  initModals()

  // Verifica se há hash na URL para navegação interna
  handleHashNavigation()

  // Adiciona listener para mudanças de hash
  window.addEventListener('hashchange', handleHashNavigation)

  // Inicializa tooltips
  initTooltips()

  // Adiciona comportamento aos links externos
  handleExternalLinks()

  console.log('Luz Interior - Aplicação inicializada com sucesso!')
})

/**
 * Gerencia a navegação por hash na URL
 */
function handleHashNavigation() {
  const hash = window.location.hash
  if (hash) {
    // Remove o # do início
    const targetId = hash.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Pequeno delay para garantir que outros scripts foram carregados
      setTimeout(() => {
        const headerOffset = document.querySelector('.header').offsetHeight
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset - 20

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }, 100)
    }
  }
}

/**
 * Inicializa tooltips
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]')

  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      const tooltipText = element.getAttribute('data-tooltip')

      // Cria o elemento tooltip
      const tooltip = document.createElement('div')
      tooltip.classList.add('tooltip')
      tooltip.textContent = tooltipText

      // Adiciona o tooltip ao body
      document.body.appendChild(tooltip)

      // Posiciona o tooltip
      const rect = element.getBoundingClientRect()
      tooltip.style.top = `${
        rect.top - tooltip.offsetHeight - 10 + window.scrollY
      }px`
      tooltip.style.left = `${
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + window.scrollX
      }px`

      // Adiciona classe para mostrar com animação
      setTimeout(() => {
        tooltip.classList.add('tooltip--visible')
      }, 10)

      // Armazena referência ao tooltip no elemento
      element._tooltip = tooltip
    })

    element.addEventListener('mouseleave', () => {
      if (element._tooltip) {
        element._tooltip.classList.remove('tooltip--visible')

        // Remove o tooltip após a animação
        setTimeout(() => {
          if (element._tooltip && element._tooltip.parentNode) {
            element._tooltip.parentNode.removeChild(element._tooltip)
            element._tooltip = null
          }
        }, 300)
      }
    })
  })
}

/**
 * Gerencia o comportamento de links externos
 */
function handleExternalLinks() {
  const externalLinks = document.querySelectorAll(
    'a[href^="http"]:not([href*="' + window.location.hostname + '"])'
  )

  externalLinks.forEach(link => {
    // Adiciona atributos de segurança para links externos
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')

    // Adiciona ícone para links externos se não existir
    if (!link.querySelector('.external-link-icon')) {
      const icon = document.createElement('i')
      icon.classList.add('fas', 'fa-external-link-alt', 'external-link-icon')
      link.appendChild(document.createTextNode(' '))
      link.appendChild(icon)
    }
  })
}

/**
 * Utilitário para detectar suporte a recursos do navegador
 */
export const browserSupport = {
  localStorage: (function () {
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      return true
    } catch (e) {
      return false
    }
  })(),

  webp: (function () {
    const canvas = document.createElement('canvas')
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
    return false
  })(),

  intersectionObserver: 'IntersectionObserver' in window,

  touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,

  passiveEvents: (function () {
    let supportsPassive = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true
          return true
        }
      })
      window.addEventListener('testPassive', null, opts)
      window.removeEventListener('testPassive', null, opts)
    } catch (e) {}
    return supportsPassive
  })()
}

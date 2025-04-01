/**
 * Luz Interior - Portal Espírita
 * Módulo de Alternância de Tema (claro/escuro)
 * Versão: 1.0.0
 */

import { browserSupport } from '../main.js'

// Constantes
const THEME_KEY = 'luz_interior_theme'
const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'
const AUTO_THEME = 'auto'

/**
 * Inicializa o alternador de tema
 */
export function initThemeToggle() {
  // Verifica o tema atual (salvo, preferência do sistema ou padrão)
  const currentTheme = getCurrentTheme()

  // Aplica o tema atual
  applyTheme(currentTheme)

  // Adiciona listener para o botão de alternar tema
  const themeToggleButtons = document.querySelectorAll('.theme-toggle')

  themeToggleButtons.forEach(button => {
    button.addEventListener('click', toggleTheme)

    // Atualiza aparência do botão
    updateThemeToggleButton(button, currentTheme)
  })

  // Adiciona listener para mudanças na preferência do sistema
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    mediaQuery.addEventListener('change', e => {
      const savedTheme = getSavedTheme()

      // Se o tema estiver como "auto", atualiza conforme a preferência do sistema
      if (savedTheme === AUTO_THEME) {
        const newTheme = e.matches ? DARK_THEME : LIGHT_THEME
        applyTheme(newTheme)

        // Atualiza aparência dos botões
        themeToggleButtons.forEach(button => {
          updateThemeToggleButton(button, AUTO_THEME)
        })
      }
    })
  }
}

/**
 * Obtém o tema atual com base nas preferências salvas ou do sistema
 */
function getCurrentTheme() {
  const savedTheme = getSavedTheme()

  if (savedTheme === AUTO_THEME) {
    return getSystemTheme()
  }

  return savedTheme || LIGHT_THEME // Padrão é tema claro
}

/**
 * Obtém o tema salvo no localStorage
 */
function getSavedTheme() {
  if (browserSupport.localStorage) {
    return localStorage.getItem(THEME_KEY)
  }
  return null
}

/**
 * Obtém a preferência de tema do sistema
 */
function getSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return DARK_THEME
  }
  return LIGHT_THEME
}

/**
 * Salva o tema no localStorage
 */
function saveTheme(theme) {
  if (browserSupport.localStorage) {
    localStorage.setItem(THEME_KEY, theme)
  }
}

/**
 * Aplica o tema ao documento
 */
function applyTheme(theme) {
  const actualTheme = theme === AUTO_THEME ? getSystemTheme() : theme

  if (actualTheme === DARK_THEME) {
    document.documentElement.setAttribute('data-theme', DARK_THEME)
  } else {
    document.documentElement.removeAttribute('data-theme')
  }

  // Atualiza a meta tag theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    const color = actualTheme === DARK_THEME ? '#121212' : '#6a5acd'
    metaThemeColor.setAttribute('content', color)
  }
}

/**
 * Alterna entre os temas
 */
function toggleTheme() {
  const currentTheme = getSavedTheme() || LIGHT_THEME
  let newTheme

  // Ciclo: claro -> escuro -> claro
  if (currentTheme === LIGHT_THEME) {
    newTheme = DARK_THEME
  } else {
    newTheme = LIGHT_THEME
  }

  // Salva e aplica o novo tema
  saveTheme(newTheme)
  applyTheme(newTheme)

  // Atualiza aparência dos botões
  const themeToggleButtons = document.querySelectorAll('.theme-toggle')
  themeToggleButtons.forEach(button => {
    updateThemeToggleButton(button, newTheme)
  })

  // Mostra notificação se o módulo existir
  if (typeof showNotification === 'function') {
    const message =
      newTheme === DARK_THEME ? 'Modo escuro ativado' : 'Modo claro ativado'

    showNotification(message, 'info')
  }
}

/**
 * Atualiza a aparência do botão de alternância de tema
 */
function updateThemeToggleButton(button, theme) {
  const sunIcon = button.querySelector('.theme-toggle__icon--light')
  const moonIcon = button.querySelector('.theme-toggle__icon--dark')

  const actualTheme = theme === AUTO_THEME ? getSystemTheme() : theme

  if (actualTheme === DARK_THEME) {
    // Mostra o ícone do sol quando estiver no modo escuro
    if (sunIcon) sunIcon.style.display = 'block'
    if (moonIcon) moonIcon.style.display = 'none'
    button.setAttribute('aria-label', 'Alternar para modo claro')
  } else {
    // Mostra o ícone da lua quando estiver no modo claro
    if (sunIcon) sunIcon.style.display = 'none'
    if (moonIcon) moonIcon.style.display = 'block'
    button.setAttribute('aria-label', 'Alternar para modo escuro')
  }
}

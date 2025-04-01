/**
 * Luz Interior - Portal Espírita
 * Módulo de Consentimento de Cookies
 * js/modules/cookie-consent.js
 * Versão: 1.0.0
 */

import { browserSupport } from '../main.js'

const COOKIE_CONSENT_KEY = 'luz_interior_cookie_consent'
const COOKIE_SETTINGS_KEY = 'luz_interior_cookie_settings'

// Configurações padrão de cookies
const defaultSettings = {
  necessary: true, // Cookies necessários - sempre ativos
  preferences: true, // Cookies de preferências (ex: tema escuro)
  analytics: true, // Cookies de análise (ex: Google Analytics)
  marketing: false // Cookies de marketing
}

/**
 * Inicializa o aviso de consentimento de cookies
 */
export function initCookieConsent() {
  // Verifica se o navegador suporta armazenamento local
  if (!browserSupport.localStorage) {
    console.warn(
      'Navegador não suporta localStorage. Consentimento de cookies desabilitado.'
    )
    return
  }

  // Elementos do DOM
  const cookieConsent = document.querySelector('.cookie-consent')

  // Se não encontrar o elemento, sai da função
  if (!cookieConsent) return

  // Verifica se o usuário já deu consentimento
  const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY)

  if (!hasConsent) {
    // Mostra o aviso de cookies
    setTimeout(() => {
      cookieConsent.classList.add('show')
    }, 1000)

    // Adiciona event listeners aos botões
    setupEventListeners(cookieConsent)
  } else {
    // Carrega as configurações salvas
    loadSavedSettings()
  }
}

/**
 * Configura os event listeners para os botões do aviso de cookies
 * @param {HTMLElement} cookieConsent - Elemento do aviso de cookies
 */
function setupEventListeners(cookieConsent) {
  // Botão de aceitar todos os cookies
  const acceptButton = cookieConsent.querySelector('.cookie-consent__accept')
  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      acceptAllCookies()
      hideCookieConsent(cookieConsent)
    })
  }

  // Botão de configurações de cookies
  const settingsButton = cookieConsent.querySelector(
    '.cookie-consent__settings'
  )
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      showCookieSettings(cookieConsent)
    })
  }
}

/**
 * Aceita todos os cookies e salva as configurações
 */
function acceptAllCookies() {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
  localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(defaultSettings))

  // Chama funções para ativar os recursos correspondentes
  applySettings(defaultSettings)

  // Notifica o usuário se a função existir
  if (typeof showNotification === 'function') {
    showNotification('Preferências de cookies salvas!', 'success', 3000)
  }
}

/**
 * Salva as configurações personalizadas de cookies
 * @param {Object} settings - Configurações de cookies
 */
function saveCustomSettings(settings) {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
  localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(settings))

  // Chama funções para ativar os recursos correspondentes
  applySettings(settings)

  // Notifica o usuário se a função existir
  if (typeof showNotification === 'function') {
    showNotification('Preferências de cookies salvas!', 'success', 3000)
  }
}

/**
 * Esconde o aviso de cookies
 * @param {HTMLElement} cookieConsent - Elemento do aviso de cookies
 */
function hideCookieConsent(cookieConsent) {
  cookieConsent.classList.remove('show')
}

/**
 * Mostra as configurações detalhadas de cookies
 * @param {HTMLElement} cookieConsent - Elemento do aviso de cookies
 */
function showCookieSettings(cookieConsent) {
  // Verifica se já existe o container de configurações
  let cookieSettings = cookieConsent.querySelector('.cookie-settings')

  if (!cookieSettings) {
    // Cria o container de configurações
    cookieSettings = document.createElement('div')
    cookieSettings.className = 'cookie-settings'

    // Adiciona conteúdo ao container
    cookieSettings.innerHTML = `
            <div class="cookie-settings__group">
                <div class="cookie-settings__header">
                    <h3 class="cookie-settings__title">Cookies Necessários</h3>
                    <label class="switch">
                        <input type="checkbox" checked disabled>
                        <span class="switch__slider"></span>
                    </label>
                </div>
                <p class="cookie-settings__description">Cookies essenciais para o funcionamento do site. Não podem ser desativados.</p>
            </div>
            
            <div class="cookie-settings__group">
                <div class="cookie-settings__header">
                    <h3 class="cookie-settings__title">Cookies de Preferências</h3>
                    <label class="switch">
                        <input type="checkbox" name="preferences" checked>
                        <span class="switch__slider"></span>
                    </label>
                </div>
                <p class="cookie-settings__description">Permitem que o site se lembre de escolhas que você fez, como seu tema preferido.</p>
            </div>
            
            <div class="cookie-settings__group">
                <div class="cookie-settings__header">
                    <h3 class="cookie-settings__title">Cookies de Análise</h3>
                    <label class="switch">
                        <input type="checkbox" name="analytics" checked>
                        <span class="switch__slider"></span>
                    </label>
                </div>
                <p class="cookie-settings__description">Ajudam-nos a entender como os visitantes interagem com o site, permitindo melhorar a experiência.</p>
            </div>
            
            <div class="cookie-settings__group">
                <div class="cookie-settings__header">
                    <h3 class="cookie-settings__title">Cookies de Marketing</h3>
                    <label class="switch">
                        <input type="checkbox" name="marketing">
                        <span class="switch__slider"></span>
                    </label>
                </div>
                <p class="cookie-settings__description">Usados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes e envolventes.</p>
            </div>
            
            <div class="cookie-settings__actions">
                <button class="btn btn--primary cookie-settings__save">Salvar Preferências</button>
            </div>
        `

    // Adiciona o container ao aviso de cookies
    cookieConsent
      .querySelector('.cookie-consent__content')
      .appendChild(cookieSettings)

    // Adiciona event listener ao botão de salvar
    const saveButton = cookieSettings.querySelector('.cookie-settings__save')
    saveButton.addEventListener('click', () => {
      const settings = {
        necessary: true,
        preferences: cookieSettings.querySelector('input[name="preferences"]')
          .checked,
        analytics: cookieSettings.querySelector('input[name="analytics"]')
          .checked,
        marketing: cookieSettings.querySelector('input[name="marketing"]')
          .checked
      }

      saveCustomSettings(settings)
      hideCookieConsent(cookieConsent)
    })
  }

  // Mostra as configurações
  cookieSettings.classList.add('show')
}

/**
 * Carrega as configurações salvas de cookies
 */
function loadSavedSettings() {
  try {
    const savedSettings = localStorage.getItem(COOKIE_SETTINGS_KEY)

    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      applySettings(settings)
    } else {
      // Se não houver configurações salvas, usa as padrão
      applySettings(defaultSettings)
    }
  } catch (error) {
    console.error('Erro ao carregar configurações de cookies:', error)

    // Em caso de erro, usa as configurações padrão
    applySettings(defaultSettings)
  }
}

/**
 * Aplica as configurações de cookies ativando os recursos correspondentes
 * @param {Object} settings - Configurações de cookies
 */
function applySettings(settings) {
  // Ativa ou desativa os recursos com base nas configurações

  // Exemplo: Cookies de preferências (tema escuro)
  if (settings.preferences) {
    // Carrega o tema salvo, se existir
    const savedTheme = localStorage.getItem('luz_interior_theme')
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }

  // Exemplo: Cookies de análise (Google Analytics)
  if (settings.analytics) {
    initAnalytics()
  }

  // Exemplo: Cookies de marketing
  if (settings.marketing) {
    initMarketing()
  }
}

/**
 * Inicializa ferramentas de análise como Google Analytics
 * Apenas como exemplo - não implementa realmente o GA
 */
function initAnalytics() {
  console.log('Analytics inicializado')

  // Código de exemplo - não faz nada real
  // Em um site real, você adicionaria o código do Google Analytics aqui
}

/**
 * Inicializa ferramentas de marketing
 * Apenas como exemplo - não implementa realmente
 */
function initMarketing() {
  console.log('Marketing inicializado')

  // Código de exemplo - não faz nada real
  // Em um site real, você adicionaria o código de ferramentas de marketing aqui
}

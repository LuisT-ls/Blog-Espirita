/**
 * Luz Interior - Portal Espírita
 * Módulo de Notificações
 * js/modules/notifications.js
 * Versão: 1.0.0
 */

let notificationsContainer
const defaultDuration = 5000 // 5 segundos

/**
 * Inicializa o sistema de notificações
 */
export function initNotifications() {
  // Cria o container de notificações se não existir
  createNotificationsContainer()

  // Exporta a função showNotification para escopo global
  window.showNotification = showNotification
}

/**
 * Cria o container para as notificações
 */
function createNotificationsContainer() {
  if (document.querySelector('.notifications-container')) {
    notificationsContainer = document.querySelector('.notifications-container')
    return
  }

  notificationsContainer = document.createElement('div')
  notificationsContainer.className = 'notifications-container'
  document.body.appendChild(notificationsContainer)
}

/**
 * Mostra uma notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, info, warning, error)
 * @param {number} duration - Duração em ms (0 para não autofechar)
 * @param {Object} options - Opções adicionais
 */
export function showNotification(
  message,
  type = 'info',
  duration = defaultDuration,
  options = {}
) {
  // Garante que o container existe
  if (!notificationsContainer) {
    createNotificationsContainer()
  }

  // Cria a notificação
  const notification = createNotificationElement(message, type, options)

  // Adiciona ao container
  notificationsContainer.appendChild(notification)

  // Mostra com animação após um pequeno delay para garantir a transição
  setTimeout(() => {
    notification.classList.add('show')
  }, 10)

  // Configura o autoclose se a duração for maior que 0
  if (duration > 0) {
    const timer = setTimeout(() => {
      closeNotification(notification)
    }, duration)

    // Armazena o timer para poder cancelar se o usuário fechar manualmente
    notification.dataset.timer = timer
  }

  // Retorna o elemento da notificação para possíveis manipulações
  return notification
}

/**
 * Cria o elemento de notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação
 * @param {Object} options - Opções adicionais
 * @returns {HTMLElement} Elemento da notificação
 */
function createNotificationElement(message, type, options) {
  const notification = document.createElement('div')
  notification.className = `notification notification--${type}`

  // Conteúdo da notificação
  const content = document.createElement('div')
  content.className = 'notification__content'

  // Ícone baseado no tipo
  const icon = document.createElement('i')
  icon.className = `notification__icon fas fa-${getIconByType(type)}`
  content.appendChild(icon)

  // Mensagem
  const messageElement = document.createElement('p')
  messageElement.className = 'notification__message'
  messageElement.innerHTML = message
  content.appendChild(messageElement)

  notification.appendChild(content)

  // Botão de fechar
  const closeButton = document.createElement('button')
  closeButton.className = 'notification__close'
  closeButton.innerHTML = '<i class="fas fa-times"></i>'
  closeButton.setAttribute('aria-label', 'Fechar notificação')
  closeButton.addEventListener('click', () => closeNotification(notification))
  notification.appendChild(closeButton)

  // Adiciona barra de progresso se tiver duração
  if (
    options.showProgressBar !== false &&
    options.duration !== 0 &&
    defaultDuration !== 0
  ) {
    const progressContainer = document.createElement('div')
    progressContainer.className = 'notification__progress'

    const progressBar = document.createElement('div')
    progressBar.className = 'notification__progress-bar'

    progressContainer.appendChild(progressBar)
    notification.appendChild(progressContainer)
  }

  // Adiciona ações se fornecidas
  if (options.actions && options.actions.length > 0) {
    const actionsContainer = document.createElement('div')
    actionsContainer.className = 'notification__action'

    options.actions.forEach(action => {
      const button = document.createElement('button')
      button.className = `notification__action-btn notification__action-btn--${
        action.type || 'secondary'
      }`
      button.textContent = action.text
      button.addEventListener('click', () => {
        if (typeof action.callback === 'function') {
          action.callback()
        }
        if (action.closeOnClick !== false) {
          closeNotification(notification)
        }
      })
      actionsContainer.appendChild(button)
    })

    content.appendChild(actionsContainer)
  }

  return notification
}

/**
 * Fecha uma notificação
 * @param {HTMLElement} notification - Elemento da notificação
 */
function closeNotification(notification) {
  // Remove a classe show para iniciar a animação de saída
  notification.classList.remove('show')

  // Limpa o timer se existir
  if (notification.dataset.timer) {
    clearTimeout(parseInt(notification.dataset.timer))
  }

  // Remove o elemento após a transição
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

/**
 * Retorna o ícone adequado para cada tipo de notificação
 * @param {string} type - Tipo da notificação
 * @returns {string} Nome do ícone
 */
function getIconByType(type) {
  switch (type) {
    case 'success':
      return 'check-circle'
    case 'info':
      return 'info-circle'
    case 'warning':
      return 'exclamation-triangle'
    case 'error':
      return 'times-circle'
    default:
      return 'bell'
  }
}

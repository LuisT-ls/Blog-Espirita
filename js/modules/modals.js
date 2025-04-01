/**
 * Luz Interior - Portal Espírita
 * Módulo de Modais
 * js/modules/modals.js
 * Versão: 1.0.0
 */

// Armazena o modal atualmente aberto
let currentModal = null

/**
 * Inicializa o sistema de modais
 */
export function initModals() {
  // Adiciona event listeners para abrir modais
  setupModalTriggers()

  // Exporta funções para uso global
  window.openModal = openModal
  window.closeModal = closeModal
  window.createModal = createModal
}

/**
 * Configura os gatilhos para abrir modais
 */
function setupModalTriggers() {
  // Busca todos os elementos com atributo data-modal-target
  const modalTriggers = document.querySelectorAll('[data-modal-target]')

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault()

      // Obtém o ID do modal a ser aberto
      const modalId = trigger.dataset.modalTarget

      // Abre o modal
      openModal(modalId)
    })
  })

  // Adiciona event listener global para botões de fechar modal
  document.addEventListener('click', event => {
    // Verifica se o clique foi em um botão de fechar
    if (
      event.target.matches('.modal__close') ||
      event.target.closest('.modal__close')
    ) {
      event.preventDefault()

      // Fecha o modal atual
      if (currentModal) {
        closeModal(currentModal)
      }
    }

    // Verifica se o clique foi no backdrop (fora do modal)
    if (
      event.target.matches('.modal-backdrop') &&
      !event.target.querySelector('.modal').contains(event.target)
    ) {
      // Fecha o modal atual
      if (currentModal) {
        closeModal(currentModal)
      }
    }
  })

  // Adiciona event listener para tecla ESC
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && currentModal) {
      closeModal(currentModal)
    }
  })
}

/**
 * Abre um modal pelo ID
 * @param {string} modalId - ID do modal a ser aberto
 */
export function openModal(modalId) {
  // Busca o elemento do modal
  const modalElement = document.getElementById(modalId)

  // Se não encontrar o elemento, sai da função
  if (!modalElement) {
    console.error(`Modal com ID "${modalId}" não encontrado.`)
    return
  }

  // Cria o backdrop se não existir
  let modalBackdrop = modalElement.querySelector('.modal-backdrop')

  if (!modalBackdrop) {
    // Verifica se o elemento já é um backdrop
    if (modalElement.classList.contains('modal-backdrop')) {
      modalBackdrop = modalElement
    } else {
      // Cria um novo backdrop e move o modal para dentro dele
      modalBackdrop = document.createElement('div')
      modalBackdrop.className = 'modal-backdrop'

      // Clona o modal para preservar event listeners
      const modalClone = modalElement.cloneNode(true)

      // Adiciona o modal ao backdrop
      modalBackdrop.appendChild(modalClone)

      // Substitui o elemento original pelo backdrop
      modalElement.parentNode.replaceChild(modalBackdrop, modalElement)
    }
  }

  // Exibe o backdrop
  modalBackdrop.classList.add('show')

  // Armazena referência ao modal atual
  currentModal = modalBackdrop

  // Previne scroll do body
  document.body.style.overflow = 'hidden'

  // Dispara evento
  dispatchModalEvent('modalopen', modalBackdrop)
}

/**
 * Fecha um modal
 * @param {HTMLElement} modalElement - Elemento do modal a ser fechado
 */
export function closeModal(modalElement) {
  // Se não for um elemento, sai da função
  if (!modalElement || !(modalElement instanceof Element)) {
    return
  }

  // Remove a classe show para iniciar animação de saída
  modalElement.classList.remove('show')

  // Dispara evento
  dispatchModalEvent('modalclose', modalElement)

  // Aguarda a animação terminar
  setTimeout(() => {
    // Restaura scroll do body
    document.body.style.overflow = ''

    // Limpa referência ao modal atual
    if (currentModal === modalElement) {
      currentModal = null
    }

    // Dispara evento
    dispatchModalEvent('modalclosed', modalElement)
  }, 300)
}

/**
 * Cria um modal dinamicamente
 * @param {Object} options - Opções do modal
 * @returns {HTMLElement} Elemento do modal criado
 */
export function createModal(options = {}) {
  // Opções padrão
  const defaultOptions = {
    id: 'dynamic-modal-' + Date.now(),
    title: 'Modal',
    content: '',
    size: '', // '', 'sm', 'lg', 'xl', 'full'
    closeButton: true,
    backdrop: true,
    addClass: '',
    onOpen: null,
    onClose: null
  }

  // Mescla opções padrão com as fornecidas
  const modalOptions = { ...defaultOptions, ...options }

  // Cria o elemento backdrop
  const modalBackdrop = document.createElement('div')
  modalBackdrop.className = 'modal-backdrop'
  modalBackdrop.id = modalOptions.id

  // Cria o elemento modal
  const modal = document.createElement('div')
  modal.className = 'modal'

  // Adiciona classe de tamanho se fornecida
  if (modalOptions.size) {
    modal.classList.add(`modal--${modalOptions.size}`)
  }

  // Adiciona classes personalizadas se fornecidas
  if (modalOptions.addClass) {
    modal.classList.add(...modalOptions.addClass.split(' '))
  }

  // Cria a estrutura do modal
  let modalContent = ''

  // Cabeçalho com título e botão de fechar
  if (modalOptions.title || modalOptions.closeButton) {
    modalContent += '<div class="modal__header">'

    if (modalOptions.title) {
      modalContent += `<h2 class="modal__title">${modalOptions.title}</h2>`
    }

    if (modalOptions.closeButton) {
      modalContent +=
        '<button class="modal__close" aria-label="Fechar modal"><i class="fas fa-times"></i></button>'
    }

    modalContent += '</div>'
  }

  // Corpo do modal
  modalContent += `<div class="modal__body">${modalOptions.content}</div>`

  // Rodapé com botões (opcional)
  if (options.buttons && options.buttons.length) {
    modalContent += '<div class="modal__footer">'

    options.buttons.forEach(button => {
      modalContent += `<button class="btn ${
        button.class || 'btn--secondary'
      }">${button.text}</button>`
    })

    modalContent += '</div>'
  }

  // Adiciona o conteúdo ao modal
  modal.innerHTML = modalContent

  // Adiciona o modal ao backdrop
  modalBackdrop.appendChild(modal)

  // Adiciona o backdrop ao body
  document.body.appendChild(modalBackdrop)

  // Configura event listeners para botões personalizados
  if (options.buttons && options.buttons.length) {
    const buttonElements = modal.querySelectorAll('.modal__footer .btn')

    options.buttons.forEach((button, index) => {
      if (typeof button.onClick === 'function' && buttonElements[index]) {
        buttonElements[index].addEventListener('click', event => {
          button.onClick(event, modalBackdrop)
        })
      }
    })
  }

  // Adiciona callbacks de eventos se fornecidos
  if (typeof modalOptions.onOpen === 'function') {
    modalBackdrop.addEventListener('modalopen', modalOptions.onOpen)
  }

  if (typeof modalOptions.onClose === 'function') {
    modalBackdrop.addEventListener('modalclose', modalOptions.onClose)
  }

  // Retorna o elemento do modal criado
  return modalBackdrop
}

/**
 * Dispara um evento personalizado para o modal
 * @param {string} eventName - Nome do evento
 * @param {HTMLElement} modalElement - Elemento do modal
 */
function dispatchModalEvent(eventName, modalElement) {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail: { modal: modalElement }
  })

  modalElement.dispatchEvent(event)
}

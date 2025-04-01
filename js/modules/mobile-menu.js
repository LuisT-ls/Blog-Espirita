/**
 * Luz Interior - Portal Espírita
 * Módulo de Menu Mobile
 * js/modules/mobile-menu.js
 * Versão: 1.0.0
 */

/**
 * Inicializa o menu mobile
 */
export function initMobileMenu() {
  const menuToggle = document.querySelector('.header__menu-toggle')
  const nav = document.querySelector('.header__nav')
  const menuItems = document.querySelectorAll('.header__menu > li')
  const body = document.body

  // Se não encontrar os elementos necessários, sai da função
  if (!menuToggle || !nav) return

  // Adiciona event listener ao botão de toggle
  menuToggle.addEventListener('click', toggleMenu)

  // Adiciona event listeners para submenus em dispositivos móveis
  setupSubmenus()

  // Adiciona event listener para fechar menu ao clicar fora
  document.addEventListener('click', closeOnOutsideClick)

  // Adiciona event listener para fechar menu ao pressionar ESC
  document.addEventListener('keydown', closeOnEsc)

  // Adiciona event listener ao redimensionar a janela
  window.addEventListener('resize', handleResize)

  /**
   * Alterna a visibilidade do menu mobile
   */
  function toggleMenu() {
    menuToggle.classList.toggle('active')
    nav.classList.toggle('show')

    // Previne scroll do body quando menu está aberto
    if (nav.classList.contains('show')) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = ''
    }

    // Animação de entrada dos itens de menu
    if (nav.classList.contains('show')) {
      menuItems.forEach((item, index) => {
        item.style.opacity = '0'
        item.style.transform = 'translateY(20px)'

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
          item.style.opacity = '1'
          item.style.transform = 'translateY(0)'
        }, 100 + index * 50)
      })
    }
  }

  /**
   * Configura submenus para dispositivos móveis
   */
  function setupSubmenus() {
    const menuItemsWithSubmenu = document.querySelectorAll(
      '.header__menu li:has(.header__submenu)'
    )

    menuItemsWithSubmenu.forEach(item => {
      // Cria um botão para abrir o submenu
      const submenuToggle = document.createElement('button')
      submenuToggle.classList.add('submenu-toggle')
      submenuToggle.innerHTML = '<i class="fas fa-chevron-down"></i>'
      submenuToggle.setAttribute('aria-label', 'Abrir submenu')

      // Adiciona o botão ao item do menu
      item.querySelector('a').after(submenuToggle)

      // Adiciona event listener ao botão
      submenuToggle.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        const submenu = item.querySelector('.header__submenu')

        // Fecha outros submenus
        document.querySelectorAll('.header__submenu.show').forEach(menu => {
          if (menu !== submenu) {
            menu.classList.remove('show')
            menu.previousElementSibling
              .querySelector('.submenu-toggle i')
              .classList.remove('fa-chevron-up')
            menu.previousElementSibling
              .querySelector('.submenu-toggle i')
              .classList.add('fa-chevron-down')
          }
        })

        // Alterna o submenu atual
        submenu.classList.toggle('show')

        // Alterna o ícone
        if (submenu.classList.contains('show')) {
          submenuToggle.querySelector('i').classList.remove('fa-chevron-down')
          submenuToggle.querySelector('i').classList.add('fa-chevron-up')
        } else {
          submenuToggle.querySelector('i').classList.remove('fa-chevron-up')
          submenuToggle.querySelector('i').classList.add('fa-chevron-down')
        }
      })
    })
  }

  /**
   * Fecha o menu ao clicar fora dele
   */
  function closeOnOutsideClick(e) {
    if (
      nav.classList.contains('show') &&
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      menuToggle.classList.remove('active')
      nav.classList.remove('show')
      body.style.overflow = ''
    }
  }

  /**
   * Fecha o menu ao pressionar ESC
   */
  function closeOnEsc(e) {
    if (e.key === 'Escape' && nav.classList.contains('show')) {
      menuToggle.classList.remove('active')
      nav.classList.remove('show')
      body.style.overflow = ''
    }
  }

  /**
   * Gerencia o menu ao redimensionar a janela
   */
  function handleResize() {
    // Se a largura da tela for maior que 768px, fecha o menu mobile
    if (window.innerWidth > 768 && nav.classList.contains('show')) {
      menuToggle.classList.remove('active')
      nav.classList.remove('show')
      body.style.overflow = ''

      // Reset nos estilos de animação
      menuItems.forEach(item => {
        item.style.opacity = ''
        item.style.transform = ''
        item.style.transition = ''
      })
    }
  }
}

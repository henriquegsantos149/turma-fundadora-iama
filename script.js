// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initAccordions();
  initScrollReveal();
  initCarousels();
  initLightbox();
  const chatbot = new ChatbotApplication();
  initStickyCTA();
});

// 1. Sticky Header
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check once on load
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');

    // Update icon
    if (typeof lucide !== 'undefined') {
      if (isOpen) {
        toggleBtn.innerHTML = '<i data-lucide="x"></i>';
      } else {
        toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
      }
      lucide.createIcons();
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// 3. Accordions (Disciplines & FAQ)
function initAccordions() {
  // Curriculum Accordions
  const curriculumItems = document.querySelectorAll('.curriculum-section .accordion-item');
  curriculumItems.forEach(item => {
    const toggle = item.querySelector('.accordion-toggle');
    const content = item.querySelector('.accordion-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other items
      curriculumItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.accordion-toggle');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-section .faq-item');
  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.faq-toggle');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// 4. Scroll Reveal Observer
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

// 5. Custom Carousels / Sliders (Mentores & Depoimentos)
function initCarousels() {
  setupCarousel('mentors-track', 'mentors-prev', 'mentors-next', 'mentors-dots');
  setupCarousel('testimonials-track', 'testimonials-prev', 'testimonials-next', 'testimonials-dots');

  function setupCarousel(trackId, prevBtnId, nextBtnId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsContainerId);

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const originalSlides = Array.from(track.children);
    if (originalSlides.length === 0) return;

    const cloneCount = 3;
    let currentIndex = 0;
    let isTransitioning = false;

    // Clone slides
    const firstClones = [];
    const lastClones = [];

    for (let i = 0; i < cloneCount; i++) {
      firstClones.push(originalSlides[i % originalSlides.length].cloneNode(true));
      lastClones.push(originalSlides[(originalSlides.length - 1 - i + originalSlides.length) % originalSlides.length].cloneNode(true));
    }
    lastClones.reverse();

    // Prepend last clones
    lastClones.forEach(clone => {
      track.insertBefore(clone, track.firstChild);
    });

    // Append first clones
    firstClones.forEach(clone => {
      track.appendChild(clone);
    });

    const updateSlider = (withTransition = true) => {
      const slideWidth = originalSlides[0].getBoundingClientRect().width;
      const gap = 24; // grid gap in CSS

      if (!withTransition) {
        track.style.transition = 'none';
        const offset = (currentIndex + cloneCount) * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        track.offsetHeight; // force reflow
        track.style.transition = '';
      } else {
        track.style.transition = '';
        const offset = (currentIndex + cloneCount) * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
      }

      // Update active dot
      const dots = Array.from(dotsContainer.children);
      if (dots.length > 0) {
        let activeDotIndex = currentIndex;
        if (currentIndex < 0) {
          activeDotIndex = originalSlides.length - 1;
        } else if (currentIndex >= originalSlides.length) {
          activeDotIndex = 0;
        }
        dots.forEach((dot, index) => {
          if (index === activeDotIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    const handleNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateSlider(true);
    };

    const handlePrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateSlider(true);
    };

    track.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'transform') return;
      isTransitioning = false;

      if (currentIndex >= originalSlides.length) {
        currentIndex = 0;
        updateSlider(false);
      } else if (currentIndex < 0) {
        currentIndex = originalSlides.length - 1;
        updateSlider(false);
      }
    });

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < originalSlides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot-indicator');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          if (isTransitioning) return;
          currentIndex = i;
          updateSlider(true);
        });
        dotsContainer.appendChild(dot);
      }
    };

    // Button click listeners
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);

    // Initialize dots & initial position
    buildDots();
    updateSlider(false);

    window.addEventListener('resize', () => {
      updateSlider(false);
    });
  }
}

// 6. Image Lightbox Modal
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (!lightbox || !lightboxImg || triggers.length === 0) return;

  const openLightbox = (imgSrc) => {
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
    lightbox.offsetHeight; // force reflow
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
      }
    }, 300);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img') || trigger;
      if (img) {
        openLightbox(img.src);
      }
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtn) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// 7. Chatbot Application Logic
class ChatbotApplication {
  constructor() {
    this.modal = document.getElementById('chatbot-modal');
    this.closeBtn = document.getElementById('close-chatbot');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.inputArea = document.getElementById('chatbot-input-area');
    this.triggers = document.querySelectorAll('.chatbot-trigger');

    this.userData = {};
    this.currentStep = 0;
    this.isTyping = false;

    // Configuração do fluxo de conversa
    this.flow = [
      {
        id: 'welcome',
        botMessage: "Olá! Sou o agente de seleção da Ambiental Pro para a <strong>Turma Fundadora</strong> da Pós IA.MA — a primeira turma de uma pós-graduação pioneira em Inteligência Artificial aplicada ao Meio Ambiente no Brasil.",
        delay: 500
      },
      {
        id: 'welcome2',
        botMessage: "Por se tratar de uma turma histórica e com vagas estritamente limitadas, realizamos uma análise de perfil dos candidatos. Apenas os profissionais alinhados com os critérios da seleção serão convidados para a nossa <strong>live exclusiva</strong>, onde revelaremos todos os detalhes da Pós e a oferta especial de matrícula para Fundadores.",
        delay: 1500
      },
      {
        id: 'name',
        botMessage: "Para começarmos, qual é o seu nome completo?",
        inputType: 'text',
        placeholder: 'Digite seu nome completo...',
        fieldId: 'firstName', // ActiveCampaign padrão (primeiro nome) mas enviaremos completo na variavel
        delay: 1500
      },
      {
        id: 'email',
        botMessage: "Prazer, {name}! Qual é o seu melhor e-mail? É por ele que enviaremos o resultado da sua análise e, se selecionado(a), o link exclusivo para a live.",
        inputType: 'email',
        placeholder: 'exemplo@email.com',
        fieldId: 'email',
        delay: 500
      },
      {
        id: 'phone',
        botMessage: "Perfeito. E qual é o seu WhatsApp com DDD? Também usaremos para enviar atualizações importantes sobre o processo de seleção. Atenção: digite apenas números.",
        inputType: 'tel',
        placeholder: '(99) 9 9999-9999',
        fieldId: 'phone',
        delay: 500
      },
      {
        id: 'graduacao',
        botMessage: "Agora, algumas perguntas sobre o seu perfil profissional. Você já possui formação de ensino superior completa?",
        inputType: 'buttons',
        options: ["Sim", "Não"],
        fieldId: '753', // UTM Possui Graduacao
        delay: 500
      },
      {
        id: 'area_formacao',
        botMessage: "Qual é a sua área de formação?",
        inputType: 'text',
        placeholder: 'Ex: Engenharia Ambiental, Biologia, Direito...',
        fieldId: '754', // UTM Area de Formacao
        condition: (data) => data['753'] === 'Sim',
        delay: 500
      },
      {
        id: 'q1',
        botMessage: "Agora, algumas perguntas sobre a sua relação com tecnologia e IA. Como você avalia o seu nível de conhecimento atual sobre Inteligência Artificial?",
        inputType: 'buttons',
        options: [
          "Nunca usei ferramentas de IA",
          "Uso apenas algumas IAs generativas, mas não aplico no trabalho",
          "Uso frequentemente ferramentas de IA para acelerar meus projetos",
          "Já construí projetos complexos e avançados com novos modelos de IA"
        ],
        fieldId: '791',
        delay: 500
      },
      {
        id: 'q2',
        botMessage: "Interessante! Conte brevemente: como você usa IA hoje no seu trabalho ou como gostaria de usar?",
        inputType: 'textarea',
        placeholder: 'Escreva sua resposta...',
        fieldId: '792',
        delay: 500
      },
      {
        id: 'q3',
        botMessage: "Qual é o seu principal objetivo ao aplicar IA na sua carreira? Pode marcar mais de uma opção.",
        inputType: 'checkboxes',
        options: [
          "Otimizar relatórios ambientais",
          "Análise avançada de dados e mapas",
          "Desenvolver softwares e aplicativos com IA",
          "Criar minhas próprias automações do zero",
          "Atualização de carreira",
          "Outro:"
        ],
        fieldId: '793',
        delay: 500
      },
      {
        id: 'q4',
        botMessage: "No seu trabalho, você costuma lidar com grandes volumes de dados ou documentos complexos como PDFs, laudos técnicos ou dados geoespaciais?",
        inputType: 'buttons',
        options: [
          "Sim, quase todos os dias",
          "Ocasionalmente",
          "Não, raramente"
        ],
        fieldId: '794',
        delay: 500
      },
      {
        id: 'q5',
        botMessage: "Você já tentou automatizar alguma tarefa repetitiva no seu trabalho?",
        inputType: 'buttons',
        options: ["Sim", "Não"],
        fieldId: '795',
        delay: 500
      },
      {
        id: 'q6',
        botMessage: "Na sua visão, como uma Pós-Graduação em Inteligência Artificial Aplicada ao Meio Ambiente pode transformar a sua carreira?",
        inputType: 'textarea',
        placeholder: 'Escreva sua resposta...',
        fieldId: '796',
        delay: 500
      },
      {
        id: 'q7',
        botMessage: "Qual é o seu maior obstáculo hoje para começar a aplicar IA no seu trabalho?",
        inputType: 'textarea',
        placeholder: 'Escreva sua resposta...',
        fieldId: '797',
        delay: 500
      },
      {
        id: 'q8',
        botMessage: "Última pergunta: quantas horas por semana você consegue dedicar aos estudos e projetos práticos?",
        inputType: 'buttons',
        options: ["Até 2 horas", "De 2 a 4 horas", "Mais de 4 horas"],
        fieldId: '798',
        delay: 500
      },
      {
        id: 'final',
        botMessage: "Obrigado, {name}! Suas respostas foram registradas e entrarão para a nossa análise de perfil. 🎯<br><br>Nossa equipe avaliará o seu perfil nos próximos dias. Se o seu perfil for selecionado, você receberá um convite exclusivo via e-mail e WhatsApp com o link de acesso à live da Turma Fundadora, onde revelaremos todos os detalhes da Pós e a condição especial de matrícula para os primeiros alunos.<br><br>Fique de olho no seu e-mail e WhatsApp! 🚀",
        isFinal: true,
        delay: 1000
      }
    ];

    this.initEvents();
  }

  initEvents() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openChatbot();
      });
    });

    this.closeBtn.addEventListener('click', () => {
      this.closeChatbot();
    });

    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeChatbot();
      }
    });
  }

  openChatbot() {
    this.modal.style.display = 'flex';
    // Small delay to allow display: flex to apply before opacity transition
    setTimeout(() => {
      this.modal.style.opacity = '1';
      this.modal.style.pointerEvents = 'auto';
      this.modal.querySelector('.chatbot-container').style.transform = 'scale(1)';
    }, 10);

    // Start flow if not started
    if (this.currentStep === 0 && this.messagesContainer.children.length === 0) {
      const savedState = this.restoreStateFromLocalStorage();
      if (savedState) {
        this.userData = savedState.userData;
        this.currentStep = savedState.currentStep;
        this.replayHistory();
      } else {
        this.processNextStep();
      }
    }
  }

  saveStateToLocalStorage() {
    try {
      const state = {
        userData: this.userData,
        currentStep: this.currentStep
      };
      localStorage.setItem('iama_chatbot_state', JSON.stringify(state));
    } catch (e) {
      console.error('[Chatbot] Falha ao salvar estado no localStorage:', e);
    }
  }

  clearLocalStorageState() {
    try {
      localStorage.removeItem('iama_chatbot_state');
    } catch (e) {
      console.error('[Chatbot] Falha ao limpar estado no localStorage:', e);
    }
  }

  restoreStateFromLocalStorage() {
    try {
      const saved = localStorage.getItem('iama_chatbot_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state && state.userData && typeof state.currentStep === 'number') {
          return state;
        }
      }
    } catch (e) {
      console.error('[Chatbot] Falha ao ler estado do localStorage:', e);
    }
    return null;
  }

  replayHistory() {
    this.messagesContainer.innerHTML = '';

    // Loop through steps up to currentStep
    for (let i = 0; i < this.currentStep; i++) {
      const step = this.flow[i];
      if (!step) continue;

      // Check condition (if it wasn't met, it was skipped, so we skip it in history too)
      if (step.condition && !step.condition(this.userData)) {
        continue;
      }

      // Add bot message
      this.addBotMessage(step.botMessage);

      // Add user message if inputType was present and answer exists
      if (step.inputType && step.fieldId) {
        const answer = this.userData[step.fieldId];
        if (answer !== undefined && answer !== null) {
          let displayVal = answer;
          if (step.inputType === 'tel') {
            if (answer.length === 11) {
              displayVal = `(${answer.substring(0, 2)}) ${answer.substring(2, 3)} ${answer.substring(3, 7)}-${answer.substring(7)}`;
            } else if (answer.length === 10) {
              displayVal = `(${answer.substring(0, 2)}) ${answer.substring(2, 6)}-${answer.substring(6)}`;
            }
          } else if (step.inputType === 'checkboxes') {
            displayVal = answer.split(' || ').map(item => item.startsWith('Outro: ') ? item.substring(7) : item).join(', ');
          }
          this.addUserMessage(displayVal);
        }
      }
    }

    // Resume flow
    this.processNextStep();
  }

  closeChatbot() {
    this.modal.style.opacity = '0';
    this.modal.style.pointerEvents = 'none';
    this.modal.querySelector('.chatbot-container').style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.modal.style.display = 'none';
    }, 300);
  }

  getUTMs() {
    const params = new URLSearchParams(window.location.search);
    return {
      '747': params.get('L01PSIAMA_UTM_CAMPAIGN') || params.get('utm_campaign') || '',
      '748': params.get('L01PSIAMA_UTM_SOURCE') || params.get('utm_source') || '',
      '749': params.get('L01PSIAMA_UTM_MEDIUM') || params.get('utm_medium') || '',
      '750': params.get('L01PSIAMA_UTM_CONTENT') || params.get('utm_content') || '',
      '751': params.get('L01PSIAMA_UTM_TERM') || params.get('utm_term') || '',
      '789': new Date().toISOString()
    };
  }

  async sendDataToActiveCampaign() {
    try {
      const utms = this.getUTMs();

      // Standard AC fields
      const payload = {
        email: this.userData.email,
        firstName: this.userData.firstName,
        phone: this.userData.phone,
        fieldValues: []
      };

      // Keys that are standard AC contact fields (not custom field IDs)
      const standardKeys = new Set(['email', 'firstName', 'phone']);

      // Build fieldValues from userData (respostas do chatbot) + UTMs
      // userData keys que são IDs de campos (números como string: '753', '791', etc.)
      for (const [id, value] of Object.entries(this.userData)) {
        if (!standardKeys.has(id) && value !== undefined && value !== null && String(value).trim() !== '') {
          payload.fieldValues.push({ field: String(id), value: String(value) });
        }
      }

      // Add UTM fields
      for (const [id, value] of Object.entries(utms)) {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          payload.fieldValues.push({ field: String(id), value: String(value) });
        }
      }

      console.log('[Chatbot] Payload enviado para /api/subscribe:', JSON.stringify(payload, null, 2));

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('[Chatbot] Erro ao salvar os dados:', responseData);
        return false;
      } else {
        console.log('[Chatbot] Dados enviados com sucesso:', responseData);
        return true;
      }
    } catch (error) {
      console.error('[Chatbot] Erro na requisição para a API:', error);
      return false;
    }
  }

  scrollToBottom() {
    const wrapper = document.querySelector('.chatbot-messages-wrapper');
    setTimeout(() => {
      wrapper.scrollTo({
        top: wrapper.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }

  showTyping() {
    const id = 'typing-' + Date.now();
    const html = `
      <div class="chat-msg bot-msg" id="${id}">
        <div class="bot-avatar-container">
          <div class="chatbot-avatar msg-avatar">
            <img src="/robot-avatar.webp" alt="IA Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
          </div>
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    this.messagesContainer.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();
    return id;
  }

  removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  addBotMessage(text) {
    // Replace placeholders
    let parsedText = text;
    if (this.userData.firstName) {
      const shortName = this.userData.firstName.split(' ')[0];
      parsedText = parsedText.replace('{name}', shortName);
    }
    const time = this.getCurrentTime();

    const html = `
      <div class="chat-msg bot-msg">
        <div class="bot-avatar-container">
          <div class="chatbot-avatar msg-avatar">
            <img src="/robot-avatar.webp" alt="IA Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
          </div>
        </div>
        <div class="msg-bubble">
          ${parsedText}
          <div class="msg-meta"><span class="msg-time">${time}</span></div>
        </div>
      </div>
    `;
    this.messagesContainer.insertAdjacentHTML('beforeend', html);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    this.scrollToBottom();
  }

  addUserMessage(text) {
    const time = this.getCurrentTime();
    const html = `
      <div class="chat-msg user-msg">
        <div class="msg-bubble">
          ${text}
          <div class="msg-meta">
            <span class="msg-time">${time}</span>
            <i data-lucide="check-check" class="msg-status"></i>
          </div>
        </div>
      </div>
    `;
    this.messagesContainer.insertAdjacentHTML('beforeend', html);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    this.scrollToBottom();
  }

  renderInputArea(stepData) {
    this.inputArea.innerHTML = '';

    if (stepData.inputType === 'text' || stepData.inputType === 'email' || stepData.inputType === 'tel' || stepData.inputType === 'textarea') {
      const isTextarea = stepData.inputType === 'textarea';
      const inputTag = isTextarea ?
        `<textarea class="chat-input" id="chat-input-field" placeholder="${stepData.placeholder}" rows="1"></textarea>` :
        `<input type="${stepData.inputType}" class="chat-input" id="chat-input-field" placeholder="${stepData.placeholder}">`;

      this.inputArea.innerHTML = `
        <div class="chat-input-wrapper">
          ${inputTag}
          <button id="chat-send-btn" class="chat-send-btn" disabled>
            <i data-lucide="send"></i>
          </button>
        </div>
      `;

      if (typeof lucide !== 'undefined') lucide.createIcons();

      const inputEl = document.getElementById('chat-input-field');
      const sendBtn = document.getElementById('chat-send-btn');

      // Auto-resize textarea
      if (isTextarea) {
        inputEl.addEventListener('input', function () {
          this.style.height = 'auto';
          this.style.height = (this.scrollHeight) + 'px';
        });
      }

      inputEl.addEventListener('input', () => {
        if (stepData.inputType === 'tel') {
          // Keep only digits and max 11 characters
          let cleanVal = inputEl.value.replace(/\D/g, '');
          if (cleanVal.length > 11) {
            cleanVal = cleanVal.slice(0, 11);
          }
          inputEl.value = cleanVal;
        }
        sendBtn.disabled = inputEl.value.trim().length === 0;
      });

      const submitAction = () => {
        let val = inputEl.value.trim();
        if (stepData.inputType === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            alert('Por favor, insira um e-mail válido (ex: nome@dominio.com).');
            return;
          }
        }
        if (stepData.inputType === 'tel') {
          val = val.replace(/\D/g, '');
          if (val.length < 10) {
            alert('Por favor, insira um WhatsApp válido com DDD (ex: 11999999999).');
            return;
          }
        }
        if (val) {
          this.userData[stepData.fieldId] = val;

          let displayVal = val;
          if (stepData.inputType === 'tel') {
            if (val.length === 11) {
              displayVal = `(${val.substring(0, 2)}) ${val.substring(2, 3)} ${val.substring(3, 7)}-${val.substring(7)}`;
            } else if (val.length === 10) {
              displayVal = `(${val.substring(0, 2)}) ${val.substring(2, 6)}-${val.substring(6)}`;
            }
          }

          this.addUserMessage(displayVal);
          this.inputArea.innerHTML = ''; // clear input
          this.currentStep++;
          this.saveStateToLocalStorage();

          this.processNextStep();
        }
      };

      sendBtn.addEventListener('click', submitAction);
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitAction();
        }
      });

      inputEl.focus();

    } else if (stepData.inputType === 'buttons') {
      const btnsHtml = stepData.options.map(opt =>
        `<button class="chat-option-btn">${opt}</button>`
      ).join('');

      this.inputArea.innerHTML = `
        <div class="chat-options">
          ${btnsHtml}
        </div>
      `;

      const btns = this.inputArea.querySelectorAll('.chat-option-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.textContent;
          this.userData[stepData.fieldId] = val;
          this.addUserMessage(val);
          this.inputArea.innerHTML = '';
          this.currentStep++;
          this.saveStateToLocalStorage();
          this.processNextStep();
        });
      });

    } else if (stepData.inputType === 'checkboxes') {
      const checksHtml = stepData.options.map((opt, i) => {
        if (opt === 'Outro:') {
          return `
            <div class="chat-checkbox-outro-container" style="display: flex; flex-direction: column; width: 100%; gap: 8px;">
              <label class="chat-checkbox-label">
                <input type="checkbox" class="chat-checkbox" value="${opt}" id="chk-${i}">
                <span>${opt}</span>
              </label>
              <input type="text" class="chat-input" id="outro-text-input" placeholder="Escreva aqui seu principal objetivo..." style="display: none; margin-top: 4px; width: 100%; box-sizing: border-box; background: #1F2023; border: 1px solid #444444; border-radius: 12px; padding: 10px 16px; outline: none; color: #fff;">
            </div>
          `;
        }
        return `
          <label class="chat-checkbox-label">
            <input type="checkbox" class="chat-checkbox" value="${opt}" id="chk-${i}">
            <span>${opt}</span>
          </label>
        `;
      }).join('');

      this.inputArea.innerHTML = `
        <div class="chat-options">
          ${checksHtml}
          <button class="chat-action-btn" id="chat-confirm-btn">Confirmar Seleção</button>
        </div>
      `;

      const confirmBtn = document.getElementById('chat-confirm-btn');
      const outroCheckbox = this.inputArea.querySelector('input[value="Outro:"]');
      const outroInput = document.getElementById('outro-text-input');

      if (outroCheckbox && outroInput) {
        outroCheckbox.addEventListener('change', () => {
          if (outroCheckbox.checked) {
            outroInput.style.display = 'block';
            outroInput.focus();
          } else {
            outroInput.style.display = 'none';
            outroInput.value = '';
          }
        });
      }

      confirmBtn.addEventListener('click', () => {
        const checked = [];
        let hasOutro = false;

        this.inputArea.querySelectorAll('.chat-checkbox:checked').forEach(cb => {
          if (cb.value === 'Outro:') {
            hasOutro = true;
          } else {
            checked.push(cb.value);
          }
        });

        if (hasOutro) {
          const textVal = outroInput ? outroInput.value.trim() : '';
          if (!textVal) {
            alert('Por favor, especifique o seu objetivo no campo "Outro:".');
            return;
          }
          checked.push(`Outro: ${textVal}`);
        }

        if (checked.length > 0) {
          const val = checked.join(' || '); // ActiveCampaign múltipla escolha format
          this.userData[stepData.fieldId] = val;
          const userMsgText = checked.map(item => item.startsWith('Outro: ') ? item.substring(7) : item).join(', ');
          this.addUserMessage(userMsgText);
          this.inputArea.innerHTML = '';
          this.currentStep++;
          this.saveStateToLocalStorage();
          this.processNextStep();
        } else {
          alert('Selecione pelo menos uma opção.');
        }
      });
    }
  }

  async processNextStep() {
    if (this.currentStep >= this.flow.length) return;

    let stepData = this.flow[this.currentStep];

    // Check condition
    if (stepData.condition && !stepData.condition(this.userData)) {
      this.currentStep++;
      return this.processNextStep();
    }

    // Is typing simulation
    const typingId = this.showTyping();

    setTimeout(async () => {
      this.removeTyping(typingId);

      if (stepData.isFinal) {
        const syncTypingId = this.showTyping();
        const success = await this.sendDataToActiveCampaign();
        this.removeTyping(syncTypingId);

        if (success) {
          this.addBotMessage(stepData.botMessage);
          this.clearLocalStorageState();

          this.inputArea.innerHTML = `
            <div class="chat-options">
              <button class="chat-action-btn" id="chat-entendido-btn" style="width: 100%;">Entendido</button>
            </div>
          `;
          const entendidoBtn = document.getElementById('chat-entendido-btn');
          if (entendidoBtn) {
            entendidoBtn.addEventListener('click', () => {
              this.closeChatbot();
            });
          }
        } else {
          this.addBotMessage("Desculpe, ocorreu uma falha de conexão e não conseguimos salvar as suas respostas. Por favor, verifique sua internet e tente enviar novamente.");

          this.inputArea.innerHTML = `
            <div class="chat-options">
              <button class="chat-action-btn" id="chat-retry-btn" style="width: 100%;">Tentar Novamente</button>
            </div>
          `;
          const retryBtn = document.getElementById('chat-retry-btn');
          if (retryBtn) {
            retryBtn.addEventListener('click', () => {
              this.inputArea.innerHTML = '';
              this.processNextStep();
            });
          }
        }
      } else {
        this.addBotMessage(stepData.botMessage);

        if (!stepData.inputType) {
          // Just a bot message, go to next
          this.currentStep++;
          this.processNextStep();
        } else {
          // Need user input
          this.renderInputArea(stepData);
        }
      }
    }, stepData.delay || 800);
  }
}



// 8. Smooth Scroll without Hash in URL
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#' || targetId === '') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } catch (err) {
        console.warn('Invalid selector for smooth scroll:', targetId);
      }
    });
  });
}

// 9. Sticky CTA Observer
function initStickyCTA() {
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('hero');

  if (!stickyCta || !heroSection) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If hero section is not intersecting (i.e. out of view), show sticky CTA
      if (!entry.isIntersecting) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }, observerOptions);

  observer.observe(heroSection);
}

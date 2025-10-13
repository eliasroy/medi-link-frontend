<template>
  <div class="homepage">
    <header class="horizontal-header">
      <div class="logo">
        <h2>MediLink</h2>
      </div>
      <nav class="horizontal-menu">
        <a href="#home" class="menu-btn">Inicio</a>
        <a href="#about" class="menu-btn">Acerca de</a>
        <a href="#services" class="menu-btn">Servicios</a>
        <a href="#contact" class="menu-btn">Contacto</a>
        <router-link to="/login" class="menu-btn">Iniciar Sesión</router-link>
        <router-link to="/register" class="menu-btn primary">Registro</router-link>
      </nav>
    </header>

    <!-- Banner Carousel Section -->
    <section class="banner-carousel" id="home">
      <div class="carousel-container">
        <div class="carousel-slide active" data-slide="1">
          <div class="slide-background">
            <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop" alt="Medical care">
          </div>
          <div class="slide-content">
            <div class="slide-text">
              <h1 class="slide-title">MediLink</h1>
              <p class="slide-subtitle">Tu Salud, Nuestra Prioridad</p>
              <div class="slide-emojis">
                <span class="emoji">🏥</span>
                <span class="emoji">👨‍⚕️</span>
                <span class="emoji">💊</span>
                <span class="emoji">❤️</span>
              </div>
            </div>
          </div>
        </div>

        <div class="carousel-slide" data-slide="2">
          <div class="slide-background">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop" alt="Medical consultation">
          </div>
          <div class="slide-content">
            <div class="slide-text">
              <h1 class="slide-title">Atención Médica de Calidad</h1>
              <p class="slide-subtitle">Conecta con los mejores profesionales de la salud</p>
              <div class="slide-emojis">
                <span class="emoji">🔬</span>
                <span class="emoji">🩺</span>
                <span class="emoji">⚕️</span>
                <span class="emoji">🌟</span>
              </div>
            </div>
          </div>
        </div>

        <div class="carousel-slide" data-slide="3">
          <div class="slide-background">
            <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=1080&fit=crop" alt="Modern clinic">
          </div>
          <div class="slide-content">
            <div class="slide-text">
              <h1 class="slide-title">Tecnología Innovadora</h1>
              <p class="slide-subtitle">Reserva citas y gestiona tu salud fácilmente</p>
              <div class="slide-emojis">
                <span class="emoji">📱</span>
                <span class="emoji">💻</span>
                <span class="emoji">🚀</span>
                <span class="emoji">🎯</span>
              </div>
            </div>
          </div>
        </div>

        <div class="carousel-slide" data-slide="4">
          <div class="slide-background">
            <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&h=1080&fit=crop" alt="Medical technology">
          </div>
          <div class="slide-content">
            <div class="slide-text">
              <h1 class="slide-title">Tu Bienestar Primero</h1>
              <p class="slide-subtitle">Accede a servicios médicos 24/7 desde cualquier lugar</p>
              <div class="slide-emojis">
                <span class="emoji">🌍</span>
                <span class="emoji">⏰</span>
                <span class="emoji">🏃‍♂️</span>
                <span class="emoji">💪</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Navigation -->
        <div class="carousel-nav">
          <button class="nav-btn prev-btn" aria-label="Previous slide">‹</button>
          <div class="carousel-indicators">
            <span class="indicator active" data-slide="1"></span>
            <span class="indicator" data-slide="2"></span>
            <span class="indicator" data-slide="3"></span>
            <span class="indicator" data-slide="4"></span>
          </div>
          <button class="nav-btn next-btn" aria-label="Next slide">›</button>
        </div>
      </div>
    </section>

    <main class="main-content">
      <!-- Statistics Section -->
      <section class="statistics" id="stats">
        <div class="section-container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number" data-target="5000">0</div>
              <div class="stat-label">Pacientes Felices</div>
              <span class="emoji">😊</span>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-target="200">0</div>
              <div class="stat-label">Médicos Expertos</div>
              <span class="emoji">👨‍⚕️</span>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-target="50">0</div>
              <div class="stat-label">Clínicas Asociadas</div>
              <span class="emoji">🏥</span>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-target="98">0</div>
              <div class="stat-label">Tasa de Satisfacción</div>
              <span class="emoji">⭐</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Who Are We Section -->
      <section id="about" class="who-we-are">
        <div class="section-container">
          <h2 class="section-title animate-text">¿Quiénes Somos? <span class="emoji">🤝</span></h2>
          <div class="who-content">
            <div class="who-text animate-text delay-1">
              <p>MediLink es una plataforma revolucionaria de atención médica que conecta a los pacientes con profesionales médicos de manera perfecta. Creemos en hacer que la atención médica sea accesible, eficiente y centrada en el paciente.</p>
              <p>Nuestra misión es cerrar la brecha entre los proveedores de atención médica y los pacientes a través de tecnología innovadora y atención compasiva.</p>
            </div>
            <div class="who-image animate-image delay-2">
              <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop" alt="Consultorio médico moderno">
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Clinics Affiliates -->
      <section class="featured-clinics">
        <div class="section-container">
          <h2 class="section-title animate-text">Nuestras Clínicas Destacadas y Afiliadas <span class="emoji">🏥</span></h2>
          <div class="clinics-grid">
            <div class="clinic-card animate-card">
              <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop" alt="Clínica Moderna">
              <h3>Centro Médico </h3>
              <p>Instalaciones de vanguardia con médicos expertos</p>
            </div>
            <div class="clinic-card animate-card delay-1">
              <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=200&fit=crop" alt="Clínica Dental">
              <h3>Sonrisa Dental </h3>
              <p>Servicios dentales completos para toda la familia</p>
            </div>
            <div class="clinic-card animate-card delay-2">
              <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop" alt="Cuidado de Ojos">
              <h3>Visión Plus</h3>
              <p>Cuidado avanzado de ojos y servicios ópticos</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How Clinica Works -->
      <section class="how-works">
        <div class="section-container">
          <h2 class="section-title animate-text">¿Cómo Funciona MediLink? <span class="emoji">⚡</span></h2>
          <div class="steps-grid">
            <div class="step-card animate-card">
              <div class="step-number">1</div>
              <h3>Regístrate y Elige</h3>
              <p>Crea tu cuenta y selecciona tus necesidades de atención médica</p>
              <span class="emoji">📝</span>
            </div>
            <div class="step-card animate-card delay-1">
              <div class="step-number">2</div>
              <h3>Encuentra y Reserva</h3>
              <p>Navega por médicos disponibles y reserva citas al instante</p>
              <span class="emoji">🔍</span>
            </div>
            <div class="step-card animate-card delay-2">
              <div class="step-number">3</div>
              <h3>Recibe Atención</h3>
              <p>Recibe atención médica de calidad de profesionales certificados</p>
              <span class="emoji">💉</span>
            </div>
            <div class="step-card animate-card delay-3">
              <div class="step-number">4</div>
              <h3>Seguimiento</h3>
              <p>Accede a tus registros médicos y programa seguimientos</p>
              <span class="emoji">📊</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Hospital Services -->
      <section id="services" class="hospital-services">
        <div class="section-container">
          <h2 class="section-title animate-text">Nuestros Servicios Hospitalarios Destacados <span class="emoji">🏥</span></h2>
          <div class="services-grid">
            <div class="service-card animate-card">
              <div class="service-icon">🩺</div>
              <h3>Medicina General</h3>
              <p>Servicios completos de atención primaria de salud</p>
            </div>
            <div class="service-card animate-card delay-1">
              <div class="service-icon">🦷</div>
              <h3>Odontología</h3>
              <p>Cuidado dental completo y servicios de salud oral</p>
            </div>
            <div class="service-card animate-card delay-2">
              <div class="service-icon">👁️</div>
              <h3>Oftalmología</h3>
              <p>Cuidado experto de ojos y corrección de visión</p>
            </div>
            <div class="service-card animate-card delay-3">
              <div class="service-icon">🫀</div>
              <h3>Cardiología</h3>
              <p>Cuidado avanzado del corazón y cardiovascular</p>
            </div>
            <div class="service-card animate-card delay-4">
              <div class="service-icon">🧠</div>
              <h3>Neurología</h3>
              <p>Tratamiento y cuidado neurológico especializado</p>
            </div>
            <div class="service-card animate-card delay-5">
              <div class="service-icon">🩹</div>
              <h3>Atención de Emergencia</h3>
              <p>Servicios médicos de emergencia 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why People Like Us -->
      <section class="why-us">
        <div class="section-container">
          <h2 class="section-title animate-text">¿Por Qué Elegirnos? <span class="emoji">😊</span></h2>
          <div class="reasons-grid">
            <div class="reason-card animate-card">
              <div class="reason-icon">⚡</div>
              <h3>Reserva Rápida y Fácil</h3>
              <p>Reserva citas en segundos con nuestra plataforma intuitiva</p>
            </div>
            <div class="reason-card animate-card delay-1">
              <div class="reason-icon">👨‍⚕️</div>
              <h3>Médicos Certificados</h3>
              <p>Todos nuestros proveedores de atención médica están licenciados y experimentados</p>
            </div>
            <div class="reason-card animate-card delay-2">
              <div class="reason-icon">💰</div>
              <h3>Atención Accesible</h3>
              <p>Atención médica de calidad a precios que puedes permitirte</p>
            </div>
            <div class="reason-card animate-card delay-3">
              <div class="reason-icon">📱</div>
              <h3>Soporte 24/7</h3>
              <p>Soporte al cliente las 24 horas para todas tus necesidades</p>
            </div>
            <div class="reason-card animate-card delay-4">
              <div class="reason-icon">🔒</div>
              <h3>Seguro y Privado</h3>
              <p>Tus datos médicos están protegidos con seguridad avanzada</p>
            </div>
            <div class="reason-card animate-card delay-5">
              <div class="reason-icon">🌟</div>
              <h3>Garantía de Calidad</h3>
              <p>Controles de calidad regulares y encuestas de satisfacción del paciente</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Transparent Pricing -->
      <section class="pricing">
        <div class="section-container">
          <h2 class="section-title animate-text">Precios Transparentes <span class="emoji">💎</span></h2>
          <div class="pricing-grid">
            <div class="pricing-card animate-card">
              <h3>Consulta Básica</h3>
              <div class="price">$50</div>
              <ul>
                <li>Chequeo general</li>
                <li>Diagnóstico básico</li>
                <li>Receta médica</li>
                <li>Llamada de seguimiento</li>
              </ul>
              <button class="pricing-btn">Elegir Plan</button>
            </div>
            <div class="pricing-card featured animate-card delay-1">
              <div class="featured-badge">Más Popular</div>
              <h3>Atención Integral</h3>
              <div class="price">$120</div>
              <ul>
                <li>Todos los servicios básicos</li>
                <li>Consulta con especialista</li>
                <li>Análisis de laboratorio incluidos</li>
                <li>Reserva prioritaria</li>
                <li>Visitas a domicilio</li>
              </ul>
              <button class="pricing-btn primary">Elegir Plan</button>
            </div>
            <div class="pricing-card animate-card delay-2">
              <h3>Paquete Premium</h3>
              <div class="price">$200</div>
              <ul>
                <li>Todos los servicios integrales</li>
                <li>Atención de emergencia</li>
                <li>Telemedicina 24/7</li>
                <li>Monitoreo de salud</li>
                <li>Entrenador de salud personal</li>
              </ul>
              <button class="pricing-btn">Elegir Plan</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Get Started -->
      <section class="get-started">
        <div class="section-container">
          <h2 class="section-title animate-text">Comienza con MediLink <span class="emoji">🚀</span></h2>
          <p class="animate-text delay-1">Únete a miles de pacientes satisfechos y proveedores de atención médica. ¡Comienza tu viaje hacia una mejor salud hoy!</p>
          <div class="started-actions animate-card delay-2">
            <router-link to="/register" class="started-btn primary">Regístrate como Paciente</router-link>
            <router-link to="/register" class="started-btn primary">Únete como Médico</router-link>
            <router-link to="/login" class="started-btn primary">Iniciar Sesión</router-link>
          </div>
        </div>
      </section>

      <!-- Mission and Vision Enhanced -->
      <section class="mission-vision">
        <div class="section-container">
          <h2 class="section-title animate-text">Nuestra Misión y Visión <span class="emoji">🎯</span></h2>
          <div class="mission-vision-grid">
            <div class="mission-card animate-card">
              <div class="card-icon">🎯</div>
              <h3>Nuestra Misión</h3>
              <p>Facilitar el acceso a servicios médicos de calidad, conectando pacientes con profesionales de la salud de manera eficiente y segura. Creemos en un sistema de salud accesible para todos.</p>
              <div class="card-features">
                <span class="feature-tag">Accesibilidad</span>
                <span class="feature-tag">Calidad</span>
                <span class="feature-tag">Innovación</span>
              </div>
            </div>
            <div class="vision-card animate-card delay-1">
              <div class="card-icon">🚀</div>
              <h3>Nuestra Visión</h3>
              <p>Ser la plataforma líder en la transformación digital de la atención médica, donde la tecnología y la empatía se unen para mejorar la salud y el bienestar de las comunidades.</p>
              <div class="card-features">
                <span class="feature-tag">Liderazgo</span>
                <span class="feature-tag">Tecnología</span>
                <span class="feature-tag">Empatía</span>
              </div>
            </div>
          </div>
          <div class="mission-stats">
            <div class="stat-item animate-card delay-2">
              <div class="stat-number" data-target="2025">0</div>
              <div class="stat-label">Año de Fundación</div>
            </div>
            <div class="stat-item animate-card delay-3">
              <div class="stat-number" data-target="10000">0</div>
              <div class="stat-label">Usuarios Activos</div>
            </div>
            <div class="stat-item animate-card delay-4">
              <div class="stat-number" data-target="500">0</div>
              <div class="stat-label">Médicos Asociados</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="contact-section">
        <div class="section-container">
          <h2 class="section-title animate-text">Contáctanos <span class="emoji">📞</span></h2>
          <div class="contact-content">
            <div class="contact-info animate-card">
              <div class="contact-item">
                <span class="emoji">📧</span>
                <div>
                  <h4>Correo Electrónico</h4>
                  <p>soporte@medilink.com</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="emoji">📱</span>
                <div>
                  <h4>Teléfono</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="emoji">📍</span>
                <div>
                  <h4>Dirección</h4>
                  <p>123 Calle Salud, Ciudad Médica, MC 12345</p>
                </div>
              </div>
            </div>
            <div class="contact-form animate-card delay-1">
              <form>
                <input type="text" placeholder="Tu Nombre" required>
                <input type="email" placeholder="Tu Correo Electrónico" required>
                <textarea placeholder="Tu Mensaje" rows="5" required></textarea>
                <button type="submit" class="contact-btn">Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="home-footer">
      <p>&copy; 2025 MediLink. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/index.js'
import { useRouter } from 'vue-router'

const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger

const router = useRouter()
const authStore = useAuthStore()
const featuredDoctorId = ref(2)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userRole = computed(() => authStore.user?.rol)

const handleLogout = () => {
  authStore.logout()
}

onMounted(async () => {
  featuredDoctorId.value = authStore.user?.id || 2

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  // GSAP animations for buttons
  gsap.utils.toArray('.feature-btn, .cta-btn, .menu-btn, .pricing-btn, .started-btn, .contact-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
  })

  // Carousel functionality
  let currentSlide = 1
  const totalSlides = 4
  let carouselInterval

  function showSlide(slideNumber) {
    // Hide all slides
    gsap.utils.toArray('.carousel-slide').forEach(slide => {
      slide.classList.remove('active')
      slide.style.opacity = '0'
      slide.style.visibility = 'hidden'
    })

    // Show active slide
    const activeSlide = document.querySelector(`[data-slide="${slideNumber}"]`)
    if (activeSlide) {
      activeSlide.classList.add('active')
      activeSlide.style.opacity = '1'
      activeSlide.style.visibility = 'visible'

      // Animate slide content
      const title = activeSlide.querySelector('.slide-title')
      const subtitle = activeSlide.querySelector('.slide-subtitle')
      const emojis = activeSlide.querySelectorAll('.slide-emojis .emoji')

      gsap.from(title, {
        y: 50,
        duration: 1,
        ease: 'power2.out'
      })

      gsap.from(subtitle, {
        y: 30,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out'
      })

      gsap.from(emojis, {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.4,
        ease: 'back.out(1.7)'
      })
    }

    // Update indicators
    gsap.utils.toArray('.indicator').forEach((indicator, index) => {
      if (index + 1 === slideNumber) {
        indicator.classList.add('active')
      } else {
        indicator.classList.remove('active')
      }
    })
  }

  function nextSlide() {
    currentSlide = currentSlide >= totalSlides ? 1 : currentSlide + 1
    showSlide(currentSlide)
  }

  function prevSlide() {
    currentSlide = currentSlide <= 1 ? totalSlides : currentSlide - 1
    showSlide(currentSlide)
  }

  function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000) // Change slide every 5 seconds
  }

  function stopCarousel() {
    clearInterval(carouselInterval)
  }

  // Event listeners for carousel controls
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('next-btn')) {
      nextSlide()
      stopCarousel()
      startCarousel() // Restart timer
    } else if (e.target.classList.contains('prev-btn')) {
      prevSlide()
      stopCarousel()
      startCarousel() // Restart timer
    } else if (e.target.classList.contains('indicator')) {
      const slideNumber = parseInt(e.target.dataset.slide)
      currentSlide = slideNumber
      showSlide(currentSlide)
      stopCarousel()
      startCarousel() // Restart timer
    }
  })

  // Pause carousel on hover
  document.querySelector('.banner-carousel').addEventListener('mouseenter', stopCarousel)
  document.querySelector('.banner-carousel').addEventListener('mouseleave', startCarousel)

  // Initialize carousel after DOM is ready
  nextTick(() => {
    setTimeout(() => {
      console.log('Initializing carousel...')
      startCarousel()
      showSlide(1) // Show first slide initially
      console.log('Carousel initialized')
    }, 100)
  })

  // Section title animations on scroll with text reveal
  gsap.utils.toArray('.section-title').forEach(title => {
    const text = title.textContent
    title.innerHTML = text.split('').map(char => `<span class="char">${char}</span>`).join('')

    gsap.from(title.querySelectorAll('.char'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.02,
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Card animations with stagger and rotation
  gsap.utils.toArray('.clinics-grid, .steps-grid, .services-grid, .reasons-grid').forEach(grid => {
    gsap.from(grid.children, {
      y: 50,
      opacity: 0,
      rotationY: -15,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Add scroll-based transforms for cards
  gsap.utils.toArray('.clinic-card, .service-card, .reason-card').forEach(card => {
    gsap.to(card, {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  })

  // Pricing cards with scale animation
  gsap.from('.pricing-card', {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.pricing',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Who we are section animations
  gsap.from('.who-text', {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.who-we-are',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  gsap.from('.who-image img', {
    x: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.who-we-are',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Get started section with bounce effect
  gsap.from('.started-actions', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'bounce.out',
    scrollTrigger: {
      trigger: '.get-started',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Contact section animations
  gsap.from('.contact-info', {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  gsap.from('.contact-form', {
    x: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Mission vision cards with rotation effect
  gsap.from('.section-card', {
    rotationY: -90,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.mission-vision',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Smooth scroll for menu links
  gsap.utils.toArray('.horizontal-menu a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href'))
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power2.inOut'
        })
      }
    })
  })

  // Add scroll progress indicator
  const progressBar = document.createElement('div')
  progressBar.className = 'scroll-progress'
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #25ced1, #1fa3a6);
    z-index: 9999;
    transition: width 0.3s ease;
  `
  document.body.appendChild(progressBar)

  gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  })

  // Floating animation for emojis in sections
  gsap.utils.toArray('.section-title .emoji').forEach(emoji => {
    gsap.to(emoji, {
      y: -10,
      duration: 2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2
    })
  })

  // Pulse animation for service icons
  gsap.utils.toArray('.service-icon, .reason-icon').forEach(icon => {
    gsap.to(icon, {
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 1
    })
  })

  // Wave animation for step cards
  gsap.utils.toArray('.step-card').forEach((card, index) => {
    gsap.to(card, {
      y: -10,
      duration: 2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      delay: index * 0.2
    })
  })

  // Scroll-based color transitions
  gsap.to('.horizontal-header', {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.banner-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  // Parallax for section backgrounds
  gsap.utils.toArray('.who-we-are, .how-works, .why-us').forEach(section => {
    gsap.to(section, {
      backgroundPositionY: '50%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })

  // Scale animation for pricing cards on scroll
  gsap.to('.pricing-card.featured', {
    scale: 1.1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.pricing',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Continuous rotation for emojis
  gsap.utils.toArray('.emoji').forEach(emoji => {
    gsap.to(emoji, {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1
    })
  })

  // Remove scroll-based opacity changes for banner elements
  // gsap.to('.banner-emojis span', {
  //   opacity: 0.3,
  //   stagger: 0.1,
  //   ease: 'none',
  //   scrollTrigger: {
  //     trigger: '.banner-section',
  //     start: 'top top',
  //     end: 'bottom top',
  //     scrub: true
  //   }
  // })

  // Counter animation for statistics
  function animateCounter(element, target) {
    const duration = 2000
    const start = 0
    const end = parseInt(target)
    const startTime = performance.now()

    function update(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(start + (end - start) * easeOutQuart)

      element.textContent = current.toLocaleString()

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }

  // Trigger counter animations on scroll for both sections
  ScrollTrigger.create({
    trigger: '.statistics',
    start: 'top 80%',
    onEnter: () => {
      gsap.utils.toArray('.statistics .stat-number').forEach(number => {
        const target = number.dataset.target
        animateCounter(number, target)
      })
    }
  })

  ScrollTrigger.create({
    trigger: '.mission-vision',
    start: 'top 80%',
    onEnter: () => {
      gsap.utils.toArray('.mission-stats .stat-number').forEach(number => {
        const target = number.dataset.target
        animateCounter(number, target)
      })
    }
  })

  // Statistics cards entrance animation
  gsap.from('.stat-item', {
    y: 50,
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'back.out(1.7)',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.statistics',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // Animate all paragraphs with fade-in-up
  gsap.utils.toArray('p').forEach(paragraph => {
    gsap.from(paragraph, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: paragraph,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Animate all images with slide-in effects
  gsap.utils.toArray('img').forEach(img => {
    gsap.from(img, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: img,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Animate all h3 headings
  gsap.utils.toArray('h3').forEach(heading => {
    gsap.from(heading, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Animate form inputs and buttons
  gsap.utils.toArray('input, textarea, button').forEach(element => {
    gsap.from(element, {
      y: 20,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Animate footer elements
  gsap.from('.home-footer', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.home-footer',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  })

  // Animate all spans with emojis
  gsap.utils.toArray('span').forEach(span => {
    if (span.textContent.includes('🏥') || span.textContent.includes('👨‍⚕️') || span.textContent.includes('⭐') ||
        span.textContent.includes('⚡') || span.textContent.includes('💊') || span.textContent.includes('❤️') ||
        span.textContent.includes('🤝') || span.textContent.includes('😊') || span.textContent.includes('🚀') ||
        span.textContent.includes('📞') || span.textContent.includes('💎')) {
      gsap.from(span, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: span,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })
    }
  })

  // Animate all list items
  gsap.utils.toArray('li').forEach(item => {
    gsap.from(item, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Animate all divs with background colors (cards)
  gsap.utils.toArray('div').forEach(div => {
    const computedStyle = window.getComputedStyle(div)
    if (computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && computedStyle.backgroundColor !== 'transparent') {
      gsap.from(div, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: div,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })
    }
  })

  // Add mouse-follow parallax to banner (only for carousel slides)
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight

    // Only apply to active carousel slide
    const activeSlide = document.querySelector('.carousel-slide.active')
    if (activeSlide) {
      const img = activeSlide.querySelector('.slide-background img')
      const title = activeSlide.querySelector('.slide-title')

      if (img) {
        gsap.to(img, {
          x: (mouseX - 0.5) * 20,
          y: (mouseY - 0.5) * 20,
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      if (title) {
        gsap.to(title, {
          x: (mouseX - 0.5) * 10,
          y: (mouseY - 0.5) * 10,
          duration: 0.5,
          ease: 'power2.out'
        })
      }
    }
  })

  // Remove scroll-based zoom effect for banner carousel
  // gsap.to('.banner-section', {
  //   scale: 1.1,
  //   ease: 'none',
  //   scrollTrigger: {
  //     trigger: '.banner-section',
  //     start: 'top top',
  //     end: 'bottom top',
  //     scrub: true
  //   }
  // })

  // Page load animation sequence
  const tl = gsap.timeline()

  tl.from('.horizontal-header', {
    y: -100,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })
  .from('.banner-section', {
    scale: 1.2,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out'
  }, '-=0.5')
  .from('.main-content > section:first-child', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.5')

  // Add hover effects to all cards
  gsap.utils.toArray('.clinic-card, .service-card, .reason-card, .pricing-card, .stat-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // Add click ripple effect to buttons
  gsap.utils.toArray('button, .menu-btn, .cta-btn, .pricing-btn, .started-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `

      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'

      btn.style.position = 'relative'
      btn.appendChild(ripple)

      setTimeout(() => ripple.remove(), 600)
    })
  })

  // Add CSS for ripple animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
})
</script>

<style src="../assets/home.css" scoped></style>
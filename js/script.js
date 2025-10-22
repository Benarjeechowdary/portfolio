// ===== GLOBAL VARIABLES =====
let skillsAnimated = false;
let heroChart = null;

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeNavigation();
  initializeScrollEffects();
  initializeSkillsAnimation();
  initializeContactForm();
  initializeHeroChart();
  initializeScrollToTop();

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
});

// ===== NAVIGATION =====
function initializeNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    }
  });

  // Active section highlighting
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);
}

// ===== SMOOTH SCROLLING =====
function initializeScrollEffects() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const navbarHeight = document.getElementById("navbar").offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ===== SKILLS ANIMATION =====
function initializeSkillsAnimation() {
  const skillsSection = document.getElementById("skills");
  const skillBars = document.querySelectorAll(".skill-progress");

  function animateSkills() {
    if (skillsAnimated) return;

    const rect = skillsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      skillsAnimated = true;

      skillBars.forEach((bar, index) => {
        setTimeout(() => {
          const width = bar.getAttribute("data-width");
          bar.style.setProperty("--target-width", width);
          bar.style.width = width;
          bar.classList.add("animate");
        }, index * 200);
      });
    }
  }

  window.addEventListener("scroll", animateSkills);
  animateSkills(); // Check on load
}

// ===== HERO CHART =====
function initializeHeroChart() {
  const ctx = document.getElementById("heroChart");
  if (!ctx || typeof Chart === "undefined") return;

  // Destroy existing chart if it exists
  if (heroChart) {
    heroChart.destroy();
  }

  const data = {
    labels: ["Python", "SQL", "Power BI", "Machine Learning", "Excel"],
    datasets: [
      {
        label: "Skill Level",
        data: [90, 85, 80, 70, 95],
        backgroundColor: [
          "#FFFFFF",
          "#FDEE00",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "#FFFFFF",
          "#FDEE00",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const config = {
    type: "radar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false,
          },
          grid: {
            color: "rgba(255, 255, 255, 0.3)",
          },
          angleLines: {
            color: "rgba(255, 255, 255, 0.3)",
          },
          pointLabels: {
            color: "rgba(255, 255, 255, 0.9)",
            font: {
              size: 12,
              weight: "600",
            },
          },
        },
      },
      elements: {
        point: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 2,
          radius: 4,
        },
        line: {
          borderColor: "rgba(37, 99, 235, 0.8)",
          borderWidth: 2,
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
    },
  };

  heroChart = new Chart(ctx, config);
}

// ===== CONTACT FORM =====
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Reset form
      contactForm.reset();
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;

      showNotification(
        "Thank you for your message! I'll get back to you soon.",
        "success"
      );
    }, 2000);
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                ? "fa-exclamation-circle"
                : "fa-info-circle"
            }"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#10b981"
            : type === "error"
            ? "#ef4444"
            : "#3b82f6"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

  // Add notification to body
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
  // Create scroll to top button
  const scrollToTopBtn = document.createElement("a");
  scrollToTopBtn.href = "#home";
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollToTopBtn);

  // Show/hide scroll to top button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== DYNAMIC CONTENT LOADING =====
function loadProjectDetails(projectId) {
  // This would typically load project details from an API
  const projects = {
    "customer-segmentation": {
      title: "Customer Segmentation Analysis",
      description:
        "Advanced customer segmentation using RFM analysis and K-means clustering...",
      technologies: ["Python", "Scikit-learn", "Plotly", "Pandas"],
      results: ["$2.5M Revenue Increase", "25% Retention Boost"],
      githubUrl: "https://github.com/yourusername/customer-segmentation",
      demoUrl: "https://your-demo-url.com",
    },
    // Add more projects as needed
  };

  return projects[projectId] || null;
}

// ===== THEME TOGGLE (Optional) =====
function initializeThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Update theme toggle icon
    const icon = themeToggle.querySelector("i");
    icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  // Observe elements that need animation
  document
    .querySelectorAll(".project-card, .timeline-item, .skill-item")
    .forEach((el) => {
      observer.observe(el);
    });
}

// ===== TYPING EFFECT =====
function createTypingEffect(
  element,
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  delay = 2000
) {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      speed = delay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(type, speed);
  }

  type();
}

// ===== PARALLAX EFFECT =====
function initializeParallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    parallaxElements.forEach((element) => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  if (parallaxElements.length > 0) {
    window.addEventListener("scroll", debounce(updateParallax, 10));
  }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ""));
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent =
          Math.ceil(current) + (counter.textContent.includes("+") ? "+" : "");
        setTimeout(updateCounter, 20);
      } else {
        counter.textContent = counter.textContent; // Restore original format
      }
    };

    updateCounter();
  });
}

// ===== LAZY LOADING IMAGES =====
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// ===== ERROR HANDLING =====
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  // You could send this to an error reporting service
});

// ===== ADDITIONAL CSS ANIMATIONS =====
const additionalCSS = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
}

.notification-close:hover {
    opacity: 0.8;
}
`;

// Inject additional CSS
const style = document.createElement("style");
style.textContent = additionalCSS;
document.head.appendChild(style);

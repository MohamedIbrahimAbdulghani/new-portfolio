/* ========================================================================
   Mohamed Ibrahim Abdulghani — Portfolio Scripts
   Theme, Language, Form, Scroll Animations, Navigation
   ======================================================================== */

const state = {
  theme: localStorage.getItem("theme") || "light",
  lang: localStorage.getItem("lang") || "en"
};

/* ----- Theme ----- */
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem("theme", theme);

  const icon = document.getElementById("theme-icon");

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    if (icon) icon.textContent = "light_mode";
  } else {
    document.documentElement.classList.remove("dark");
    if (icon) icon.textContent = "dark_mode";
  }
}

/* ----- Language ----- */
function applyLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("lang", lang);

  const isArabic = lang === "ar";

  document.documentElement.lang = lang;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  const translations = isArabic ? window.arTranslations : window.enTranslations;

  if (translations) {
    // نص عادي
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const keys = el.getAttribute("data-i18n").split(".");
      let text = translations;
      for (const k of keys) {
        text = text && text[k] !== undefined ? text[k] : null;
      }
      if (text !== null && text !== undefined) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Placeholders عبر data-i18n-ph
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      const keys = el.getAttribute("data-i18n-ph").split(".");
      let text = translations;
      for (const k of keys) {
        text = text && text[k] !== undefined ? text[k] : null;
      }
      if (text !== null && text !== undefined) {
        el.placeholder = text;
      }
    });
  }

  // تحديث زر اللغة
  const langText = document.getElementById("lang-text");
  if (langText) {
    langText.textContent = isArabic ? "EN" : "عربي";
  }

  // تحديث نافذة دراسة الحالة إذا كانت مفتوحة
  if (typeof activeCaseStudyId !== "undefined" && activeCaseStudyId) {
    openCaseStudy(activeCaseStudyId);
  }
}

/* ----- Copy Email ----- */
function copyEmail() {
  const email = "devmohamed200@gmail.com";
  const btn = document.getElementById("copy-email-btn");

  const originalText = state.lang === "ar" ? "نسخ" : "Copy";
  const copiedText = state.lang === "ar" ? "تم!" : "Copied!";

  navigator.clipboard.writeText(email).then(() => {
    if (btn) {
      btn.textContent = copiedText;
      setTimeout(() => { btn.textContent = originalText; }, 2000);
    }
  }).catch(() => {
    // Fallback
    const temp = document.createElement("input");
    temp.value = email;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    if (btn) {
      btn.textContent = copiedText;
      setTimeout(() => { btn.textContent = originalText; }, 2000);
    }
  });
}

/* ----- Scroll Reveal (IntersectionObserver) ----- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // عرض كل العناصر مباشرة لو المستخدم عنده reduced motion
    document.querySelectorAll(".reveal").forEach(el => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
  });
}

/* ----- Skill Bars Smooth Fill Animation ----- */
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-bar-fill");
  if (!skillBars.length) return;

  skillBars.forEach(bar => {
    const targetWidth = bar.style.width || "0%";
    bar.dataset.targetWidth = targetWidth;
    bar.style.width = "0%";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.style.width = bar.dataset.targetWidth;
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ----- Navigation Scroll Behavior ----- */
function initNavScroll() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ----- Active Navigation Link ----- */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
  );

  sections.forEach(section => observer.observe(section));
}

/* ----- Smooth Scroll for Anchor Links ----- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // روابط القائمة الجانبية للموبايل بنعالجها لوحدها مع حساب حركة القائمة
    if (anchor.closest("#mobile-menu")) return;

    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#" || href === "#home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // ارتفاع الـ nav
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: "smooth" });
      }
    });
  });
}

/* ----- DOM Ready ----- */
document.addEventListener("DOMContentLoaded", () => {

  // 1. Initial state
  applyTheme(state.theme);
  setTimeout(() => applyLanguage(state.lang), 20);

  // 2. Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(state.theme === "light" ? "dark" : "light");
    });
  }

  // 3. Language toggle
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLanguage(state.lang === "en" ? "ar" : "en");
    });
  }

  // 4. Mobile menu
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains("open");
      mobileMenu.classList.toggle("open", isOpen);
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const icon = menuBtn.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = isOpen ? "close" : "menu";
    };

    menuBtn.addEventListener("click", () => {
      toggleMenu();
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", (e) => {
        const wasOpen = mobileMenu.classList.contains("open");
        const menuHeight = wasOpen ? mobileMenu.offsetHeight : 0;

        toggleMenu(false);

        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          if (href === "#" || href === "#home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            const target = document.querySelector(href);
            if (target) {
              const offset = 80;
              // بنطرح ارتفاع القائمة اللي اتقفلت علشان نوصل للمكان المظبوط بالمللي
              const position = target.getBoundingClientRect().top + window.scrollY - offset - menuHeight;
              window.scrollTo({ top: Math.max(0, position), behavior: "smooth" });
            }
          }
        }
      });
    });

    // إغلاق القائمة عند الضغط خارجها
    document.addEventListener("click", (e) => {
      if (!mobileMenu.classList.contains("open")) return;
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // إعادة الضبط التلقائي عند تكبير الشاشة لسطح المكتب
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && mobileMenu.classList.contains("open")) {
        toggleMenu(false);
      }
    });
  }

  // 5. Contact form
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formFeedback = document.getElementById("form-feedback");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const originalBtnHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>${state.lang === "ar" ? "جاري الإرسال..." : "Sending..."}</span>`;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          formFeedback.className = "form-feedback form-feedback--success";
          formFeedback.textContent = state.lang === "ar"
            ? "✓ تم إرسال رسالتك بنجاح! سأتواصل معك قريباً."
            : "✓ Message sent successfully! I'll get back to you shortly.";
          contactForm.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (err) {
        formFeedback.className = "form-feedback form-feedback--error";
        formFeedback.textContent = state.lang === "ar"
          ? "✕ حدث خطأ. راسلني مباشرة على devmohamed200@gmail.com"
          : "✕ Error sending message. Please email me at devmohamed200@gmail.com";
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        setTimeout(() => {
          formFeedback.className = "form-feedback";
        }, 6000);
      }
    });
  }

  // 6. Scroll features
  initScrollReveal();
  initSkillBars();
  initNavScroll();
  initActiveNav();
  initSmoothScroll();
  initGoTop();
});

/* ========================================================================
   Case Study Modal & Data (Bilingual)
   ======================================================================== */

let activeCaseStudyId = null;

const caseStudiesData = {
  invoice: {
    en: {
      category: "Full-Stack Laravel Platform",
      title: "Invoice & Financial Management System",
      challenge: "Managing manual paper billing was causing delays in invoice approvals, calculation errors in variable tax rates, and a high risk of unauthorized financial data alterations.",
      solution: "Engineered a secure 3NF database architecture in MySQL. Implemented role-based access control (Admin, Accountant, Viewer) using Laravel Policies & Gates. Automated PDF invoice generation with embedded QR verification using DomPDF, and added streaming Excel financial exports.",
      result: "Achieved 60% faster billing cycles, 100% elimination of permission overlaps, and zero financial discrepancies across monthly auditing reports.",
      stack: ["Laravel 10", "MySQL", "DomPDF", "Maatwebsite Excel", "RBAC", "Bootstrap 5"],
      github: "https://github.com/MohamedIbrahimAbdulghani/invoice-system",
      demo: null
    },
    ar: {
      category: "منصة ويب متكاملة بـ Laravel",
      title: "نظام إدارة الفواتير والتقارير المالية",
      challenge: "كانت الفواتير اليدوية تتسبب في بطء اعتماد المعاملات، وأخطاء حسابية في نسب الضرائب، وخطر تعديل البيانات المالية دون صلاحيات محددة.",
      solution: "تصميم قاعدة بيانات معيارية (3NF) على MySQL، وتطبيق نظام صلاحيات دقيق (مدير، محاسب، مشاهد) عبر Laravel Policies. توليد فواتير PDF آلية برمز QR عبر DomPDF، مع تصدير تقارير محاسبية تفصيلية بصيغة Excel.",
      result: "تسريع إصدار الفواتير بنسبة 60%، منع أي تداخل في الصلاحيات بنسبة 100%، وتصفير الأخطاء المحاسبية في الإقرارات الشهرية.",
      stack: ["Laravel 10", "MySQL", "DomPDF", "Maatwebsite Excel", "RBAC", "Bootstrap 5"],
      github: "https://github.com/MohamedIbrahimAbdulghani/invoice-system",
      demo: null
    }
  },
  school: {
    en: {
      category: "Educational ERP Platform",
      title: "School Management System (ERP)",
      challenge: "Fragmented communication and record-keeping between administrators, teachers, parents, and students, resulting in manual exam correction and slow tuition fee tracking.",
      solution: "Developed an enterprise ERP on Laravel Jetstream utilizing multi-guard authentication. Built a dynamic online examination engine with automated instant grading, polymorphic fee transactions, and an interactive Livewire dashboard for teachers and parents.",
      result: "Reduced administrative operational overhead by 50%, enabled instantaneous test score publication, and eliminated fee recording disputes.",
      stack: ["Laravel 10", "Jetstream", "Livewire", "MySQL", "Multi-Guard Auth", "Polymorphic Relations"],
      github: "https://github.com/MohamedIbrahimAbdulghani/school-system",
      demo: null
    },
    ar: {
      category: "منصة إدارة مدرسية شاملة",
      title: "نظام إدارة المدارس التعليمي (ERP)",
      challenge: "تشتت التواصل وسجلات الطلاب بين الإدارة والمعلمين وأولياء الأمور، مع بطء التصحيح اليدوي للاختبارات وصعوبة متابعة سداد المصروفات الدراسية.",
      solution: "بناء منصة ERP عبر Laravel Jetstream بمصادقة متعددة البوابات (Multi-Guard) لكل دور. تصميم نظام اختبارات إلكترونية بتصحيح فوري تلقائي، وسجل مدفوعات متعدد الأطراف، ولوحات تحكم تفاعلية عبر Livewire.",
      result: "تقليل الأعباء الإدارية بنسبة 50%، إعلان نتائج الامتحانات فورياً للطلاب، وحوكمة كاملة لدورة المصروفات المدرسية.",
      stack: ["Laravel 10", "Jetstream", "Livewire", "MySQL", "Multi-Guard Auth", "Polymorphic Relations"],
      github: "https://github.com/MohamedIbrahimAbdulghani/school-system",
      demo: null
    }
  },
  job: {
    en: {
      category: "AI-Assisted Hiring Engine",
      title: "Recruitment & Candidate Matching Platform",
      challenge: "Recruitment teams were flooded with hundreds of unstructured candidate CVs per posting, making manual screening exhausting and prone to missing top talent.",
      solution: "Architected a candidate ranking engine in Laravel 11. Built a ResumeAnalysisService that tokenizes and extracts skills from uploaded resumes, comparing them against job specifications using a custom weighted scoring algorithm. Offloaded file analysis to async Redis queue workers.",
      result: "Streamlined resume evaluation time by 70%, ranking applicants automatically by relevance percentage with sub-second retrieval times.",
      stack: ["Laravel 11", "Redis Queues", "MySQL", "RESTful API", "Text Parsing Algorithm", "Blade"],
      github: "https://github.com/MohamedIbrahimAbdulghani/Job_vacancies_platform",
      demo: "https://job-app-master-h374ga.free.laravel.cloud/"
    },
    ar: {
      category: "محرك فرز وترشيح ذكي للوظائف",
      title: "منصة التوظيف ومطابقة الكفاءات",
      challenge: "تراكم مئات السير الذاتية غير المنظمة لكل إعلان وظيفي، مما استنزف وقت فرق الموارد البشرية في الفرز اليدوي مع احتمالية تفويت الكفاءات الأنسب.",
      solution: "تطوير محرك تصنيف متقدم بـ Laravel 11 عبر خدمة ResumeAnalysisService لتحليل واستخراج كلمات المهارات من ملفات السير الذاتية ومطابقتها مع شروط الوظيفة بخوارزمية ترجيحية. معالجة العمليات الثقيلة بالخلفية عبر Redis Queues.",
      result: "تقليص زمن فرز المتقدمين بنسبة 70%، مع ترتيب فوري للمرشحين حسب نسبة التطابق وتوفير واجهات RESTful سريعة.",
      stack: ["Laravel 11", "Redis Queues", "MySQL", "RESTful API", "Text Parsing Algorithm", "Blade"],
      github: "https://github.com/MohamedIbrahimAbdulghani/Job_vacancies_platform",
      demo: "https://job-app-master-h374ga.free.laravel.cloud/"
    }
  }
};

function openCaseStudy(projectId) {
  const project = caseStudiesData[projectId];
  if (!project) return;

  activeCaseStudyId = projectId;
  const isAr = state.lang === "ar";
  const data = isAr ? project.ar : project.en;

  const categoryEl = document.getElementById("modal-category");
  const titleEl = document.getElementById("modal-title");
  const challengeH = document.getElementById("modal-challenge-heading");
  const challengeText = document.getElementById("modal-challenge");
  const solutionH = document.getElementById("modal-solution-heading");
  const solutionText = document.getElementById("modal-solution");
  const resultH = document.getElementById("modal-result-heading");
  const resultText = document.getElementById("modal-result");
  const stackH = document.getElementById("modal-stack-heading");
  const stackContainer = document.getElementById("modal-stack");
  const demoBtn = document.getElementById("modal-demo-btn");
  const demoText = document.getElementById("modal-demo-text");
  const codeBtn = document.getElementById("modal-code-btn");
  const codeText = document.getElementById("modal-code-text");

  if (categoryEl) categoryEl.textContent = data.category;
  if (titleEl) titleEl.textContent = data.title;
  if (challengeH) challengeH.textContent = isAr ? "التحدي التقني" : "The Challenge";
  if (challengeText) challengeText.textContent = data.challenge;
  if (solutionH) solutionH.textContent = isAr ? "الحل الهندسي والتنفيذ" : "The Solution";
  if (solutionText) solutionText.textContent = data.solution;
  if (resultH) resultH.textContent = isAr ? "النتائج والأثر الملموس" : "Key Results & Impact";
  if (resultText) resultText.textContent = data.result;
  if (stackH) stackH.textContent = isAr ? "التقنيات المستخدمة" : "Technologies Used";

  if (stackContainer) {
    stackContainer.innerHTML = data.stack
      .map(tag => `<span class="project__tag">${tag}</span>`)
      .join("");
  }

  if (demoBtn) {
    if (data.demo) {
      demoBtn.href = data.demo;
      demoBtn.style.display = "inline-flex";
      if (demoText) demoText.textContent = isAr ? "معاينة حية" : "Live Demo";
    } else {
      demoBtn.style.display = "none";
    }
  }

  if (codeBtn) {
    codeBtn.href = data.github;
    if (codeText) codeText.textContent = isAr ? "عرض الكود المصدري" : "View Source Code";
  }

  const modal = document.getElementById("case-modal");
  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeCaseStudy() {
  const modal = document.getElementById("case-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
  activeCaseStudyId = null;
}

window.openCaseStudy = openCaseStudy;
window.closeCaseStudy = closeCaseStudy;

// ESC to close modal
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCaseStudy();
  }
});

/* ----- Floating Go to Top Button ----- */
function initGoTop() {
  const goTopBtn = document.getElementById("goTopBtn");
  if (!goTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      goTopBtn.classList.add("visible");
    } else {
      goTopBtn.classList.remove("visible");
    }
  }, { passive: true });
}


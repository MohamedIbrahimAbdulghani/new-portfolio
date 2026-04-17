    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // Case Study Functions
    function openCaseStudy(project) {
      const modal = document.getElementById('case-modal');
      const title = document.getElementById('case-title');
      const content = document.getElementById('case-content');
      
      if (project === 'invoice') {
        title.innerText = 'Invoice System - Case Study';
        content.innerHTML = `<div class="space-y-3"><div class="bg-blue-50 p-3 sm:p-4 rounded-lg"><strong>🎯 Challenge:</strong> Businesses needed a complete invoicing solution with role-based access control, payment tracking, and multi-format export capabilities (Excel/PDF).</div><div class="bg-green-50 p-3 sm:p-4 rounded-lg"><strong>⚡ Solution:</strong> Built with Laravel 10, implementing Admin/User roles with granular permissions. Features include invoice management, partial/full payments, product/category management, and automated exports.</div><div class="bg-purple-50 p-3 sm:p-4 rounded-lg"><strong>📈 Result:</strong> Reduced invoice processing time by 60%, eliminated manual errors, and provided real-time financial reporting for business owners.</div><div class="bg-gray-50 p-3 rounded-lg text-sm"><strong>🛠 Tech Stack:</strong> Laravel 10, MySQL, JavaScript, Tailwind CSS, Laravel Excel, DomPDF</div></div>`;
      } else if (project === 'school') {
        title.innerText = 'School Management System - Case Study';
        content.innerHTML = `<div class="space-y-3"><div class="bg-blue-50 p-3 sm:p-4 rounded-lg"><strong>🎯 Challenge:</strong> Schools needed a unified platform to manage students, teachers, exams, fees, and communication across multiple roles.</div><div class="bg-green-50 p-3 sm:p-4 rounded-lg"><strong>⚡ Solution:</strong> Developed multi-role Laravel application with Jetstream authentication. Features include academic stage management, online exams with auto-grading, fee tracking, library system, and e-learning integration.</div><div class="bg-purple-50 p-3 sm:p-4 rounded-lg"><strong>📈 Result:</strong> Streamlined school operations, reduced administrative workload by 50%, improved parent-teacher communication, and enabled remote learning.</div><div class="bg-gray-50 p-3 rounded-lg text-sm"><strong>🛠 Tech Stack:</strong> Laravel, Jetstream, Livewire, MySQL, Tailwind CSS, Zoom API</div></div>`;
      } else if (project === 'job') {
        title.innerText = 'Job Vacancies Platform - Case Study';
        content.innerHTML = `<div class="space-y-3"><div class="bg-blue-50 p-3 sm:p-4 rounded-lg"><strong>🎯 Challenge:</strong> Job seekers struggled to find relevant positions; employers needed better candidate filtering with intelligent resume parsing.</div><div class="bg-green-50 p-3 sm:p-4 rounded-lg"><strong>⚡ Solution:</strong> Built Laravel platform with ResumeAnalysisService that extracts and analyzes resume data. Features include AI-powered candidate-job matching, application tracking, and analytics dashboard.</div><div class="bg-purple-50 p-3 sm:p-4 rounded-lg"><strong>📈 Result:</strong> Improved job matching accuracy by 70%, reduced time-to-hire, and provided valuable insights for both job seekers and employers.</div><div class="bg-gray-50 p-3 rounded-lg text-sm"><strong>🛠 Tech Stack:</strong> Laravel, MySQL, AI/ML integration, Resume Parsing Library, Analytics Dashboard</div></div>`;
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeCaseStudy() {
      const modal = document.getElementById('case-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function closeCaseStudyOnOutside(event) {
      if (event.target.id === 'case-modal') {
        closeCaseStudy();
      }
    }

    // Formspree Handler
    const form = document.getElementById('contact-form');
    const msgDiv = document.getElementById('form-message');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
          const response = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
          if (response.ok) {
            msgDiv.className = 'mt-4 p-3 rounded-xl text-center text-sm bg-green-100 text-green-800';
            msgDiv.innerHTML = '<i class="fas fa-check-circle"></i> Thanks! I\'ll reply soon.';
            form.reset();
          } else { throw new Error(); }
        } catch (error) {
          msgDiv.className = 'mt-4 p-3 rounded-xl text-center text-sm bg-red-100 text-red-700';
          msgDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error. Please email me directly.';
        }
        msgDiv.classList.remove('hidden');
        setTimeout(() => msgDiv.classList.add('hidden'), 5000);
      });
    }

    // Animate skill bars on view
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = width; }, 100);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => observer.observe(bar));

    // Go to Top Button
    const goTopBtn = document.getElementById('goTopBtn');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        goTopBtn.classList.add('show');
      } else {
        goTopBtn.classList.remove('show');
      }
    });
    goTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Set demo links (عدل الروابط هنا بعد ما تستضيف المشاريع)
    // document.getElementById('demo-link-1')?.setAttribute('href', 'https://your-invoice-demo.com');
    // document.getElementById('demo-link-2')?.setAttribute('href', 'https://your-school-demo.com');
    // document.getElementById('demo-link-3')?.setAttribute('href', 'https://your-job-demo.com');
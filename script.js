(function() {
    const form = document.getElementById('roseoud-style-reservation-form');
    if (!form) return;
    const stepForms = Array.from(form.querySelectorAll('.step-form'));
    let currentStep = 1;
    // Reservation data
    let reservation = {
        partySize: 1,
        date: '',
        mealType: '',
        timeSlot: '',
        name: '',
        email: '',
        phone: '',
        note: ''
    };
    // Meal type to time slots
    const mealTimeSlots = {
        breakfast: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM'],
        lunch: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'],
        dinner: ['06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM']
    };
    // Set min date to today
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
    function showStep(step) {
        stepForms.forEach(f => f.classList.remove('active'));
        const formToShow = stepForms.find(f => f.getAttribute('data-step') == step);
        if (formToShow) formToShow.classList.add('active');
        currentStep = step;
        if (step == 5) fillSummary();
    }
    function validateStep(step) {
        const formEl = stepForms.find(f => f.getAttribute('data-step') == step);
        if (!formEl) return false;
        let valid = true;
        // Step 1: party size
        if (step == 1 && !reservation.partySize) valid = false;
        // Step 2: date
        if (step == 2) {
            const dateInput = formEl.querySelector('input[name="date"]');
            if (!dateInput.value) {
                dateInput.style.borderColor = 'red';
                valid = false;
            } else {
                dateInput.style.borderColor = '';
                reservation.date = dateInput.value;
            }
        }
        // Step 3: meal type & time slot
        if (step == 3 && (!reservation.mealType || !reservation.timeSlot)) valid = false;
        // Step 4: user details
        if (step == 4) {
            ['name','email','phone'].forEach(field => {
                const input = formEl.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    valid = false;
                } else {
                    input.style.borderColor = '';
                    reservation[field] = input.value.trim();
                }
            });
            reservation.note = formEl.querySelector('[name="note"]').value.trim();
        }
        return valid;
    }
    // Party size selection
    form.querySelectorAll('.party-size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            form.querySelectorAll('.party-size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            reservation.partySize = btn.getAttribute('data-size');
            form.querySelector('.party-size-select').value = '';
        });
    });
    // Party size dropdown
    const partySizeSelect = form.querySelector('.party-size-select');
    if (partySizeSelect) {
        partySizeSelect.addEventListener('change', function() {
            form.querySelectorAll('.party-size-btn').forEach(b => b.classList.remove('active'));
            reservation.partySize = partySizeSelect.value || 1;
        });
    }
    // Meal type selection
    form.querySelectorAll('.meal-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            form.querySelectorAll('.meal-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            reservation.mealType = btn.getAttribute('data-meal');
            // Populate time slots
            const timeSlotGroup = form.querySelector('.time-slot-group');
            timeSlotGroup.innerHTML = '';
            reservation.timeSlot = '';
            // Only show future time slots if date is today
            let slots = mealTimeSlots[reservation.mealType];
            let showSlots = slots;
            if (reservation.date) {
                const today = new Date();
                const selectedDate = new Date(reservation.date + 'T00:00:00');
                if (today.toDateString() === selectedDate.toDateString()) {
                    // Only show future time slots
                    const now = new Date();
                    showSlots = slots.filter(slot => {
                        // Convert slot to 24h time
                        const [time, ampm] = slot.split(' ');
                        let [h, m] = time.split(':').map(Number);
                        if (ampm === 'PM' && h !== 12) h += 12;
                        if (ampm === 'AM' && h === 12) h = 0;
                        const slotDate = new Date();
                        slotDate.setHours(h, m, 0, 0);
                        return slotDate > now;
                    });
                }
            }
            showSlots.forEach(slot => {
                const slotBtn = document.createElement('button');
                slotBtn.type = 'button';
                slotBtn.className = 'time-slot-btn';
                slotBtn.textContent = slot;
                slotBtn.addEventListener('click', function() {
                    timeSlotGroup.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
                    slotBtn.classList.add('active');
                    reservation.timeSlot = slot;
                });
                timeSlotGroup.appendChild(slotBtn);
            });
            // If no slots available, show message
            if (showSlots.length === 0) {
                const msg = document.createElement('div');
                msg.textContent = 'No available time slots for the selected date.';
                msg.style.color = 'red';
                msg.style.marginTop = '10px';
                timeSlotGroup.appendChild(msg);
            }
        });
    });
    // When date changes, reset meal type and time slot
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            reservation.date = dateInput.value;
            // Reset meal type and time slot
            reservation.mealType = '';
            reservation.timeSlot = '';
            form.querySelectorAll('.meal-type-btn, .time-slot-btn').forEach(b => b.classList.remove('active'));
            const timeSlotGroup = form.querySelector('.time-slot-group');
            if (timeSlotGroup) timeSlotGroup.innerHTML = '';
        });
    }
    // Step navigation
    form.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (validateStep(currentStep)) showStep(currentStep + 1);
        });
    });
    form.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showStep(currentStep - 1);
        });
    });
    // Summary
    function fillSummary() {
        const summary = form.querySelector('.reservation-summary');
        if (!summary) return;
        summary.innerHTML = `
            <div><b>Party Size:</b> ${reservation.partySize}</div>
            <div><b>Date:</b> ${reservation.date}</div>
            <div><b>Meal Type:</b> ${reservation.mealType.charAt(0).toUpperCase() + reservation.mealType.slice(1)}</div>
            <div><b>Time Slot:</b> ${reservation.timeSlot}</div>
            <div><b>Name:</b> ${reservation.name}</div>
            <div><b>Email:</b> ${reservation.email}</div>
            <div><b>Phone:</b> ${reservation.phone}</div>
            ${reservation.note ? `<div><b>Special Requests:</b> ${reservation.note}</div>` : ''}
        `;
    }
    // Submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        // WhatsApp message logic
        let msg = `New Reservation at Coffee Dose:\n`;
        msg += `Name: ${reservation.name}\n`;
        msg += `Email: ${reservation.email}\n`;
        msg += `Phone: ${reservation.phone}\n`;
        msg += `Date: ${reservation.date}\n`;
        msg += `Party Size: ${reservation.partySize}\n`;
        msg += `Meal Type: ${reservation.mealType}\n`;
        msg += `Time Slot: ${reservation.timeSlot}\n`;
        if (reservation.note) msg += `Special Requests: ${reservation.note}\n`;
        const ownerNumber = '94716836787';
        const whatsappLink = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(msg)}`;
        // Immediately redirect to WhatsApp
        window.location.href = whatsappLink;
        // Reset form and state (optional, not visible to user after redirect)
        form.reset();
        reservation = { partySize: 1, date: '', mealType: '', timeSlot: '', name: '', email: '', phone: '', note: '' };
        form.querySelectorAll('.party-size-btn, .meal-type-btn, .time-slot-btn').forEach(b => b.classList.remove('active'));
        showStep(1);
    });
    // Show first step
    showStep(1);
})();
// WhatsApp notification for reservation form (reservation.html)
document.addEventListener("DOMContentLoaded", function() {
    const reservationForm = document.getElementById('roseoud-style-reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Collect form data
            const formData = new FormData(reservationForm);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const date = formData.get('date') || '';
            // Try to get party size from button or select
            let partySize = formData.get('party-size-select') || '';
            if (!partySize) {
                // Try to get from checked party size button
                const activeBtn = reservationForm.querySelector('.party-size-btn.active');
                if (activeBtn) partySize = activeBtn.getAttribute('data-size');
            }
            // Meal type
            let mealType = formData.get('mealType') || '';
            if (!mealType) {
                const activeMeal = reservationForm.querySelector('.meal-type-btn.active');
                if (activeMeal) mealType = activeMeal.getAttribute('data-meal');
            }
            // Time slot
            let timeSlot = formData.get('timeSlot') || '';
            if (!timeSlot) {
                const activeSlot = reservationForm.querySelector('.time-slot-btn.active');
                if (activeSlot) timeSlot = activeSlot.textContent;
            }
            const note = formData.get('note') || '';
            // Format WhatsApp message
            let msg = `New Reservation at Coffee Dose:\n`;
            msg += `Name: ${name}\n`;
            msg += `Email: ${email}\n`;
            msg += `Phone: ${phone}\n`;
            msg += `Date: ${date}\n`;
            msg += `Party Size: ${partySize}\n`;
            msg += `Meal Type: ${mealType}\n`;
            msg += `Time Slot: ${timeSlot}\n`;
            if (note) msg += `Special Requests: ${note}\n`;
            // Owner WhatsApp number
            const ownerNumber = '94716836787';
            const whatsappLink = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(msg)}`;
            // Show WhatsApp link after submit
            reservationForm.style.display = 'none';
            const successDiv = document.createElement('div');
            successDiv.style.textAlign = 'center';
            successDiv.style.padding = '30px 0';
            successDiv.innerHTML = `<p><span style='color:#fff;'>Reservation submitted successfully!</span></p>
                <a href='${whatsappLink}' target='_blank' style='color:#25D366;font-size:1.2em;'>Notify Owner on WhatsApp</a>`;
            reservationForm.parentNode.appendChild(successDiv);
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const menuOpenButton = document.getElementById("menu-open-button");
    const menuCloseButton = document.getElementById("menu-close-button");
    const navLinks = document.querySelectorAll(".nav-menu .nav-link");
    const contactForm = document.querySelector(".contact-form");

    if (menuOpenButton) {
        menuOpenButton.addEventListener("click", function() {
            document.body.classList.add("show-mobile-menu");
            document.body.classList.add("nav-logo-center");
        });
    }

    if (menuCloseButton) {
        menuCloseButton.addEventListener("click", function() {
            document.body.classList.remove("show-mobile-menu");
            document.body.classList.remove("nav-logo-center");
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            document.body.classList.remove("show-mobile-menu");
            document.body.classList.remove("nav-logo-center");
        });
    });

    // Show WhatsApp link after contact form submit
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            // Format WhatsApp message for owner
            const ownerNumber = '94716836787';
            const whatsappMsg = encodeURIComponent(`Contact Us Message at Coffee Dose:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
            const whatsappLink = `https://wa.me/${ownerNumber}?text=${whatsappMsg}`;
            contactForm.innerHTML = `<div style='text-align:center;padding:30px 0;'><p><span style='color:#fff;'>Message submitted successfully!</span></p><a href='${whatsappLink}' target='_blank' style='color:#25D366;font-size:1.2em;'>Notify Owner on WhatsApp</a></div>`;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const reservationBtn = document.querySelector('a.button.order-now');
    if (reservationBtn) {
        reservationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.add('page-fade-out');
            setTimeout(function() {
                window.location.href = reservationBtn.getAttribute('href');
            }, 700); // Match the animation duration
        });
    }
});

// Gallery Animation Logic
(function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryLink = document.querySelector('a[href="#gallery"]');
  const gallerySection = document.getElementById('gallery');
  
  if (galleryItems.length === 0) return;

  // Function to trigger gallery animation (IMMEDIATE SHOW, NO DELAY)
  function triggerGalleryAnimation() {
    galleryItems.forEach(item => {
      item.classList.remove('animate', 'page-load-animate', 'animate-ready');
      item.classList.add('page-load-animate');
    });
  }

  // Create Intersection Observer for when gallery section comes into view
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger animation when gallery section is visible
        triggerGalleryAnimation();
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of the gallery section is visible
    rootMargin: '0px 0px -100px 0px' // Start animation slightly before section comes into view
  });

  // Observe gallery section
  if (gallerySection) {
    galleryObserver.observe(gallerySection);
  }

  // Also trigger animation when gallery link is clicked
  if (galleryLink) {
    galleryLink.addEventListener('click', function(e) {
      // Small delay to allow smooth scrolling to gallery section
      setTimeout(triggerGalleryAnimation, 1000);
    });
  }

  // Listen for hash changes (when navigating to #gallery)
  window.addEventListener('hashchange', function() {
    if (window.location.hash === '#gallery') {
      setTimeout(triggerGalleryAnimation, 500);
    }
  });

  // Check if we're already on gallery section when page loads
  if (window.location.hash === '#gallery') {
    setTimeout(triggerGalleryAnimation, 500);
  }
})();

(function() {
  const menuSection = document.getElementById('menu');
  if (!menuSection) return;
  const menuItems = menuSection.querySelectorAll('.menu-item');
  if (!menuItems.length) return;

  // Set initial direction classes (left/right)
  menuItems.forEach((item, idx) => {
    item.classList.remove('menu-animate', 'menu-animate-left', 'menu-animate-right');
    if (idx % 2 === 0) {
      item.classList.add('menu-animate-left');
    } else {
      item.classList.add('menu-animate-right');
    }
  });

  function triggerMenuAnimation() {
    menuItems.forEach((item, idx) => {
      setTimeout(() => {
        item.classList.add('menu-animate');
      }, idx * 300); // 250ms stagger for more visible effect
    });
  }

  // Animate when menu section comes into view, reset when out of view
  const menuObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerMenuAnimation();
      } else {
        menuItems.forEach(item => item.classList.remove('menu-animate'));
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  menuObserver.observe(menuSection);

  // Also animate if user clicks the menu nav link
  const menuLink = document.querySelector('a[href="#menu"]');
  if (menuLink) {
    menuLink.addEventListener('click', function() {
      setTimeout(triggerMenuAnimation, 600);
    });
  }

  // Animate if already on menu section at page load
  if (window.location.hash === '#menu') {
    setTimeout(triggerMenuAnimation, 400);
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  // GALLERY & MENU ANIMATION CODE

  // Gallery variables
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const galleryList = document.querySelector('.gallery-list');
  let ITEMS_PER_PAGE = window.innerWidth <= 640 ? 4 : 9;
  const AUTO_SLIDE_INTERVAL = 3000; // ms (3.0 seconds)
  let currentFilter = 'all';
  let currentPage = 1;
  let filteredItems = galleryItems;
  let autoSlideTimer = null;
  let isAnimating = false;

  window.addEventListener('resize', function() {
    const newItemsPerPage = window.innerWidth <= 640 ? 4 : 9;
    if (ITEMS_PER_PAGE !== newItemsPerPage) {
      ITEMS_PER_PAGE = newItemsPerPage;
      updateGallery(false); // re-render gallery with new page size
    }
  });

  function animateGalleryOut(callback) {
    isAnimating = true;
    galleryList.style.opacity = '0';
    setTimeout(() => {
      callback();
      galleryList.style.opacity = '1';
      setTimeout(() => { isAnimating = false; }, 300);
    }, 300);
  }

  function updateGallery(animate = true) {
    filteredItems = galleryItems.filter(item =>
      currentFilter === 'all' || item.getAttribute('data-category') === currentFilter
    );
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    function showItems() {
      galleryItems.forEach(item => item.style.display = 'none');
      filteredItems.slice(start, end).forEach(item => item.style.display = '');
      prevBtn.style.display = (filteredItems.length > ITEMS_PER_PAGE) ? '' : 'none';
      nextBtn.style.display = (filteredItems.length > ITEMS_PER_PAGE) ? '' : 'none';
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    if (animate) {
      animateGalleryOut(showItems);
    } else {
      showItems();
    }
  }

  function startAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
      if (totalPages <= 1) return;
      if (isAnimating) return;
      if (currentPage < totalPages) {
        currentPage++;
      } else {
        currentPage = 1;
      }
      updateGallery();
    }, AUTO_SLIDE_INTERVAL);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      currentPage = 1;
      updateGallery();
      startAutoSlide();
    });
  });

  prevBtn.addEventListener('click', function() {
    if (currentPage > 1 && !isAnimating) {
      currentPage--;
      updateGallery();
      startAutoSlide();
    }
  });

  nextBtn.addEventListener('click', function() {
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages && !isAnimating) {
      currentPage++;
      updateGallery();
      startAutoSlide();
    }
  });

  // Initial display and auto-slide (no animation on first load)
  galleryList.style.transition = 'none';
  updateGallery(false);
  startAutoSlide();
  setTimeout(() => {
    galleryList.style.transition = 'opacity 0.35s';
  }, 50);

  // Pause auto-slide on mouse enter, resume on mouse leave
  const galleryWrapper = document.querySelector('.gallery-flex-wrapper') || galleryList;
  galleryWrapper.addEventListener('mouseenter', function() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  });
  galleryWrapper.addEventListener('mouseleave', function() {
    startAutoSlide();
  });

  // Always reset to All/first page with animation when Gallery nav link is clicked
  const galleryNavLink = document.querySelector('a.nav-link[href="#gallery"]');
  if (galleryNavLink) {
    galleryNavLink.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === 'all') btn.classList.add('active');
      });
      currentFilter = 'all';
      currentPage = 1;
      updateGallery(true);
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // MENU ANIMATION
  const menuList = document.querySelector('.menu-list');
  if (menuList) {
    setTimeout(() => {
      menuList.classList.add('menu-visible');
    }, 100);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.reservation-logo-img');
  if (logo) {
    setTimeout(() => {
      logo.classList.add('visible');
    }, 200);
  }
});

// Scroll to Top Button Logic
const scrollBtn = document.getElementById('scrollToTopBtn');
if (scrollBtn) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
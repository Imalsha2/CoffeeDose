    // Order Now logic
    const orderNowBtn = document.getElementById("order-now-btn");
    const menuOkBtn = document.getElementById("menu-ok-btn");
    const orderModal = document.getElementById("order-modal");
    const orderModalClose = document.getElementById("order-modal-close");
    const orderSummary = document.getElementById("order-summary");
    const orderForm = document.getElementById("order-form");
    const paymentMethod = document.getElementById("payment-method");
    const cardFields = document.getElementById("card-fields");
    const orderSuccess = document.getElementById("order-success");
    let selectedMenus = [];

    if (orderNowBtn) {
        orderNowBtn.addEventListener("click", function(e) {
            e.preventDefault();
            document.getElementById("menu").scrollIntoView({behavior: "smooth"});
        });
    }

    if (menuOkBtn) {
        menuOkBtn.addEventListener("click", function() {
            // Get selected menu items and their quantities
            selectedMenus = [];
            let total = 0;
            document.querySelectorAll(".menu-item").forEach(function(item) {
                const checkbox = item.querySelector(".menu-select");
                const qtyInput = item.querySelector(".menu-qty");
                if (checkbox && checkbox.checked) {
                    const name = item.getAttribute("data-name");
                    const price = parseInt(item.getAttribute("data-price"));
                    let qty = 1;
                    if (qtyInput && !isNaN(parseInt(qtyInput.value)) && parseInt(qtyInput.value) > 0) {
                        qty = parseInt(qtyInput.value);
                    }
                    selectedMenus.push({ name, price, qty });
                    total += price * qty;
                }
            });
            if (selectedMenus.length === 0) {
                alert("Please select at least one menu item.");
                return;
            }
            // Show modal
            orderModal.style.display = "flex";
            // Show summary
            let html = `<div style='margin-bottom:10px;'><b>Selected Items:</b><ul style='margin:8px 0 0 0;padding:0 0 0 18px;'>`;
            selectedMenus.forEach(m => {
                html += `<li>${m.name} x ${m.qty} <span style='color:#f3961c;'>Rs. ${m.price * m.qty}</span></li>`;
            });
            html += `</ul></div><div style='margin-bottom:10px;'><b>Total Price:</b> <span style='color:#f3961c;'>Rs. ${total}</span></div>`;
            orderSummary.innerHTML = html;
            orderSuccess.style.display = "none";
            orderForm.style.display = "block";
        });
    }

    if (orderModalClose) {
        orderModalClose.addEventListener("click", function() {
            orderModal.style.display = "none";
        });
    }

    if (paymentMethod) {
        paymentMethod.addEventListener("change", function() {
            if (paymentMethod.value === "card") {
                cardFields.style.display = "block";
            } else {
                cardFields.style.display = "none";
            }
        });
    }

    if (orderForm) {
        orderForm.addEventListener("submit", function(e) {
            e.preventDefault();
            // Get form data
            const location = orderForm.location.value;
            const phone = orderForm.phone.value;
            const payment = orderForm.payment.value;
            let card = {};
            if (payment === "card") {
                card = {
                    cardnumber: orderForm.cardnumber.value,
                    cardname: orderForm.cardname.value,
                    expiry: orderForm.expiry.value,
                    cvv: orderForm.cvv.value
                };
            }
            // Simulate order place
            orderForm.style.display = "none";
            orderSuccess.style.display = "block";
            setTimeout(() => {
                orderModal.style.display = "none";
                orderForm.reset();
            }, 2000);
        });
    }
// Rose Oud Café style reservation step logic
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
        // Show success message
        const success = form.querySelector('.reservation-success-step');
        if (success) success.style.display = 'block';
        setTimeout(() => {
            if (success) success.style.display = 'none';
            form.reset();
            // Reset reservation data
            reservation = { partySize: 1, date: '', mealType: '', timeSlot: '', name: '', email: '', phone: '', note: '' };
            // Reset active states
            form.querySelectorAll('.party-size-btn, .meal-type-btn, .time-slot-btn').forEach(b => b.classList.remove('active'));
            showStep(1);
        }, 2500);
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
    // Add quantity input fields to each menu item
    document.querySelectorAll('.menu-item').forEach(function(item) {
        if (!item.querySelector('.menu-qty')) {
            const checkbox = item.querySelector('.menu-select');
            // Create a flex row for checkbox, label, and qty input
            const flexRow = document.createElement('div');
            flexRow.style.display = 'flex';
            flexRow.style.alignItems = 'center';
            // Move checkbox into flexRow
            if (checkbox) flexRow.appendChild(checkbox);
            // Create qty label and input
            const label = document.createElement('label');
            label.textContent = 'Qty:';
            label.className = 'qty-label';
            label.style = 'margin-left:8px;font-size:0.95em;color:#fff;display:none;vertical-align:middle;';
            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.value = '1';
            qtyInput.className = 'menu-qty';
            qtyInput.style = 'width:48px;margin-left:6px;border-radius:8px;border:1px solid #ccc;padding:2px 6px;display:none;vertical-align:middle;color:#fff;background:#3b141c;';
            flexRow.appendChild(label);
            flexRow.appendChild(qtyInput);
            // Insert flexRow in place of original checkbox
            if (checkbox && checkbox.parentNode === item) {
                item.insertBefore(flexRow, checkbox);
                item.removeChild(checkbox);
            } else {
                item.appendChild(flexRow);
            }
            // Show/hide qty input on checkbox change
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    if (checkbox.checked) {
                        qtyInput.style.display = '';
                        label.style.display = '';
                    } else {
                        qtyInput.style.display = 'none';
                        label.style.display = 'none';
                    }
                });
                // Initial state
                if (checkbox.checked) {
                    qtyInput.style.display = '';
                    label.style.display = '';
                }
            }
        }
    });
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
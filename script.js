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
        });
    }

    if (menuCloseButton) {
        menuCloseButton.addEventListener("click", function() {
            document.body.classList.remove("show-mobile-menu");
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            document.body.classList.remove("show-mobile-menu");
        });
    });

    // Show WhatsApp link after contact form submit
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            // Send form data to backend (optional)
            fetch("http://localhost:3001/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            })
            .then(res => {
                // If backend not available, still show WhatsApp link
                if (!res.ok) throw new Error('Backend error');
                return res.json();
            })
            .then(data => {
                const whatsappMsg = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
                const whatsappLink = `https://wa.me/94769264200?text=${whatsappMsg}`;
                contactForm.innerHTML = `<div style='text-align:center;padding:30px 0;'><p>Message submitted successfully!</p><a href='${whatsappLink}' target='_blank' style='color:#25D366;font-size:1.2em;'>Message Owner on WhatsApp</a></div>`;
            })
            .catch(() => {
                // Always show WhatsApp link even if backend fails
                const whatsappMsg = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
                const whatsappLink = `https://wa.me/94769264200?text=${whatsappMsg}`;
                contactForm.innerHTML = `<div style='text-align:center;padding:30px 0;'><p>Message submitted!</p><a href='${whatsappLink}' target='_blank' style='color:#25D366;font-size:1.2em;'>Message Owner on WhatsApp</a></div>`;
            });
        });
    }
});
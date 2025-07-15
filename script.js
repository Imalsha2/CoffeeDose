document.addEventListener("DOMContentLoaded", function() {
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
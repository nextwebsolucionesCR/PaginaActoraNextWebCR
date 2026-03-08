document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel();
    initContactForm();
});

// Creative Hero Carousel
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let transitionTimer; // Variable to hold the scheduled transition

    if (slides.length === 0) return;

    function showSlide(index) {
        // 1. Cleanup previous state (Delay reset to avoid visual glitch during fade)
        clearTimeout(transitionTimer);
        const prevVideo = slides[currentSlide].querySelector('video');

        if (prevVideo) {
            prevVideo.onended = null; // Stop listening immediately
            // Wait for CSS transition (1s) before resetting video to avoid flashing start frame
            setTimeout(() => {
                prevVideo.pause();
                prevVideo.currentTime = 0;
            }, 1000);
        }
        slides.forEach(slide => slide.classList.remove('active'));

        // 2. Update Index
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // 3. Activate new slide
        const nextActiveSlide = slides[currentSlide];
        nextActiveSlide.classList.add('active');

        // Trigger Text Reveal Animation
        // Reset all text reveals first
        slides.forEach(s => {
            s.querySelectorAll('.reveal-mask').forEach(el => el.classList.remove('visible'));
        });

        // Reveal text in new slide with slight delay for dramatic effect
        setTimeout(() => {
            nextActiveSlide.querySelectorAll('.reveal-mask').forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, i * 200); // Stagger lines if multiple
            });
        }, 500);

        // 4. Determine wait logic based on content type
        const video = nextActiveSlide.querySelector('video');
        if (video) {
            // It's a video: Wait for it to finish
            video.play().then(() => {
                video.onended = () => {
                    nextSlide();
                };
            }).catch(e => {
                console.warn("Autoplay blocked or failed, falling back to timer", e);
                // Fallback for mobile/low-power modes: treat as image (7s)
                transitionTimer = setTimeout(nextSlide, 7000);
            });
        } else {
            // It's an image: Wait standard time (7s)
            transitionTimer = setTimeout(nextSlide, 7000);
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event Listeners for Manual Controls
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
    });

    // Start by initializing the first slide (force logic check)
    // Start logic (Handle first slide without triggering cleanup of itself)
    const firstVideo = slides[0].querySelector('video');

    // Animate Text for First Slide
    setTimeout(() => {
        slides[0].querySelectorAll('.reveal-mask').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 200);
        });
    }, 500);

    if (firstVideo) {
        firstVideo.play().then(() => {
            firstVideo.onended = nextSlide;
        }).catch(e => {
            console.warn("Autoplay blocked", e);
            transitionTimer = setTimeout(nextSlide, 7000);
        });
    } else {
        transitionTimer = setTimeout(nextSlide, 7000);
    }
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: Integrate EmailJS here
            alert('Mensaje enviado (Simulación). Pronto recibirás una respuesta.');
            form.reset();
        });
    }
}

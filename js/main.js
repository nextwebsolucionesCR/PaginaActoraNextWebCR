document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initAnimations();
    initMaps();
    createStardust();
    initSpotlight();
    createLiquidFilter();
    initFilmGrain();
    initMagneticButtons();
    initAccordionMaps();
    initBioScroll();
    if (typeof THREE !== 'undefined') init3DGallery(); // Safe check for Three.js
});


// Mobile Navbar Toggle
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');


    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu/link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

// Scroll Animations (Intersection Observer)
function initAnimations() {
    const observerOptions = {
        threshold: 0,
        // rootMargin: '0px' - removed to ensure immediate trigger
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you want animate-once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .reveal-mask').forEach(el => {
        observer.observe(el);
    });
}

// Facade Pattern for Google Maps & Waze (Performance)
function initMaps() {
    document.querySelectorAll('.map-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function () {
            const mapType = this.dataset.platform; // 'google' or 'waze'
            const mapSrc = this.dataset.src;

            const iframe = document.createElement('iframe');
            iframe.src = mapSrc;
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.style.border = "0";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";

            // Reemplazar placeholder con iframe
            const container = this.parentElement;
            container.innerHTML = '';
            container.appendChild(iframe);
        });
    });
}

// Cinematic Stardust Generator
function createStardust() {
    // Determine particle count based on device (Mobile Optimization)
    // Fewer particles on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;

    // Create Container
    const container = document.createElement('div');
    container.className = 'stardust-container';
    document.body.prepend(container);

    // Create Particles
    for (let i = 0; i < particleCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random Positioning & Animation
        const x = Math.random() * 100; // 0-100% width
        const duration = 10 + Math.random() * 20; // 10-30s float
        const delay = Math.random() * 20; // 0-20s delay
        const opacity = 0.3 + Math.random() * 0.7; // 0.3-1.0

        // Random sizes for depth
        const size = Math.random() > 0.8 ? 3 : 2; // Occasional larger star

        // Occasional Violet Particle
        if (Math.random() > 0.85) {
            star.classList.add('violet');
        }

        star.style.left = `${x}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `-${delay}s`); // Negative delay to start mid-animation
        star.style.setProperty('--opacity', opacity);

        container.appendChild(star);
    }
}

// Spotlight Effect
function initSpotlight() {
    // Only run on desktop triggers (can check matchMedia too, but CSS safeguards it)
    if (window.matchMedia("(hover: hover)").matches) {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight-overlay';
        document.body.prepend(spotlight);

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            spotlight.style.setProperty('--x', `${x}px`);
            spotlight.style.setProperty('--y', `${y}px`);
        });
    }
}

// Liquid Distortion Filter Injection
function createLiquidFilter() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("style", "position: absolute; width: 0; height: 0; pointer-events: none;");

    // Filter Definition
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "liquid-filter");

    // Turbulence (The Ripples)
    const turbulence = document.createElementNS(svgNS, "feTurbulence");
    turbulence.setAttribute("type", "fractalNoise");
    turbulence.setAttribute("baseFrequency", "0.01 0.01"); // Low frequency for large waves
    turbulence.setAttribute("numOctaves", "1");
    turbulence.setAttribute("result", "warp");

    // Displacement (The Distortion)
    const displacement = document.createElementNS(svgNS, "feDisplacementMap");
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "warp");
    displacement.setAttribute("scale", "0"); // Start with 0 distortion
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "G");

    filter.appendChild(turbulence);
    filter.appendChild(displacement);
    svg.appendChild(filter);
    document.body.appendChild(svg);

    // Interactive Animation Logic
    // We only distort on hover by animating the 'scale' attribute
    const liquidElements = document.querySelectorAll('.liquid-hover');

    liquidElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Animate scale up to 30
            animateDisplacement(displacement, 0, 30, 500);
        });

        el.addEventListener('mouseleave', () => {
            // Animate scale down to 0
            animateDisplacement(displacement, 30, 0, 500);
        });
    });
}

// Simple easing animation helper
function animateDisplacement(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing (Ease Out Quad)
        const ease = 1 - (1 - progress) * (1 - progress);

        const value = start + (end - start) * ease;
        element.setAttribute("scale", value);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Global Film Grain
function initFilmGrain() {
    const grain = document.createElement('div');
    grain.className = 'film-grain';
    // Use a lightweight noise SVG data URI
    const noiseUrl = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E";
    grain.style.backgroundImage = `url("${noiseUrl}")`;
    document.body.prepend(grain);
}

// Magnetic Buttons (Desktop Only)
function initMagneticButtons() {
    if (window.matchMedia("(hover: hover)").matches) {
        const buttons = document.querySelectorAll('.btn, .magnetic-btn');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Strength of magnetism
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                // Return to center
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }
}

// Collapsible Maps ("Bambalinas" Effect)
function initAccordionMaps() {
    const mapTriggers = document.querySelectorAll('.map-trigger');

    mapTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const mapContainer = this.nextElementSibling;
            const icon = this.querySelector('i');

            this.classList.toggle('active');

            if (mapContainer.style.maxHeight) {
                // Close
                mapContainer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
                this.innerHTML = '<i class="fas fa-map-marker-alt"></i> Desplegar Ubicación';
            } else {
                // Open
                mapContainer.style.maxHeight = mapContainer.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
                this.innerHTML = '<i class="fas fa-map-marked-alt"></i> Ocultar Ubicación';
            }
        });
    });
}

// Biography Sticky Scroll Logic
function initBioScroll() {
    const chapters = document.querySelectorAll('.bio-chapter');
    const visualContainer = document.querySelector('.bio-visuals');

    // Only run if elements exist
    if (!chapters.length || !visualContainer) return;

    const observerOptions = {
        root: null,
        threshold: 0.6, // Trigger when 60% of chapter is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get target image ID
                const targetId = entry.target.getAttribute('data-target');

                // Remove active class from all images
                document.querySelectorAll('.bio-img').forEach(img => {
                    img.classList.remove('active');
                });

                // Add active class to target image
                const targetImg = document.getElementById(targetId);
                if (targetImg) {
                    targetImg.classList.add('active');
                }
            }
        });
    }, observerOptions);

    chapters.forEach(chapter => {
        observer.observe(chapter);
    });
}

// 3D Crystal Gallery (Three.js)
function init3DGallery() {
    const container = document.getElementById('gallery-3d-container');
    // Only run if container exists and we are on desktop (>900px)
    if (!container || window.innerWidth <= 900) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // POSTERS DATA
    const posters = [
        { map: 'img/filmografia/filme1.png', x: -2.5, y: 0, z: 0 },
        { map: 'img/filmografia/filme2.png', x: 0, y: 0, z: 0.5 }, // Center
        { map: 'img/filmografia/filme4.png', x: 2.5, y: 0, z: 0 }
    ];

    const planes = [];
    const loader = new THREE.TextureLoader();

    posters.forEach(data => {
        loader.load(data.map, (texture) => {
            const geometry = new THREE.PlaneGeometry(1.4, 2);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);

            plane.position.set(data.x, data.y, data.z);
            plane.userData = { originalY: data.y }; // Store initial Y

            scene.add(plane);
            planes.push(plane);
        });
    });

    camera.position.z = 4;

    // ANIMATION
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        planes.forEach((plane, i) => {
            const time = Date.now() * 0.001;
            // Bobbing relative to ORIGINAL stored Y
            if (plane.userData.originalY !== undefined) {
                plane.position.y = plane.userData.originalY + Math.sin(time + i) * 0.1;
            }

            plane.rotation.y = mouseX * 0.2;
            plane.rotation.x = -mouseY * 0.1;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 900) {
            renderer.domElement.style.display = 'none';
        } else {
            renderer.domElement.style.display = 'block';
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

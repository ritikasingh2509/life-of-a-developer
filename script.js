// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Custom Cursor Logic ---
    const cursor = document.getElementById("customCursor");
    if(window.innerWidth > 768) {
        document.addEventListener("mousemove", (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        // Add hovering effect on interactive elements
        const interactables = document.querySelectorAll('a, button, .card');
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
        });
    }

    // --- Audio Toggle Logic ---
    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = musicToggle.querySelector('.icon');
    let isMusicPlaying = false;
    bgMusic.volume = 0.2; // Keep it low and non-distracting

    musicToggle.addEventListener("click", () => {
        if(isMusicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = "🔇";
            musicToggle.innerHTML = '<span class="icon">🔇</span> Music OFF';
        } else {
            bgMusic.play().then(() => {
    console.log("Music started");
}).catch(() => {
    alert("Click again to enable music 🎵");
});
            musicToggle.innerHTML = '<span class="icon">🔊</span> Music ON';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // --- Global Progress Bar ---
    gsap.to("#progressBar", {
        value: 100,
        width: "100%",
        ease: "none",
        scrollTrigger: {
            scrub: 0.3
        }
    });

    // --- 1. Hero Section Animations ---
    const subtitleTexts = [
        "From 'Hello World' to 'Why isn't this working?'",
        "Converting caffeine into optimized logic.",
        "StackOverflow Driven Development."
    ];
    let masterTl = gsap.timeline({repeat: -1});
    
    subtitleTexts.forEach(text => {
        let tl = gsap.timeline({repeat: 1, yoyo: true, repeatDelay: 2});
        tl.to("#typing-subtitle", {
            duration: text.length * 0.05,
            text: { value: text, delimiter: "" },
            ease: "none"
        });
        masterTl.add(tl);
    });

    // --- 2. Learning Phase ---
    // Supercharged stagger floats
   gsap.fromTo(".card", {
    opacity: 0,
    y: 150,
    rotationY: 45,
    rotationX: 20
}, {
    opacity: 1,
    y: 0,
    rotationY: 0,
    rotationX: 0,
    duration: 1,
    stagger: 0.25,
    ease: "back.out(1.5)",
    scrollTrigger: {
        trigger: ".learning-section",
        start: "top 75%",
        toggleActions: "play none none none"
    }
});
    // --- 3. Debugging Phase (The Chaos) ---
    const fixBugBtn = document.getElementById("fixBugBtn");
    const errorText = document.querySelector(".error-text");
    const errorSubtext = document.querySelector(".error-subtext");
    const resolvedMsg = document.getElementById("bugResolvedMsg");
    const codeWindow = document.querySelector(".code-window");
    const shakeContainer = document.getElementById("shakeContainer");
    const errorLayer = document.getElementById("error-popups-layer");
    
    let isBugFixed = false;
    let errorInterval;

    // Shake timeline wrapper
    const intenseShake = gsap.to(shakeContainer, {
        x: "random(-10, 10)",
        y: "random(-10, 10)",
        duration: 0.05,
        repeat: -1,
        yoyo: true,
        paused: true
    });

    // Function to generate random DOS popup errors
    const spawnPopup = () => {
        if (isBugFixed) return;
        const msg = document.createElement("div");
        msg.className = "random-error";
        const errorStrings = [
            "Segmentation Fault", 
            "NullReferenceException", 
            "Unexpected Token '<'", 
            "ERR_CONNECTION_REFUSED",
            "Out of Memory"
        ];
        msg.textContent = errorStrings[Math.floor(Math.random() * errorStrings.length)];
        
        // Random screen coords
        msg.style.left = Math.floor(Math.random() * 80 + 10) + "%";
        msg.style.top = Math.floor(Math.random() * 80 + 10) + "%";
        errorLayer.appendChild(msg);

        // Animate out quickly
        gsap.to(msg, {
            opacity: 0,
            y: -50,
            scale: 1.5,
            duration: 1.5,
            ease: "power2.in",
            onComplete: () => msg.remove()
        });
    };

    // Trigger aggressive effects on scroll enter
    ScrollTrigger.create({
        trigger: ".debugging-section",
        start: "top 50%",
        onEnter: () => {
            if(!isBugFixed) {
                intenseShake.play();
                cursor.classList.add("error-mode");
                errorInterval = setInterval(spawnPopup, 600); // spawn popup every 600ms
            }
        },
        onLeave: () => { intenseShake.pause(); clearInterval(errorInterval); cursor.classList.remove("error-mode"); },
        onEnterBack: () => {
            if(!isBugFixed) {
                intenseShake.play(); 
                cursor.classList.add("error-mode");
                errorInterval = setInterval(spawnPopup, 600);
            }
        },
        onLeaveBack: () => { intenseShake.pause(); clearInterval(errorInterval); cursor.classList.remove("error-mode"); }
    });

    gsap.from(codeWindow, {
        scale: 0.5,
        opacity: 0,
        rotationX: 45,
        duration: 1.2,
        ease: "elastic.out(1, 0.4)",
        scrollTrigger: {
            trigger: ".debugging-section",
            start: "top 60%"
        }
    });

    // Button interaction (Fixing the chaos)
    fixBugBtn.addEventListener("click", () => {
        isBugFixed = true;
        
        // Stop the chaos immediately
        intenseShake.pause();
        gsap.set(shakeContainer, {x: 0, y: 0}); // reset position
        clearInterval(errorInterval);
        errorLayer.innerHTML = ""; // clear all popups
        cursor.classList.remove("error-mode");
        
        // Update Button
        fixBugBtn.querySelector(".btn-text").textContent = "Bug Fixed!";
        fixBugBtn.classList.remove("primary-btn", "pulse-glow");
        fixBugBtn.classList.add("fixed");
        
        // Remove Glitch
        errorText.classList.remove("severe-glitch");
        errorText.textContent = "SYSTEM STABLE";
        errorText.style.color = "var(--accent-green)";
        errorText.style.textShadow = "0 0 20px rgba(0,255,102,0.8)";
        
        errorSubtext.textContent = "Logic successfully optimized.";
        errorSubtext.style.color = "var(--text-secondary)";

        // Change Code Visuals dynamically
        const codeElement = document.querySelector("code");
        let codeContent = codeElement.innerHTML;
        codeContent = codeContent.replace('throw new Error("I have no idea what I\'m doing");', '// Code runs flawlessly');
        codeContent = codeContent.replace("cryInternally();", "deployToProduction();");
        codeContent = codeContent.replace('console.error("Stack overflow driven development failed.");', 'console.log("Success");');
        codeElement.innerHTML = codeContent;

        // Show Success msg and pulse window
        resolvedMsg.classList.remove("hidden");
        gsap.fromTo(resolvedMsg, 
            { y: 30, opacity: 0, scale: 0.5 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
        );

        gsap.to(codeWindow, {
            boxShadow: "0 30px 80px rgba(0, 255, 102, 0.5)",
            borderColor: "rgba(0, 255, 102, 0.8)",
            duration: 0.8
        });
    });


    // --- 4. Deadline Pressure ---
    // Fast parallax for speed lines
    gsap.to(".speed-lines", {
        y: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".deadline-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 0
        }
    });

    const countdownEl = document.getElementById("countdown");
    let fakeTimeMs = 30000; // 30 seconds

    ScrollTrigger.create({
        trigger: ".deadline-section",
        start: "top center",
        onEnter: () => {
            // Ticking logic
            let interval = setInterval(() => {
                fakeTimeMs -= 43; 
                if(fakeTimeMs <= 0) {
                    clearInterval(interval);
                    countdownEl.textContent = "00:00:00.00";
                    countdownEl.style.color = "var(--accent-red)";
                    // Add explosive vibration on timeout
                    gsap.to(countdownEl, {x: 10, y: 10, duration: 0.05, yoyo: true, repeat: 20});
                } else {
                    let secs = Math.floor(fakeTimeMs / 1000);
                    let ms = Math.floor((fakeTimeMs % 1000) / 10);
                    countdownEl.textContent = `00:${secs < 10 ? "0"+secs : secs}:${ms < 10 ? "0"+ms : ms}`;
                }
            }, 43);
        }
    });

    // Intense warning text shake
    gsap.to(".warning-text", {
        x: 8,
        duration: 0.05,
        repeat: -1,
        yoyo: true,
        ease: "none",
        scrollTrigger: {
            trigger: ".deadline-section",
            start: "top center",
            end: "bottom center",
            toggleActions: "play pause resume pause"
        }
    });

    // --- 5. Success Section ---
    // Smooth reveal
    gsap.from(".coffee-wrapper", {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: ".success-section",
            start: "top 60%"
        }
    });

    // Stagger text reveals
    gsap.from(".text-reveal", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".success-section",
            start: "top 60%"
        }
    });
    
    gsap.from(".text-reveal-sub", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".success-section",
            start: "top 60%"
        }
    });

    // Simple success particles parallax
    gsap.to("#successParticles", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".success-section",
            scrub: true
        }
    });
    window.addEventListener("load", () => {
    gsap.to("#loader", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    });
});
// --- EXTRA POLISH: Cursor Click Effect ---
document.addEventListener("click", (e) => {
    const ripple = document.createElement("div");
    ripple.style.position = "fixed";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    ripple.style.width = "10px";
    ripple.style.height = "10px";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(0, 243, 255, 0.6)";
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "999999";
    
    document.body.appendChild(ripple);

    gsap.to(ripple, {
        scale: 8,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
    });
});
// --- SECTION FADE-IN ANIMATION ---
gsap.utils.toArray(".section").forEach((sec) => {
    gsap.from(sec, {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});
// --- PARTICLES BACKGROUND ---
const particlesContainer = document.getElementById("particles");

for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";

    particlesContainer.appendChild(p);

    gsap.to(p, {
        y: "-=100",
        x: "+=50",
        duration: Math.random() * 5 + 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}
});

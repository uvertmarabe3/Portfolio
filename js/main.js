function toggleChat() {
    const widget = document.getElementById('chatWidget');

    if (widget) {
        widget.classList.toggle('open');

        if (widget.classList.contains('open')) {
            const input = document.getElementById('chatInput');
            if (input) {
                input.focus();
            }
        }
    }
}

/* ── Theme (Light / Dark) ── */

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Cross-fade the avatar images that match data-theme-img
    document.querySelectorAll('[data-theme-img]').forEach((img) => {
        img.classList.toggle('visible', img.getAttribute('data-theme-img') === theme);
    });

    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // localStorage unavailable (e.g. private browsing) — theme just won't persist
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

(function initTheme() {
    let saved = null;
    try {
        saved = localStorage.getItem('theme');
    } catch (e) {
        // ignore
    }

    if (!saved) {
        saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Run once DOM is ready so the avatar <img> elements exist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyTheme(saved));
    } else {
        applyTheme(saved);
    }
})();


/* ── Get in Touch / Send Email (EmailJS) ── */

const EMAILJS_PUBLIC_KEY = '7GKQeEwEnuTFMGBI9';
const EMAILJS_SERVICE_ID = 'service_206lnqj';
const EMAILJS_TEMPLATE_ID = 'template_95ut1c9'; // ← replace with your EmailJS template ID
const SCHEDULE_EMAIL = 'uvertmarabe3@email.com';

if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function openScheduleModal() {
    const overlay = document.getElementById('scheduleOverlay');
    if (!overlay) return;
    overlay.classList.add('open');

    const nameInput = document.getElementById('scheduleName');
    if (nameInput) nameInput.focus();
}

function closeScheduleModal() {
    const overlay = document.getElementById('scheduleOverlay');
    if (overlay) overlay.classList.remove('open');
}

function submitScheduleForm(event) {
    event.preventDefault();

    const name = document.getElementById('scheduleName').value.trim();
    const email = document.getElementById('scheduleEmail').value.trim();
    const date = document.getElementById('scheduleDate').value;
    const purpose = document.getElementById('scheduleMessage').value.trim();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    const templateParams = {
        to_email: SCHEDULE_EMAIL,
        from_name: name,
        from_email: email,
        date: date,
        purpose: purpose
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            if (submitBtn) {
                submitBtn.textContent = 'Sent ✓';
            }
            setTimeout(() => {
                closeScheduleModal();
                document.getElementById('scheduleForm').reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }, 1200);
        })
        .catch((err) => {
            console.error('EmailJS send failed:', err);
            alert('Sorry, something went wrong sending your message. Please try again or email ' + SCHEDULE_EMAIL + ' directly.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeScheduleModal();
    }
});

function getThemeAvatarSrc() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    return theme === 'dark' ? 'images/uvert-marabe-night.png' : 'images/uvert-marabe-day.png';
}

function updateCount() {
    const input = document.getElementById('chatInput');
    const counter = document.getElementById('charCount');

    if (input && counter) {
        counter.textContent = input.value.length;
    }
}

/* ── Local rule-based chatbot (no external API — always works) ── */

const BOT_REPLIES = [{
        pattern: /^\s*(hi+|hello+|hey+|yo|sup|good\s?(morning|afternoon|evening)|kumusta|magandang\s?(umaga|hapon|gabi))[\s!.,]*$/i,
        reply: "Hi there! 👋 I'm Uvert Marabe, a Web Developer student passionate about building web applications and solving problems through code. What can i help you with?"
    },
    {
        pattern: /\b(school|college|university|studying|studies|enrolled|datamex)\b/i,
        reply: "I study at Datamex College of Saint Adeline, Valenzuela, where I'm taking up Bachelor of Science in Information Technology. 🎓"
    },
    {
        pattern: /\b(experience|work history|background|career|job)\b/i,
        reply: "Here's a quick rundown of my experience:\n• Full-Stack Developer — Integrative Programming Thesis (2025)\n• Web Developer — Freelance (2025)\n• Front-End Developer — Capstone 1 Project (2025)\n• System Analyst & UI/UX Designer — Quantitative Method Thesis (2024)\n• Arduino-based projects with Uno R3 & C++ (2025)\n• Data Analyst — Work Immersion at Brgy. Kaunlaran, NBBS Navotas City (2022)"
    },
    {
        pattern: /\b(about you|who are you|tell me about yourself|yourself)\b/i,
        reply: "I'm Uvert Marabe, a Web Developer student from the Philippines, currently studying at Datamex College of Saint Adeline, Valenzuela. I'm passionate about building web applications and solving problems through code, with a solid foundation in both front-end and back-end development."
    },
    {
        pattern: /\b(tech stack|skills|technolog(y|ies)|languages|programming language|tools)\b/i,
        reply: "My tech stack:\n• Frontend: HTML, CSS, JavaScript, PHP, Bootstrap, Tailwind CSS\n• Languages: Python, C, C++\n• Databases: XAMPP (MySQL), SSMS (SQL Server), SQLite\n\nCheck out the full list on the Tech Stack page!"
    },
    {
        pattern: /\b(project|projects|portfolio|built|made|created)\b/i,
        reply: "I've worked on a few projects including my Integrative Programming Thesis, my Capstone 1 Project, and some Arduino-based builds with the Uno R3. You can check the Projects page for more details!"
    },
    {
        pattern: /\b(contact|email|reach you|phone|number|get in touch)\b/i,
        reply: "You can reach me at uvertmarabe3@email.com or 09911327031, or just click \"Send Email\" on the page and I'll get your message by email!"
    },
    {
        pattern: /\b(certificat(e|ion)s?|award|awards)\b/i,
        reply: "I've received a few recognitions: Best in Work Immersion Award, Finishing Work Immersion Award (both at Brgy. Kaunlaran, NBBS Navotas City), and I'm currently on an ongoing OJT at McarsPH as a QA Tester and Encoder."
    },
    {
        pattern: /\b(thank(s| you)|salamat)\b/i,
        reply: "You're welcome! 😊 Let me know if there's anything else you'd like to know about my work or background."
    },
    {
        pattern: /\b(bye|goodbye|see you|paalam)\b/i,
        reply: "Thanks for stopping by! Feel free to reach out anytime through the Send Email form. 👋"
    }
];

const FALLBACK_REPLY = "Thanks for your message! I'm a simple rule-based assistant for now, so I work best with questions about my background, school, experience, tech stack, projects, or contact info. Try asking something like \"What's your experience?\" or \"Where do you study?\" — or use the Get in Touch button to message me directly!";

function getBotReply(message) {
    for (const entry of BOT_REPLIES) {
        if (entry.pattern.test(message)) {
            return entry.reply;
        }
    }
    return FALLBACK_REPLY;
}

function sendMessage() {
    const input = document.getElementById('chatInput');

    if (!input) return;

    const msg = input.value.trim();

    if (!msg) return;

    input.value = '';
    updateCount();

    const messages = document.getElementById('chatMessages');

    if (!messages) return;

    // User message
    messages.innerHTML += `
        <div class="chat-msg-row user-row">
            <div class="chat-msg-avatar">You</div>
            <div>
                <div class="chat-bubble chat-bubble-user">${escHtml(msg)}</div>
            </div>
        </div>
    `;

    // Typing indicator
    const typingId = 'typing-' + Date.now();

    messages.innerHTML += `
        <div class="chat-msg-row" id="${typingId}">
            <div class="chat-msg-avatar">
                <img src="${getThemeAvatarSrc()}"
                     alt="Uvert"
                     onerror="this.style.display='none';this.parentElement.innerHTML='S'">
            </div>
            <div>
                <div class="chat-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

    messages.scrollTop = messages.scrollHeight;

    // Local reply — no network call, so it always works
    const reply = getBotReply(msg);

    setTimeout(() => {
        const typingElement = document.getElementById(typingId);
        if (typingElement) {
            typingElement.remove();
        }

        messages.innerHTML += `
            <div class="chat-msg-row">
                <div class="chat-msg-avatar">
                    <img src="${getThemeAvatarSrc()}"
                         alt="Uvert"
                         onerror="this.style.display='none';this.parentElement.innerHTML='S'">
                </div>
                <div>
                    <div class="chat-sender-name">Uvert Marabe</div>
                    <div class="chat-bubble chat-bubble-bot">${escHtml(reply).replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `;

        messages.scrollTop = messages.scrollHeight;
    }, 500);
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ── Gallery Lightbox (clickable, zoomable, pannable) ── */

const lightboxState = {
    scale: 1,
    minScale: 1,
    maxScale: 6,
    x: 0,
    y: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    pointers: new Map(), // for pinch-to-zoom
    pinchStartDist: 0,
    pinchStartScale: 1
};

function applyLightboxTransform() {
    const img = document.getElementById('lightboxImg');
    if (!img) return;
    img.style.transform = `translate(${lightboxState.x}px, ${lightboxState.y}px) scale(${lightboxState.scale})`;
}

function clampLightboxPan() {
    // Keep it simple: no hard clamp, but reset position when scale returns to 1
    if (lightboxState.scale <= 1) {
        lightboxState.x = 0;
        lightboxState.y = 0;
    }
}

function openLightbox(src) {
    const overlay = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImg');
    if (!overlay || !img) return;

    img.src = src;
    lightboxState.scale = 1;
    lightboxState.x = 0;
    lightboxState.y = 0;
    applyLightboxTransform();

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';

    lightboxState.scale = 1;
    lightboxState.x = 0;
    lightboxState.y = 0;
    applyLightboxTransform();
}

function lightboxZoomIn() {
    lightboxState.scale = Math.min(lightboxState.maxScale, lightboxState.scale + 0.5);
    applyLightboxTransform();
}

function lightboxZoomOut() {
    lightboxState.scale = Math.max(lightboxState.minScale, lightboxState.scale - 0.5);
    clampLightboxPan();
    applyLightboxTransform();
}

function lightboxResetZoom() {
    lightboxState.scale = 1;
    lightboxState.x = 0;
    lightboxState.y = 0;
    applyLightboxTransform();
}

(function initLightboxInteractions() {
    document.addEventListener('DOMContentLoaded', () => {
        const stage = document.getElementById('lightboxStage');
        const img = document.getElementById('lightboxImg');
        if (!stage || !img) return;

        // Mouse drag to pan
        stage.addEventListener('mousedown', (e) => {
            lightboxState.isDragging = true;
            lightboxState.startX = e.clientX - lightboxState.x;
            lightboxState.startY = e.clientY - lightboxState.y;
            stage.classList.add('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!lightboxState.isDragging) return;
            lightboxState.x = e.clientX - lightboxState.startX;
            lightboxState.y = e.clientY - lightboxState.startY;
            applyLightboxTransform();
        });

        window.addEventListener('mouseup', () => {
            lightboxState.isDragging = false;
            stage.classList.remove('dragging');
        });

        // Scroll wheel to zoom (centered on cursor feel via simple scale)
        stage.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.2 : -0.2;
            lightboxState.scale = Math.min(
                lightboxState.maxScale,
                Math.max(lightboxState.minScale, lightboxState.scale + delta)
            );
            clampLightboxPan();
            applyLightboxTransform();
        }, { passive: false });

        // Double-click to toggle zoom
        stage.addEventListener('dblclick', () => {
            if (lightboxState.scale > 1) {
                lightboxResetZoom();
            } else {
                lightboxState.scale = 2.5;
                applyLightboxTransform();
            }
        });

        // Touch support: drag-to-pan + pinch-to-zoom
        stage.addEventListener('touchstart', (e) => {
            for (const touch of e.touches) {
                lightboxState.pointers.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
            }

            if (e.touches.length === 1) {
                lightboxState.isDragging = true;
                lightboxState.startX = e.touches[0].clientX - lightboxState.x;
                lightboxState.startY = e.touches[0].clientY - lightboxState.y;
            } else if (e.touches.length === 2) {
                lightboxState.isDragging = false;
                const [t1, t2] = e.touches;
                lightboxState.pinchStartDist = Math.hypot(
                    t2.clientX - t1.clientX,
                    t2.clientY - t1.clientY
                );
                lightboxState.pinchStartScale = lightboxState.scale;
            }
        }, { passive: true });

        stage.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && lightboxState.isDragging) {
                lightboxState.x = e.touches[0].clientX - lightboxState.startX;
                lightboxState.y = e.touches[0].clientY - lightboxState.startY;
                applyLightboxTransform();
            } else if (e.touches.length === 2) {
                const [t1, t2] = e.touches;
                const dist = Math.hypot(
                    t2.clientX - t1.clientX,
                    t2.clientY - t1.clientY
                );
                const ratio = dist / (lightboxState.pinchStartDist || dist);
                lightboxState.scale = Math.min(
                    lightboxState.maxScale,
                    Math.max(lightboxState.minScale, lightboxState.pinchStartScale * ratio)
                );
                clampLightboxPan();
                applyLightboxTransform();
            }
        }, { passive: true });

        stage.addEventListener('touchend', (e) => {
            lightboxState.pointers.clear();
            if (e.touches.length === 0) {
                lightboxState.isDragging = false;
            } else if (e.touches.length === 1) {
                lightboxState.isDragging = true;
                lightboxState.startX = e.touches[0].clientX - lightboxState.x;
                lightboxState.startY = e.touches[0].clientY - lightboxState.y;
            }
        }, { passive: true });
    });
})();

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
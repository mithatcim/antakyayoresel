// Mobil menü, aktif link ve scroll davranışı
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");

function setActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");
        link.classList.toggle("active", linkPage === currentPage);
    });
}

function updateHeaderState() {
    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle("scrolled", window.scrollY > 12);
}

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Menüyü aç");
        });
    });
}

setActiveNavLink();
updateHeaderState();
window.addEventListener("scroll", updateHeaderState);

// Lezzetler sayfası galeri modalı
const galleryModal = document.querySelector("#galleryModal");
const galleryImage = document.querySelector("#galleryImage");
const galleryTitle = document.querySelector("#galleryTitle");
const galleryCategory = document.querySelector("#galleryCategory");
const galleryDescription = document.querySelector("#galleryDescription");
const galleryClose = document.querySelector(".gallery-close");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const menuCards = Array.from(document.querySelectorAll(".menu-card"));

let activeGalleryIndex = 0;

const galleryItems = menuCards.map((card) => ({
    title: card.dataset.title || "Antakya Lezzeti",
    category: card.dataset.category || "Yöresel Lezzet",
    src: card.dataset.src || "",
    description: card.dataset.description || "Hatay sofrasından seçilmiş özel bir lezzet.",
    alt: card.querySelector("img")?.getAttribute("alt") || "Yöresel yemek görseli"
}));

function renderGalleryItem(index) {
    const item = galleryItems[index];

    if (!item || !galleryImage || !galleryTitle || !galleryCategory || !galleryDescription) {
        return;
    }

    galleryImage.src = item.src;
    galleryImage.alt = item.alt;
    galleryTitle.textContent = item.title;
    galleryCategory.textContent = item.category;
    galleryDescription.textContent = item.description;
}

function openGallery(index) {
    if (!galleryModal || galleryItems.length === 0) {
        return;
    }

    activeGalleryIndex = index;
    renderGalleryItem(activeGalleryIndex);
    galleryModal.classList.add("show");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeGallery() {
    if (!galleryModal) {
        return;
    }

    galleryModal.classList.remove("show");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function showGalleryItem(direction) {
    if (galleryItems.length === 0) {
        return;
    }

    activeGalleryIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    renderGalleryItem(activeGalleryIndex);
}

menuCards.forEach((card, index) => {
    const imageButton = card.querySelector(".menu-image-button");
    const detailButton = card.querySelector(".gallery-open");

    if (imageButton) {
        imageButton.addEventListener("click", () => openGallery(index));
    }

    if (detailButton) {
        detailButton.addEventListener("click", () => openGallery(index));
    }
});

if (galleryClose) {
    galleryClose.addEventListener("click", closeGallery);
}

if (galleryPrev) {
    galleryPrev.addEventListener("click", () => showGalleryItem(-1));
}

if (galleryNext) {
    galleryNext.addEventListener("click", () => showGalleryItem(1));
}

if (galleryModal) {
    galleryModal.addEventListener("click", (event) => {
        if (event.target === galleryModal) {
            closeGallery();
        }
    });
}

document.addEventListener("keydown", (event) => {
    const isGalleryOpen = galleryModal?.classList.contains("show");

    if (event.key === "Escape" && isGalleryOpen) {
        closeGallery();
    }

    if (event.key === "ArrowLeft" && isGalleryOpen) {
        showGalleryItem(-1);
    }

    if (event.key === "ArrowRight" && isGalleryOpen) {
        showGalleryItem(1);
    }
});

// İletişim formu doğrulama
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(message, type) {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullNameInput = contactForm.querySelector("#fullName");
        const emailInput = contactForm.querySelector("#email");
        const subjectInput = contactForm.querySelector("#subject");
        const messageInput = contactForm.querySelector("#message");

        if (!fullNameInput || !emailInput || !subjectInput || !messageInput) {
            return;
        }

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        if (!fullName || !email || !subject || !message) {
            showFormMessage("Lütfen tüm alanları doldurun.", "error");
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage("Lütfen geçerli bir e-posta adresi yazın.", "error");
            return;
        }

        showFormMessage("Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.", "success");
        contactForm.reset();
    });
}

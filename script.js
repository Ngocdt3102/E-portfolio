document.addEventListener("DOMContentLoaded", function() {
    lucide.createIcons();

    // Reveal Animation on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Glassmorphism Navbar Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '0.8rem 10%';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            navbar.style.padding = '1.2rem 10%';
            navbar.style.boxShadow = 'none';
        }
    });

    // Logic Hamburger Menu Mobile
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navLinks.classList.contains('active') ? 'x' : 'menu';
        hamburger.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    // Đóng menu khi click vào link trên Mobile
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // ================= MODAL LOGIC (MIXED SLIDESHOW & VIDEO) =================
    const modalOverlay = document.getElementById('detail-modal');
    const mediaRender = document.getElementById('modal-media-render');
    const infoRender = document.getElementById('modal-info-render');
            
    let currentSlide = 0;
    let slideElements = []; 

    window.openModal = function(id) {
        const hiddenData = document.getElementById(id);
        if (!hiddenData) return;

        const mediaData = hiddenData.querySelector('.modal-media-data');
        const infoData = hiddenData.querySelector('.modal-info-data');

        // Bơm nội dung chữ
        infoRender.innerHTML = infoData.innerHTML;

        // Xử lý Media hỗn hợp (Ảnh + Video)
        mediaRender.innerHTML = ''; 
        const children = mediaData.children;
                
        // Lấy toàn bộ thẻ con gộp vào mảng
        slideElements = Array.from(children).map(child => child.outerHTML);
        
        if (slideElements.length > 0) {
            currentSlide = 0;
            buildMixedSlideshow();
        }

        lucide.createIcons();
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    function buildMixedSlideshow() {
        let html = '';
        slideElements.forEach((el, idx) => {
            html += `<div class="slider-item ${idx === 0 ? 'active' : ''}">${el}</div>`;
        });
        
        if (slideElements.length > 1) {
            html += `<div class="slider-btn prev-btn hover-target" onclick="changeSlide(-1)"><i data-lucide="chevron-left"></i></div>`;
            html += `<div class="slider-btn next-btn hover-target" onclick="changeSlide(1)"><i data-lucide="chevron-right"></i></div>`;
            
            html += `<div class="slider-dots">`;
            slideElements.forEach((_, idx) => {
                html += `<div class="dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></div>`;
            });
            html += `</div>`;
        }
        mediaRender.innerHTML = html;
        lucide.createIcons();        
    }

    // TỐI ƯU: Hàm dừng tất cả các loại Video (YouTube và Local MP4)
    function stopAllVideos() {
        // 1. Dừng video YouTube (Thẻ iframe)
        const iframes = mediaRender.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            let iframeSrc = iframe.src;
            iframe.src = iframeSrc; // Reset src để ngắt video
        });

        // 2. Dừng video Local MP4 (Thẻ video HTML5)
        const videos = mediaRender.querySelectorAll('video');
        videos.forEach(video => {
            video.pause(); // Ép dừng phát
            video.currentTime = 0; // Tua lại từ đầu
        });
    }

    window.changeSlide = function(step) {
        stopAllVideos(); // Phải dừng video trước khi chuyển slide
        currentSlide += step;
        if (currentSlide < 0) currentSlide = slideElements.length - 1;
        if (currentSlide >= slideElements.length) currentSlide = 0;
        updateSliderUI();
    };

    window.goToSlide = function(index) {
        stopAllVideos(); // Phải dừng video trước khi chuyển slide
        currentSlide = index;
        updateSliderUI();
    };

    function updateSliderUI() {
        const items = mediaRender.querySelectorAll('.slider-item');
        const dots = mediaRender.querySelectorAll('.dot');
        
        items.forEach((item, idx) => item.classList.toggle('active', idx === currentSlide));
        if(dots.length > 0) {
            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));
        }
    }

    window.closeModal = function() {
        stopAllVideos(); // TẮT VIDEO NGAY LẬP TỨC KHI BẤM ĐÓNG MODAL
        modalOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            mediaRender.innerHTML = ''; // Dọn dẹp DOM sau khi hiệu ứng mờ dần kết thúc
        }, 400);
    };

    // Đóng Modal khi bấm ra ngoài hoặc bấm phím ESC
    modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modalOverlay.classList.contains('show')) closeModal(); });
});
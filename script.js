// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滾動動畫觀察器
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    // 為動畫元素添加初始樣式
    const animatedElements = document.querySelectorAll(
        '.feature-card, .work-item, .stat-item, .requirements-list li'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Hero 標題打字效果
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 500);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // 統計數字動畫
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (element, target) => {
        if (target === '100%') {
            let current = 0;
            const increment = 2;
            const timer = setInterval(() => {
                current += increment;
                if (current >= 100) {
                    element.textContent = '100%';
                    clearInterval(timer);
                } else {
                    element.textContent = current + '%';
                }
            }, 30);
        }
    };

    // 統計數字觀察器
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                if (text === '100%') {
                    element.textContent = '0%';
                    animateCounter(element, '100%');
                }
                
                statsObserver.unobserve(element);
            }
        });
    });

    statNumbers.forEach(stat => {
        if (stat.textContent === '100%') {
            statsObserver.observe(stat);
        }
    });

    // 按鈕懸停效果
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 視差滾動效果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-bg-image');
        const ctaImage = document.querySelector('.cta-bg-image');
        
        // Hero 圖片視差效果
        if (heroImage) {
            const speed = 0.5;
            heroImage.style.transform = `translateY(${scrolled * speed}px)`;
        }
        
        // CTA 圖片視差效果（限制在合理範圍內）
        if (ctaImage) {
            const ctaSection = ctaImage.closest('.cta-section');
            const ctaSectionTop = ctaSection.offsetTop;
            const ctaSectionHeight = ctaSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // 只在 CTA section 可見時應用視差效果
            if (scrolled + windowHeight > ctaSectionTop && scrolled < ctaSectionTop + ctaSectionHeight) {
                const relativeScroll = scrolled - ctaSectionTop + windowHeight;
                const speed = 0.3;
                const maxTransform = 100; // 限制最大移動距離
                const transform = Math.min(relativeScroll * speed, maxTransform);
                ctaImage.style.transform = `translateY(${transform}px)`;
            }
        }
    });

    // 行動裝置觸控優化
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        const touchElements = document.querySelectorAll('.feature-card, .work-item, .cta-btn');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    // 郵件連結追蹤
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Email link clicked:', this.href);
            // 可以在這裡加入 Google Analytics 或其他追蹤代碼
        });
    });

    // 圖片延遲載入
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 滾動到頂部按鈕（可選）
    const scrollToTop = () => {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollButton);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollButton.style.opacity = '1';
            } else {
                scrollButton.style.opacity = '0';
            }
        });
        
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // 啟用滾動到頂部功能
    // scrollToTop();

    console.log('微醉 HOROYOI 招聘網站已載入完成 🎉');
});

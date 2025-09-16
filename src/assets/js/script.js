document.addEventListener('DOMContentLoaded', () => {

    const avatarContainer = document.getElementById('avatar-container');
    const body = document.body;
    let contentIsVisible = false;

    // --- 主题切换相关 ---
    const themeToggle = document.getElementById('theme-toggle');

    // --- 导航高亮相关 ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.content-section');
    const navHeight = 60;

    // --- 滚动返回相关 ---
    let scrollUpCounter = 0;
    const SCROLL_UP_THRESHOLD = 5;


    // ==========================================================
    // 函数定义区域
    // ==========================================================

    // 函数：切换主题并保存选择
    function switchTheme(isLight) {
        if (isLight) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    // 函数：显示主内容区，并锁定滚动1秒
    function showMainContent() {
        if (!contentIsVisible) {
            body.classList.add('scrolled');
            contentIsVisible = true;
            scrollUpCounter = 0;
            window.scrollTo(0, 0);
            
            setTimeout(() => {
                body.style.overflowY = 'auto';
            }, 1000);
        }
    }
    
    // 函数：处理所有滚轮事件（进入和退出主内容区）
    function handleWheelScroll(event) {
        if (!contentIsVisible && event.deltaY > 0) {
            showMainContent();
            return;
        }
        
        if (contentIsVisible && window.scrollY === 0 && event.deltaY < 0) {
            scrollUpCounter++;
        } else {
            scrollUpCounter = 0;
        }

        if (scrollUpCounter >= SCROLL_UP_THRESHOLD) {
            body.classList.remove('scrolled');
            contentIsVisible = false;
            scrollUpCounter = 0;
            body.style.overflowY = 'hidden';
        }
    }
    
    // 函数：根据滚动位置高亮导航链接
    function highlightNavOnScroll() {
        if (!contentIsVisible) return;

        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 1;
            if (scrollPosition >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================
    // 初始化和事件监听
    // ==========================================================

    // 1. 初始化主题：页面加载时立即检查localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        themeToggle.checked = true;
        switchTheme(true);
    } else {
        themeToggle.checked = false;
        switchTheme(false);
    }
    
    // 2. 监听主题切换开关的 'change' 事件
    themeToggle.addEventListener('change', () => {
        switchTheme(themeToggle.checked);
    });

    // 3. 监听其他交互事件
    avatarContainer.addEventListener('click', showMainContent);
    window.addEventListener('wheel', handleWheelScroll);
    window.addEventListener('scroll', highlightNavOnScroll);

});
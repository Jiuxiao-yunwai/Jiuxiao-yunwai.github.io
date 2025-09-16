document.addEventListener('DOMContentLoaded', () => {

    const avatarContainer = document.getElementById('avatar-container');
    const body = document.body;
    let contentIsVisible = false;

    // --- 新增：滚动高亮相关 ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.content-section');
    const navHeight = 60; // 导航栏高度

    // 用于“向上滚动返回”的缓冲效果
    let scrollUpCounter = 0;
    const SCROLL_UP_THRESHOLD = 5;

    // 函数：显示主内容区
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
    
    // 函数：处理返回初始页的滚轮事件
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
    
    // --- 新增函数：根据滚动位置高亮导航链接 ---
    function highlightNavOnScroll() {
        if (!contentIsVisible) return; // 如果不在主内容区，则不执行

        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        // 遍历所有内容区块，判断当前滚动到哪一个
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 1; // 减去导航栏高度和1px的偏移
            if (scrollPosition >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // 根据当前区块ID，更新导航链接的 'active' 类
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // 监听头像点击
    avatarContainer.addEventListener('click', showMainContent);
    // 监听滚轮事件
    window.addEventListener('wheel', handleWheelScroll);
    // 新增：监听滚动事件以更新导航栏高亮
    window.addEventListener('scroll', highlightNavOnScroll);

});
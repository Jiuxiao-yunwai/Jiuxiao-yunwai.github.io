document.addEventListener('DOMContentLoaded', () => {

    // 在这里列出你所有的博客文章文件名
    const posts = [
        'helloworld.md',
        'another-post.md'
        // 每当你写一篇新文章，就在这里添加它的文件名
    ];

    const blogListContainer = document.getElementById('blog-list');
    const postContainer = document.getElementById('post-container');

    // 函数：解析 Markdown 文件头部的元数据 (Front Matter)
    function parseFrontMatter(text) {
        const frontMatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = frontMatterRegex.exec(text);
        const frontMatter = {};
        let content = text;

        if (match) {
            const frontMatterStr = match[1];
            content = text.slice(match[0].length);
            frontMatterStr.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    frontMatter[key.trim()] = valueParts.join(':').trim();
                }
            });
        }
        return { frontMatter, content };
    }

    // 函数：加载并显示博客文章列表
    async function loadBlogList() {
        if (!blogListContainer) return;
        const sortedPosts = posts.slice().reverse();

        for (const postFile of sortedPosts) {
            const res = await fetch(`../../posts/${postFile}`); 
            const text = await res.text();
            const { frontMatter } = parseFrontMatter(text);

            if (frontMatter.title) {
                const listItem = document.createElement('li');
                listItem.className = 'blog-post-item';
                const slug = postFile.replace('.md', '');

                listItem.innerHTML = `
                    <h3 class="blog-post-title">
                        <a href="post.html?post=${slug}">${frontMatter.title}</a>
                    </h3>
                    <p class="blog-post-meta">
                        发布于：${frontMatter.date || '未知日期'} | 作者：${frontMatter.author || '匿名'}
                    </p>
                `;
                blogListContainer.appendChild(listItem);
            }
        }
    }

    // 函数：加载并显示单篇文章
    async function loadPost() {
        if (!postContainer) return;
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('post');

        if (!postSlug) {
            postContainer.innerHTML = '<h2>文章未找到！</h2>';
            return;
        }
        
        const postFile = posts.find(p => p.startsWith(postSlug));
        if (!postFile) {
            postContainer.innerHTML = '<h2>文章不存在！</h2>';
            return;
        }

        try {
            const res = await fetch(`../../posts/${postFile}`);
            if (!res.ok) throw new Error('Network response was not ok');
            
            const text = await res.text();
            const { frontMatter, content } = parseFrontMatter(text);
            document.title = frontMatter.title || '博客文章';

            postContainer.innerHTML = `
                <header class="post-header">
                    <h1 class="post-title">${frontMatter.title || '无标题'}</h1>
                    <p class="post-meta">
                        发布于：${frontMatter.date || '未知日期'} | 作者：${frontMatter.author || '匿名'}
                    </p>
                </header>
                <div class="post-content">
                    ${marked.parse(content)}
                </div>
            `;
        } catch (error) {
            console.error('Fetching post failed:', error);
            postContainer.innerHTML = '<h2>加载文章失败，请检查控制台信息。</h2>';
        }
    }
    
    // 根据当前页面路径，决定执行哪个函数
    if (window.location.pathname.includes('blog.html')) {
        loadBlogList();
    } else if (window.location.pathname.includes('post.html')) {
        loadPost();
    }
});
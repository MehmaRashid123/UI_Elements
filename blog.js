

const blogPosts = [
  {
    title: "The Rise of AI in Web Development",
    date: "October 26, 2025",
    author: "Jane Doe",
    excerpt: "Artificial intelligence is revolutionizing the way we build websites. From automated testing to AI-powered design tools, the future of web development is here.",
    image: "https://images.unsplash.com/photo-1620712943543-285f7266c8da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "A Deep Dive into Modern CSS",
    date: "October 22, 2025",
    author: "John Smith",
    excerpt: "CSS has evolved far beyond simple color and layout changes. In this post, we'll explore advanced techniques like Grid, Flexbox, and custom properties.",
    image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "JavaScript Frameworks: A 2025 Comparison",
    date: "October 18, 2025",
    author: "Emily White",
    excerpt: "React, Vue, Angular, Svelte... the list of JavaScript frameworks goes on. We'll compare the most popular options to help you choose the right one for your next project.",
    image: "https://images.unsplash.com/photo-1607702745224-3f2a1a4c1f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "The Importance of Web Accessibility",
    date: "October 15, 2025",
    author: "Chris Green",
    excerpt: "Web accessibility is not just a feature, it's a necessity. Learn how to make your websites usable for everyone.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Building a REST API with Node.js and Express",
    date: "October 12, 2025",
    author: "Alex Johnson",
    excerpt: "A step-by-step guide to building a robust and scalable REST API using Node.js and Express.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Getting Started with Docker for Web Developers",
    date: "October 9, 2025",
    author: "Samantha Brown",
    excerpt: "Docker can seem intimidating at first, but it's a powerful tool for web developers. This guide will help you get started.",
    image: "https://images.unsplash.com/photo-1526374965328-5f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

let originalBlogPosts = [...blogPosts];
let postsToShow = 3;

function createBlogCard(post) {
  const card = document.createElement('div');
  card.className = 'blog-card';

  card.innerHTML = `
    <img src="${post.image}" alt="Blog post image for ${post.title}">
    <div class="blog-card-content">
      <h3>${post.title}</h3>
      <p class="blog-meta">By ${post.author} on ${post.date}</p>
      <p>${post.excerpt}</p>
      <a href="#" class="read-more">Read More</a>
    </div>
  `;

  return card;
}

const blogContainer = document.getElementById('blog-container');

function displayBlogPosts(posts) {
    blogContainer.innerHTML = '';
    posts.slice(0, postsToShow).forEach(post => {
        const card = createBlogCard(post);
        blogContainer.appendChild(card);
    });
    if (postsToShow >= posts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

displayBlogPosts(blogPosts);

const searchInput = document.getElementById('blog-search');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPosts = blogPosts.filter(post => {
        return post.title.toLowerCase().includes(searchTerm);
    });
    displayBlogPosts(filteredPosts);
});

const sortByDateButton = document.getElementById('sort-by-date');

sortByDateButton.addEventListener('click', () => {
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayBlogPosts(blogPosts);
});

const clearFiltersButton = document.getElementById('clear-filters');

clearFiltersButton.addEventListener('click', () => {
    searchInput.value = '';
    blogPosts = [...originalBlogPosts];
    postsToShow = 3;
    displayBlogPosts(blogPosts);
});

const loadMoreButton = document.getElementById('load-more');

loadMoreButton.addEventListener('click', () => {
    postsToShow += 3;
    displayBlogPosts(blogPosts);
});

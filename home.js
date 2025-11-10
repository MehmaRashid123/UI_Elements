
const homeBlogContainer = document.getElementById('home-blog-container');

function createHomeBlogCard(post) {
  const card = document.createElement('div');
  card.className = 'a-blog-card';

  card.innerHTML = `
    <div class="blog-image"><img src="${post.image}" alt="Blog post image for ${post.title}"></div>
    <div class="a-blog-content">
      <span class="a-tag">${post.author}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <a href="blog.html" class="read-more">Read More</a>
    </div>
  `;

  return card;
}

function displayHomeBlogPosts(posts) {
    homeBlogContainer.innerHTML = '';
    posts.slice(0, 3).forEach(post => {
        const card = createHomeBlogCard(post);
        homeBlogContainer.appendChild(card);
    });
}

displayHomeBlogPosts(blogPosts);

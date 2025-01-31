document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');

    fetch('articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Expected JSON, but got " + contentType);
            }
            return response.json();
        })
        .then(articles => {
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            articles.forEach(article => {
                const articleElement = document.createElement('article');
                const excerpt = article.content.substring(0, 100) + '...';
                articleElement.innerHTML = `
                    <h2>${article.title}</h2>
                    <p>${article.date}</p>
                    <div class="excerpt">${excerpt}</div>
                    <div class="full-content" style="display: none;">${article.content}</div>
                    <button class="read-more">Read more</button>
                `;
                articleElement.querySelector('.read-more').addEventListener('click', () => {
                    const fullContent = articleElement.querySelector('.full-content');
                    const excerpt = articleElement.querySelector('.excerpt');
                    const readMoreButton = articleElement.querySelector('.read-more');
                    if (fullContent.style.display === 'none') {
                        fullContent.style.display = 'block';
                        excerpt.style.display = 'none';
                        readMoreButton.textContent = 'Read less';
                    } else {
                        fullContent.style.display = 'none';
                        excerpt.style.display = 'block';
                        readMoreButton.textContent = 'Read more';
                    }
                });
                articlesContainer.appendChild(articleElement);
            });
        })
        .catch(error => console.error('Error loading articles:', error));
});

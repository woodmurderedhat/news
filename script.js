document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');

    fetch('articles')
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
                articleElement.innerHTML = `
                    <h2>${article.title}</h2>
                    <p>${article.date}</p>
                    <div>${article.content}</div>
                `;
                articlesContainer.appendChild(articleElement);
            });
        })
        .catch(error => console.error('Error loading articles:', error));
});

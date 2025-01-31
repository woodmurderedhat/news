const fs = require('fs');
const path = require('path');
const marked = require('marked');

const articlesDir = path.join(__dirname, 'articles');
const outputFilePath = path.join(__dirname, 'articles', 'articles.json');

fs.readdir(articlesDir, (err, files) => {
    if (err) {
        return console.error('Error reading articles directory:', err);
    }

    const articles = files.filter(file => file.endsWith('.md')).map(file => {
        const filePath = path.join(articlesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const [metadata, ...body] = content.split('\n\n');
        const metadataObj = Object.fromEntries(metadata.split('\n').map(line => line.split(': ').map(part => part.trim())));
        return {
            title: metadataObj.title,
            date: metadataObj.date,
            content: marked(body.join('\n\n'))
        };
    });

    fs.writeFile(outputFilePath, JSON.stringify(articles, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('articles.json has been generated successfully.');
        }
    });
});

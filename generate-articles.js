const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const port = 3000;

app.get('/generate-articles', (req, res) => {
    const articlesDir = path.join(__dirname, 'articles');
    const outputFilePath = path.join(__dirname, 'articles', 'articles.json');

    fs.readdir(articlesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading articles directory' });
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
                return res.status(500).json({ error: 'Error writing file' });
            }
            res.json({ message: 'articles.json has been generated successfully.' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

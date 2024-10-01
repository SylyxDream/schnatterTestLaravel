const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const postsFilePath = 'posts.json';

// Middleware zum Verarbeiten von JSON-Daten
app.use(express.json());

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Route zum Hochladen eines neuen Posts
app.post('/upload', upload.single('image'), (req, res) => {
    const postText = req.body.text;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let posts = [];
    if (fs.existsSync(postsFilePath)) {
        const fileData = fs.readFileSync(postsFilePath, 'utf-8');
        posts = JSON.parse(fileData);
    }

    const newPost = {
        text: postText,
        image: imagePath,
        likes: 0
    };
    posts.unshift(newPost);

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');

    res.json({
        success: true,
        text: postText,
        image: imagePath
    });
});

// Route zum Laden der Posts
app.get('/posts', (req, res) => {
    if (fs.existsSync(postsFilePath)) {
        const fileData = fs.readFileSync(postsFilePath, 'utf-8');
        const posts = JSON.parse(fileData);
        res.json(posts);
    } else {
        res.json([]);
    }
});

// Route zum Löschen eines Posts und der zugehörigen Bilddatei
app.delete('/posts/:index', (req, res) => {
    const postIndex = parseInt(req.params.index, 10);

    if (fs.existsSync(postsFilePath)) {
        const fileData = fs.readFileSync(postsFilePath, 'utf-8');
        let posts = JSON.parse(fileData);

        if (postIndex >= 0 && postIndex < posts.length) {
            const postToDelete = posts[postIndex];

            // Wenn der Post ein Bild hat, lösche die Bilddatei
            if (postToDelete.image) {
                const imagePath = path.join(__dirname, postToDelete.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath); // Bilddatei löschen
                    console.log(`Bilddatei gelöscht: ${imagePath}`);
                }
            }

            // Post aus dem Array entfernen
            posts.splice(postIndex, 1);

            // Posts zurück in die Datei schreiben
            fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');

            return res.json({ success: true });
        }
    }

    res.status(404).json({ success: false, message: 'Post nicht gefunden' });
});

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});

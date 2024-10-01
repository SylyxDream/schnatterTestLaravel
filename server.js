const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const postsFilePath = 'posts.json';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Route zum Hochladen eines neuen Posts mit Bild
app.post('/upload', upload.single('image'), (req, res) => {
    const postText = req.body.text;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    let posts = [];

    if (fs.existsSync(postsFilePath)) {
        posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    }

    posts.unshift({ text: postText, image: imagePath, likes: 0 });
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');

    res.json({ success: true, text: postText, image: imagePath });
});

// Route zum Abrufen der Posts
app.get('/posts', (req, res) => {
    const posts = fs.existsSync(postsFilePath) ? JSON.parse(fs.readFileSync(postsFilePath, 'utf-8')) : [];
    res.json(posts);
});

// Route zum Löschen eines Posts inklusive Bild
app.delete('/posts/:index', (req, res) => {
    const postIndex = parseInt(req.params.index, 10);
    let posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));

    if (postIndex >= 0 && postIndex < posts.length) {
        const postToDelete = posts[postIndex];
        if (postToDelete.image) fs.unlinkSync(path.join(__dirname, postToDelete.image));
        posts.splice(postIndex, 1);
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
        return res.json({ success: true });
    }

    res.status(404).json({ success: false });
});

// Server starten
app.listen(3000, () => console.log('Server läuft auf Port 3000'));

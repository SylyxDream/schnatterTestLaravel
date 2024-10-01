const app = new Vue({
    el: '#app',
    data: {
        newPostText: '', 
        newPostImage: null, 
        posts: [] 
    },
    methods: {
        // Fügt einen neuen Post hinzu
        addPost() {
            if (this.newPostText.trim()) {
                const formData = new FormData();
                formData.append('text', this.newPostText);
                if (this.newPostImage) {
                    const imageFile = this.$refs.fileInput ? this.$refs.fileInput.files[0] : null;
                    formData.append('image', imageFile);
                }

                // Sendet den Post an den Server
                fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const newPost = {
                            text: data.text,
                            image: data.image,
                            likes: 0
                        };
                        this.posts.unshift(newPost); 
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Hochladen des Posts:', error);
                });

                // Zurücksetzen der Eingabefelder
                this.newPostText = '';
                this.newPostImage = null;
                
                if (this.$refs.fileInput) {
                    this.$refs.fileInput.value = null;
                }
            } else {
                alert('Bitte geben Sie einen Text ein.');
            }
        },
        // Verarbeitet die Auswahl eines Bildes
        onFileChange(e) {
            const file = e.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.newPostImage = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Bitte wählen Sie eine Bilddatei aus.');
                this.newPostImage = null;
                this.$refs.fileInput.value = null;
            }
        },
        // Öffnet den Datei-Auswahldialog
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        // Lädt alle Posts vom Server
        loadPosts() {
            fetch('/posts')
                .then(response => response.json())
                .then(data => {
                    this.posts = data;
                })
                .catch(error => {
                    console.error('Fehler beim Laden der Posts:', error);
                });
        },
        // Löscht einen Post
        deletePost(index) {
            fetch(`/posts/${index}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.posts.splice(index, 1);
                }
            })
            .catch(error => {
                console.error('Fehler beim Löschen des Posts:', error);
            });
        },
        // Liked einen Post
        likePost(index) {
            fetch(`/posts/${index}/like`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.posts[index].likes = data.likes; 
                }
            })
            .catch(error => {
                console.error('Fehler beim Liken des Posts:', error);
            });
        }        
    },
    // Lädt die Posts beim Erstellen der Komponente
    created() {
        this.loadPosts();
    }
});

const app = new Vue({
    el: '#app',
    data: {
        newPostText: '', // Text für den neuen Post
        newPostImage: null, // Bild für den neuen Post
        posts: [] // Array aller Posts
    },
    methods: {
        addPost() {
            if (this.newPostText.trim()) {
                const formData = new FormData();
                formData.append('text', this.newPostText);
                if (this.newPostImage) {
                    const imageFile = this.$refs.fileInput ? this.$refs.fileInput.files[0] : null;
                    formData.append('image', imageFile);
                }

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
                        this.posts.unshift(newPost); // Füge den neuen Post zur Liste hinzu
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Hochladen des Posts:', error);
                });

                this.newPostText = '';
                this.newPostImage = null;
                
                if (this.$refs.fileInput) {
                    this.$refs.fileInput.value = null;
                }
            } else {
                alert('Bitte geben Sie einen Text ein.');
            }
        },
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
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
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
        deletePost(index) {
            fetch(`/posts/${index}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.posts.splice(index, 1); // Entferne den Post aus dem Array
                }
            })
            .catch(error => {
                console.error('Fehler beim Löschen des Posts:', error);
            });
        },
        // Neue Methode zum Liken eines Posts
        likePost(index) {
            fetch(`/posts/${index}/like`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.posts[index].likes = data.likes; // Setze die aktualisierte Anzahl der Likes
                }
            })
            .catch(error => {
                console.error('Fehler beim Liken des Posts:', error);
            });
        }        
    },
    created() {
        this.loadPosts();
    }
});

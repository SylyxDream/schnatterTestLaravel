new Vue({
    el: '#app',
    data: {
        showPostInput: false,
        showProfileMenu: false,
        currentView: 'home',
        newPostText: '',
        posts: [],
        user: {
            name: 'Dein Name',
            email: 'beispiel@example.com'
        },
        newPostImage: null // Hier wird das Bild gespeichert
    },
    methods: {
        // Posts vom Server abrufen
        fetchPosts() {
            fetch('/posts')
                .then(response => response.json())
                .then(data => {
                    // Posts nach ID oder Zeitstempel absteigend sortieren
                    this.posts = data.sort((a, b) => b.id - a.id);
                })
                .catch(error => console.error('Fehler beim Laden der Posts:', error));
        },
        // Post und Bild speichern
        postMessage() {
            if (this.newPostText.trim() !== '') {
                let formData = new FormData();
                formData.append('author', this.user.name);
                formData.append('content', this.newPostText);

                // Bild, falls vorhanden, anhängen
                if (this.newPostImage) {
                    formData.append('image', this.newPostImage);
                }

                fetch('/posts', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    this.posts.unshift(data); // Neuen Post an den Anfang der Liste setzen
                    this.newPostText = ''; // Eingabefeld zurücksetzen
                    this.newPostImage = null; // Bild zurücksetzen
                    this.showPostInput = false;
                })
                .catch(error => console.error('Fehler beim Speichern des Posts:', error));
            }
        },
        // Datei-Upload-Methode (Bild speichern)
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.newPostImage = file; // Bild speichern
            console.log('Datei ausgewählt:', file);
        },
        togglePostInput() {
            this.showPostInput = !this.showPostInput;
        },
        toggleProfileMenu() {
            this.showProfileMenu = !this.showProfileMenu;
        },
        showAccounts() {
            this.currentView = 'accounts';
            this.showProfileMenu = false;
            this.showPostInput = false;
        },
        showHome() {
            this.currentView = 'home';
            this.showPostInput = false;
        },
        showSearch() {
            this.currentView = 'search';
            this.showPostInput = false;
        },
        showNotifications() {
            this.currentView = 'notifications';
            this.showPostInput = false;
        },
        showSettings() {
            this.currentView = 'settings';
            this.showPostInput = false;
        },
        createCompanyAccount() {
            console.log('Company account created');
        },
        logout() {
            console.log('User logged out');
        }
    },
    mounted() {
        this.fetchPosts(); // Beim Laden der Seite die Posts abrufen
    }
});

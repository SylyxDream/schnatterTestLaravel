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
        newPostImage: null // Hier wird das Bild für einen neuen Post gespeichert
    },
    methods: {
        // Posts vom Server abrufen und nach ID oder Zeitstempel sortieren
        fetchPosts() {
            fetch('/posts')
                .then(response => response.json())
                .then(data => {
                    // Posts nach ID oder Zeitstempel absteigend sortieren
                    this.posts = data.sort((a, b) => b.id - a.id);
                })
                .catch(error => console.error('Fehler beim Laden der Posts:', error));
        },
        // Neuen Post erstellen und an den Server senden
        postMessage() {
            if (this.newPostText.trim() !== '') {
                let formData = new FormData();
                formData.append('author', this.user.name);
                formData.append('content', this.newPostText);

                // Bild, falls vorhanden, zum FormData hinzufügen
                if (this.newPostImage) {
                    formData.append('image', this.newPostImage);
                }

                // POST-Anfrage an den Server senden
                fetch('/posts', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    this.posts.unshift(data); 
                    this.newPostText = ''; 
                    this.newPostImage = null; 
                    this.showPostInput = false;
                })
                .catch(error => console.error('Fehler beim Speichern des Posts:', error));
            }
        },
        // Methode zum Verarbeiten des Bild-Uploads
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.newPostImage = file; 
            console.log('Datei ausgewählt:', file);
        },
        // Toggle-Methoden für UI-Elemente
        togglePostInput() {
            this.showPostInput = !this.showPostInput;
        },
        toggleProfileMenu() {
            this.showProfileMenu = !this.showProfileMenu;
        },
        // Methoden zum Wechseln der Ansicht
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
        // Platzhalter-Methoden für zukünftige Funktionalitäten
        createCompanyAccount() {
            console.log('Company account created');
        },
        logout() {
            console.log('User logged out');
        }
    },
    // Lebenszyklus-Hook: Wird aufgerufen, wenn die Komponente in den DOM eingebunden wird
    mounted() {
        this.fetchPosts(); 
    }
});

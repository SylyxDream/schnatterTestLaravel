<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schnatter</title>
    <link rel="stylesheet" href="{{ asset('styles.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
    <script src="{{ asset('script.js') }}" defer></script>
</head>

<body>
    <div id="app">
        <header>
            <h1>Schnatter</h1>
            <div class="profile-icon" @click="toggleProfileMenu">
                <div class="dropdown-menu" v-if="showProfileMenu">
                    <ul>
                        <li><a href="#" @click.prevent="showAccounts">Meine Accounts</a></li>
                        <li><a href="#" @click.prevent="showSettings">Einstellungen</a></li>
                        <li><a href="#" @click.prevent="logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </header>

        <div class="container">
            <div class="sidebar">
                <ul>
                    <li><a href="#" @click.prevent="showHome"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="#" @click.prevent="showSearch"><i class="fas fa-search"></i> Suchen</a></li>
                    <li><a href="#" @click.prevent="showNotifications"><i class="fas fa-bell"></i> Mitteilungen</a></li>
                </ul>
                <button @click="togglePostInput">
                    <span v-if="showPostInput">Abbrechen</span>
                    <span v-else>Schnattern</span>
                </button>
            </div>

            <!--- Post-Eingabe -->
            <div class="content">
                <div class="post-input" v-if="showPostInput">
                    <textarea v-model="newPostText" placeholder="Was schnatterst du?"></textarea><br>
                    <input type="file" @change="handleFileUpload" accept="image/*"><br>
                    <button @click="postMessage">Schnattern</button>
                </div>

                <!-- Account-Übersicht -->
                <div class="account-overview" v-if="currentView === 'accounts' && !showPostInput">
                    <h2>Meine Accounts</h2>
                    <div class="account-info">
                        <h3>@{{ user.name }}</h3>
                        <p>Email: @{{ user.email }}</p>
                    </div>
                    <button @click="createCompanyAccount">Firmenaccount erstellen</button>
                </div>

                <!-- Suchfenster -->
                <div class="search-view" v-if="currentView === 'search' && !showPostInput">
                    <h2>Suche</h2>
                    <input type="text" placeholder="Suche nach Beiträgen, Personen oder Themen..." class="search-input">
                    <div class="search-results">
                        <p>Suchergebnisse werden hier angezeigt.</p>
                    </div>
                </div>

                <!-- Mitteilungen -->
                <div class="notifications-view" v-if="currentView === 'notifications' && !showPostInput">
                    <h2>Mitteilungen</h2>
                    <div class="notifications-list">
                        <p>Deine Mitteilungen werden hier angezeigt.</p>
                    </div>
                </div>

                <!-- Einstellungen -->
                <div class="settings-view" v-if="currentView === 'settings' && !showPostInput">
                    <h2>Einstellungen</h2>
                    <div class="notifications-list">
                        <p>Hier sind die Einstellungen.</p>
                    </div>
                </div>

                <!-- Posts anzeigen -->
                <div v-if="currentView === 'home' && !showPostInput">
                    <div v-for="post in posts" :key="post.id" class="post">
                        <h3>@{{ post.author }}</h3>
                        <p>@{{ post.content }}</p>
                        <div v-if="post.image">
                            <img :src="post.image" alt="Bild zum Post" style="max-width: 100%; height: auto;">
                        </div>
                    </div>

                </div>
            </div>
        </div>
</body>

</html>
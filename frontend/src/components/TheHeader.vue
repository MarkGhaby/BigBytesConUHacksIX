<template>
  <q-header reveal>
    <q-toolbar class="font-sans bg-stone-200 text-black">
      <q-btn flat round dense icon="menu" @click="toggleDrawer" />
      <q-toolbar-title>{{ headerMessage }}</q-toolbar-title>
      <q-space />

      <!-- Profile Button with Dropdown -->
      <div class="relative">
        <q-btn flat round dense icon="account_circle" @click="toggleDropdown" />

        <!-- Dropdown Menu -->
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-300"
        >
          <p class="text-lg font-semibold text-gray-800">
            {{ isLoggedIn ? `Welcome, ${spotifyUsername}` : "Welcome" }}
          </p>

      

          <!-- Settings Section (Only shown when logged in) -->
          <div v-if="isLoggedIn" class="mt-3 space-y-3 border-t pt-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Suggest Liked Songs</span>
              <q-toggle
                v-model="suggestLikedSongs"
                color="green"
                @update:model-value="handleToggleChange"
              />
            </div>

            <!-- Number of Songs Selector -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Number of Songs</span>
              <q-input
                v-model.number="songCount"
                type="number"
                dense
                outlined
                class="w-20"
                :min="1"
                :max="10"
                @update:model-value="handleSongCountChange"
                style="--q-primary: #1DB954"
              />
            </div>
          </div>

          <!-- Show Sign In if Not Logged In -->
          <q-btn
            v-if="!isLoggedIn"
            outline
            class="w-full mt-2"
            color="green"
            label="Sign in with Spotify"
            @click="signInWithSpotify"
          />

          <!-- Show Logout if Logged In -->
          <q-btn
            v-if="isLoggedIn"
            flat
            dense
            class="w-full text-red-500 mt-2"
            label="Logout"
            @click="logout"
          />
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["toggle-drawer", "suggest-songs-toggle", "song-count-change"]);
const showDropdown = ref(false);
const isLoggedIn = ref(false);
const spotifyUsername = ref("");
const suggestLikedSongs = ref(false);
const songCount = ref(3); // Default to 3 songs

// ✅ Toggle dropdown visibility
const toggleDrawer = () => {
  emit("toggle-drawer");
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// ✅ Check if User is Logged In and Get Username
const checkLoginStatus = () => {
  const token = localStorage.getItem("spotify_token");
  
  if (!token) {
    isLoggedIn.value = false;
    spotifyUsername.value = "";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && payload.exp * 1000 > Date.now()) {
      isLoggedIn.value = true;
      spotifyUsername.value = payload.username || "User";
    } else {
      // Token expired
      localStorage.removeItem("spotify_token");
      isLoggedIn.value = false;
      spotifyUsername.value = "";
    }
  } catch (error) {
    console.error("Token validation error:", error);
    localStorage.removeItem("spotify_token");
    isLoggedIn.value = false;
    spotifyUsername.value = "";
  }
};

// ✅ Redirect User to Spotify Login
const signInWithSpotify = () => {
  localStorage.removeItem("spotify_token"); // ✅ Force fresh login
  sessionStorage.clear();
  window.location.href = "http://localhost:3000/api/auth/spotify";
};

const logout = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      
      // Clear all local storage and state
      localStorage.clear();
      sessionStorage.clear();
      isLoggedIn.value = false;
      spotifyUsername.value = "";
      showDropdown.value = false;

      // Logout from Spotify
      const spotifyLogoutWindow = window.open(data.spotifyLogoutUrl, 'Spotify Logout', 'width=500,height=600');
      setTimeout(() => {
        if (spotifyLogoutWindow) {
          spotifyLogoutWindow.close();
        }
        window.location.href = '/';
      }, 2000);
    } else {
      console.error("Logout failed");
    }
  } catch (err) {
    console.error("Logout error:", err);
  }
};

// Handle toggle change
const handleToggleChange = async (value) => {
  try {
    // Save preference to localStorage
    localStorage.setItem('suggest_liked_songs', value.toString());
    
    // Here you could also send the preference to your backend if needed
    console.log(`Suggest liked songs: ${value}`);
    
    // Emit event for parent components if needed
    emit('suggest-songs-toggle', value);
  } catch (error) {
    console.error('Failed to save preference:', error);
  }
};

// Handle song count change
const handleSongCountChange = (value) => {
  try {
    // Ensure value is within bounds
    const count = Math.min(Math.max(parseInt(value) || 1, 1), 10);
    songCount.value = count;
    localStorage.setItem('preferred_song_count', count.toString());
    emit('song-count-change', count);
  } catch (error) {
    console.error('Failed to save song count preference:', error);
  }
};

onMounted(() => {
  // Check for token in URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Save token and clean up URL
    localStorage.setItem('spotify_token', token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  checkLoginStatus();

  // Load toggle preference
  const savedPreference = localStorage.getItem('suggest_liked_songs');
  suggestLikedSongs.value = savedPreference === 'true';

  // Load song count preference
  const savedSongCount = localStorage.getItem('preferred_song_count');
  if (savedSongCount) {
    songCount.value = parseInt(savedSongCount);
  }
});
</script>
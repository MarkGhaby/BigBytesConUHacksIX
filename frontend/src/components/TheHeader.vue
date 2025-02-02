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
import { ref, onMounted, provide } from "vue";

const emit = defineEmits(["toggle-drawer"]);
const showDropdown = ref(false);
const isLoggedIn = ref(false);
const spotifyUsername = ref("");
const suggestLikedSongs = ref(false);
const songCount = ref(3); // Default to 3 songs

// ✅ Provide these values so other components can access them
provide("suggestLikedSongs", suggestLikedSongs);
provide("songCount", songCount);

// ✅ Restore Alternating Header Messages
const messages = [
  "How are you feeling today?",
  "It's okay to express yourself.",
  "Let your thoughts flow freely.",
  "No one is watching. Be honest.",
  "This is your space. Speak freely."
];

const headerMessage = ref("");

// ✅ Randomly Pick a Header Message on Load
const setRandomHeaderMessage = () => {
  headerMessage.value = messages[Math.floor(Math.random() * messages.length)];
};

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

// ✅ Logout Function
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

// ✅ Handle Suggest Liked Songs Toggle Change
const handleToggleChange = async (value) => {
  suggestLikedSongs.value = value;
  localStorage.setItem('suggest_liked_songs', value.toString());
};

// ✅ Handle Song Count Change
const handleSongCountChange = (value) => {
  songCount.value = Math.min(Math.max(parseInt(value) || 1, 1), 10);
  localStorage.setItem('preferred_song_count', songCount.value.toString());
};

// ✅ Load preferences when component mounts
onMounted(() => {
  // ✅ Set a random header message
  setRandomHeaderMessage();

  // ✅ Call checkLoginStatus to update user login state
  checkLoginStatus(); 

  // ✅ Load preferences from localStorage
  suggestLikedSongs.value = localStorage.getItem("suggest_liked_songs") === "true";
  songCount.value = parseInt(localStorage.getItem("preferred_song_count")) || 3;
});
</script>
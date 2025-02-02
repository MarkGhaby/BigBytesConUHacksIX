<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // ✅ Store token for future use
    localStorage.setItem("spotify_token", token);

    // ✅ Remove token from URL to keep it clean
    window.history.replaceState({}, document.title, window.location.pathname);

    // ✅ Redirect to home page
    router.push("/");
  }
});
</script>
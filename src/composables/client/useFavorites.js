// src/composables/useFavorites.js
import { ref } from "vue";
import axios from "axios";

export function useFavorites() {
  const preferences = ref(new Set());

  // Charger les favoris depuis backend
  async function loadFavorites() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8088/client/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const favIds = res.data.map(f => f.id);
      preferences.value = new Set(favIds);
    } catch (err) {
      console.error("Erreur en récupérant les favoris:", err);
    }
  }

  // Ajouter / supprimer un favori
  async function togglePreference(item) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (preferences.value.has(item.id)) {
        await axios.post(
          "http://localhost:8088/client/favorites/delete",
          { itemId: item.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        preferences.value.delete(item.id);
      } else {
        await axios.post(
          "http://localhost:8088/client/favorites/add",
          { itemId: item.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        preferences.value.add(item.id);
      }
    } catch (err) {
      console.error("Erreur toggle favorite:", err);
    }
  }

  return {
    preferences,
    loadFavorites,
    togglePreference
  };
}

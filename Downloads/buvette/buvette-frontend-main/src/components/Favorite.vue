<template>
    <div class="favorites-page">
        <h2 class="title">⭐ Mes Favoris</h2>

        <div v-if="favorites.length === 0" class="empty-box">
            <p>Aucun favori pour le moment.</p>
        </div>

        <div v-else class="favorites-grid">
            <div v-for="item in favorites" :key="item.id" class="favorite-card">

                <!-- Image du produit (si existe) -->
                <img v-if="item.image" :src="item.image" alt="item" class="item-image" />

                <div class="info">
                    <h3>{{ item.name }}</h3>
                    <p class="price">{{ item.price }} DH</p>
                </div>
                <button class="remove-btn" @click="removeFavorite(item.id)">
                    <i class="fa-solid fa-heart-crack"></i>
                </button>

            </div>
        </div>
    </div>
</template>


<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const favorites = ref([]);

// Charger les favoris
const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await axios.get("http://localhost:8088/favorites", {
            headers: { Authorization: `Bearer ${token}` }
        });

        favorites.value = res.data;
    } catch (err) {
        console.error("Erreur lors de la récupération des favoris:", err);
    }
};

// Supprimer un favori
const removeFavorite = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        await axios.post(
            "http://localhost:8088/favorites/delete",
            { itemId: itemId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Supprimer localement
        favorites.value = favorites.value.filter(item => item.id !== itemId);

    } catch (err) {
        console.error("Erreur lors de la suppression:", err);
    }
};

fetchFavorites();
</script>


<style scoped>
.favorites-page {
    max-width: 900px;
    margin: auto;
    padding: 20px;
}

.title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    color: #333;
}

.empty-box {
    text-align: center;
    padding: 40px;
    background: #f7f7f7;
    border-radius: 12px;
    color: #777;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
}

.favorite-card {
    background: white;
    border-radius: 14px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: 0.2s ease;
    cursor: pointer;
}

.favorite-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.item-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 12px;
}

.info h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.price {
    font-weight: bold;
    color: #288ea7;
    /* bleu harmonieux */
    margin-top: 6px;
}

.remove-btn {
    position: relative;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.2s;
    color: rgb(226, 51, 51)
}

.remove-btn:hover {
    transform: scale(1.1);
}
</style>

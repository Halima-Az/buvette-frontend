<template>
    <HeaderPageMenu title="" />
    <div class="favorites-page">
        <h2 class="title">
            Discover Your Favorite Food & Drinks</h2>
        <div v-if="favorites.length === 0" class="empty-state">
            <i class="fa-regular fa-star"></i>
            <p class="empty-title">No favorites yet</p>
            <p class="empty-text">
                You haven’t added any favorite food or drinks yet.
            </p>
        </div>

        <div v-else class="favorites-grid">
            <Favorite v-for="item in favorites" :key="item.id" :item="item" @remove="removeFavorite" />
        </div>
    </div>

    <FooterPageMenu />
</template>
<script setup>
import Favorite from '@/components/client/Favorite.vue';
import FooterPageMenu from '@/components/client/FooterPageMenu.vue';
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue';
import axios from "axios";
import { ref, onMounted } from "vue";

const favorites = ref([]);

// Charger les favoris
const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await axios.get("http://localhost:8088/client/favorites", {
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
            "http://localhost:8088/client/favorites/delete",
            { itemId: itemId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Supprimer localement
        favorites.value = favorites.value.filter(item => item.id !== itemId);

    } catch (err) {
        console.error("Erreur lors de la suppression:", err);
    }
};

onMounted(fetchFavorites);
</script>
<style>
.favorites-page {
    min-height: 100vh;
    padding: 20px 30px;
    padding-bottom: 120px;
    background: #f5f8f3;
    ;
}

.title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 40px;
    font-weight: 700;
    color: #6c6c77ce;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 24px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    width:40%;
    margin:0 auto
}

.empty-state i {
     color: #6b7280;
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.9;
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #111827;
}

.empty-text {
    font-size: 14px;
    color: #6b7280;
    max-width: 320px;
    line-height: 1.5;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    animation: fadeIn 0.8s ease;
}

@media (max-width:700px) {
    .favorites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 30px;
        animation: fadeIn 0.8s ease;
    }
    .empty-state {
    width:100%
}
}
</style>
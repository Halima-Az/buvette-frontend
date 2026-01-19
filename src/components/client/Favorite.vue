<template>

    <div class="favorite-card">

        <!-- Image du produit (si existe) -->
        <img v-if="item.image" :src="item.image" alt="item" class="item-image" />

        <div class="info">
            <h3>{{ item.name }}</h3>
            <p class="price">{{ item.price }} DH</p>
        </div>
        <button class="remove-btn" @click="$emit('remove', item.id)">
            <i class="fa-solid fa-heart-crack"></i>
        </button>

    </div>


</template>


<script setup>
defineProps({
    item: Object
})
</script>

<style scoped>
.favorite-card {
    background: white;
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.6s ease;
}
@keyframes fadeIn {
    from{
        opacity:0;
        transform: scale(0);

    }
    to{
        opacity: 1;
         transform: scale(1.06);

    }
}
.favorite-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
}

.item-image {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 0;
    margin-bottom: 0;
    transition: transform 0.5s ease;
}

.favorite-card:hover .item-image {
    transform: scale(1.08);
}

.info {
    padding: 20px;
}

.info h3 {
    margin: 0 0 12px 0;
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.price {
    font-weight: 700;
    font-size: 24px;
    background: black;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 0;
}

.remove-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ff6b9d;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.remove-btn:hover {
    transform: scale(1.15) rotate(-10deg);
    background: white;
    box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
    color: #e93939;
}

.remove-btn:active {
    transform: scale(1.05) rotate(-5deg);
}

/* Responsive Design */
@media (max-width: 768px) {
    .favorites-page {
        padding: 30px 15px;
        padding-bottom: 100px;
    }

    .title {
        font-size: 32px;
        gap: 12px;
    }

    .title i {
        font-size: 28px;
    }

    .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 20px;
    }

    .item-image {
        height: 200px;
    }

    .info {
        padding: 15px;
    }

    .info h3 {
        font-size: 16px;
    }

    .price {
        font-size: 20px;
    }

    .remove-btn {
        width: 38px;
        height: 38px;
        font-size: 18px;
        top: 10px;
        right: 10px;
    }
}

@media (min-width: 1400px) {
    .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}
</style>

<template>
    <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>

        <input type="text" :placeholder="placeholder" :value="modelValue" @input="onInput" />

        <i v-if="modelValue" class="fa-solid fa-xmark clear-icon" @click="clear"></i>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        default: ""
    },
    placeholder: {
        type: String,
        default: "Search..."
    }
})

const emit = defineEmits(["update:modelValue"])

function onInput(e) {
    emit("update:modelValue", e.target.value)
}

function clear() {
    emit("update:modelValue", "")
}
</script>

<style scoped>
.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #ffffff;
    margin: 10px;
    width: 40%;
    border-radius: 14px;
    padding: 12px 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.40s ease;
}

.search-wrapper:focus-within {
    border: 1px solid #ce971f;
}

.search-wrapper input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    padding: 0 28px;
    background: transparent;
    color: #333;
}

/* ICONS */
.search-icon {
    position: absolute;
    left: 16px;
    color: #9ca3af;
    font-size: 16px;
}

.clear-icon {
    position: absolute;
    right: 16px;
    color: #9ca3af;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.2s;
}

.clear-icon:hover {
    color: #ce971f;
}

@media(max-width:400px) {
    .search-wrapper {
        width: 80%;
    }

}
</style>

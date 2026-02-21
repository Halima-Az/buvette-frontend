<template>
    <div class="login-form-container">
        <!-- Header avec Logo -->
        <div class="form-header">
            <div class="logo-wrapper">
                <img src="/images/sanckuplogo.png" alt="Snack Up" class="logo" />
            </div>
            <h1 class="form-title">Welcome Back</h1>
            <p class="form-subtitle">Sign in to continue to SnackUp</p>
        </div>

        <!-- Messages d'alerte -->
        <transition name="fade">
            <div v-if="changePasswordError" class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <span>{{ changePasswordError }}</span>
            </div>
        </transition>

        <transition name="fade">
            <div v-if="changePassworSucces" class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <span>{{ changePassworSucces }}</span>
            </div>
        </transition>

        <!-- Formulaire -->
        <form @submit.prevent="finalLogin" class="login-form">
            <div class="form-group">
                <label for="email">Email Address</label>
                <div class="input-wrapper">
                    <i class="fas fa-envelope"></i>
                    <input id="email" type="email" class="form-input" v-model="email"
                        placeholder="your.email@example.com" required />
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                    <i class="fas fa-lock"></i>
                    <input id="password" type="password" class="form-input" v-model="password"
                        placeholder="Enter your password" required />
                </div>
            </div>

            <!-- Message d'erreur -->
            <transition name="fade">
                <div v-if="error" class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>{{ error }}</span>
                </div>
            </transition>

            <!-- Bouton Submit -->
            <button type="submit" class="submit-btn">
                <i class="fas fa-sign-in-alt"></i>
                Sign In
            </button>
        </form>

        <!-- Forgot Password -->
        <ForgetPassword @selectEmail="emitForgot" :ChangePasswordError="changePasswordError"
            :ChangePassworSucces="changePassworSucces" />

        <!-- Sign Up Link -->
        <div class="form-footer">
            <p>Don't have an account? <router-link to="/register" class="signup-link">Sign up</router-link></p>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { login } from "@/stores/auth";
import ForgetPassword from "./ForgetPassword.vue";
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref(null);

defineProps({
    changePasswordError: String,
    changePassworSucces: String
})

const emit = defineEmits(["forgot-password"])
const emitForgot = (email) => {
    emit("forgot-password", email)
}
const finalLogin = async () => {
    if (!email.value || !password.value) {
        error.value = "Tous les champs sont obligatoires !";
        return;
    }

    try {
        const res = await axios.post("http://localhost:8088/auth/login", {
            email: email.value,
            password: password.value,
        });
        login(res.data.token, res.data.role, res.data.userId);
        console.log(res.data.role)

        // Redirection selon rôle
        if (res.data.role === "ROLE_WORKER") {

            router.push("/serveur/home");
        } else if (res.data.role === "ROLE_CLIENT") {
            router.push("/home");
        } else if (res.data.role === "ROLE_ADMIN") {
            router.push("/adminhome");
        } else {
            router.push("/"); // fallback
        }

    } catch (err) {
        if (err.response) {

            if (err.response.status === 401) {
                error.value = "Mot de passe incorrect.";
            }

            else if (err.response.status === 403) {
                error.value = "Veuillez vérifier votre email avant de vous connecter.";
            }

            else if (err.response.status === 404) {
                error.value = "Email introuvable.";
            }

            else {
                error.value = "Erreur serveur.";
            }

        } else {
            error.value = "Erreur de connexion au backend.";
        }

    }
}




</script>

<style scoped>
.login-form-container {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
}

/* Header */
.form-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.logo-wrapper {
    margin-bottom: 1.5rem;
}

.logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: #aa7a11 3px solid;
    object-fit: contain;
}

.form-title {
    font-size: 2rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
}

.form-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
    font-weight: 500;
}

/* Alert Messages */
.alert {
    padding: 1rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    animation: slideIn 0.3s ease;
}

.alert i {
    font-size: 1.1rem;
    flex-shrink: 0;
}

.alert-error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
}

.alert-success {
    background: #d1fae5;
    color: #059669;
    border: 1px solid #6ee7b7;
}

/* Form */
.login-form {
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-size: 0.925rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.625rem;
    margin-left: 0.25rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper i {
    position: absolute;
    left: 1.125rem;
    color: #aa7a11;
    font-size: 1rem;
    pointer-events: none;
    z-index: 1;
    transition: all 0.3s ease;
}

.form-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3.25rem;
    border: 2px solid rgba(170, 122, 17, 0.15);
    border-radius: 12px;
    font-size: 0.975rem;
    color: #1f2937;
    background: #fdfaf2;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    font-weight: 500;
}

.form-input::placeholder {
    color: #9ca3af;
    font-size: 0.925rem;
    font-weight: 400;
}

.form-input:focus {
    border-color: #aa7a11;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(170, 122, 17, 0.08);
    transform: translateY(-1px);
}

.form-input:focus~i,
.input-wrapper:focus-within i {
    color: #d4a517;
    transform: scale(1.1);
}

/* Submit Button */
.submit-btn {
    width: 100%;
    padding: 1.125rem 2rem;
    background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(170, 122, 17, 0.3);
    position: relative;
    overflow: hidden;
}

.submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.submit-btn:hover::before {
    left: 100%;
}

.submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.4);
    background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

.submit-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(170, 122, 17, 0.35);
}

.submit-btn i {
    font-size: 1.1rem;
}

/* Form Footer */
.form-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 2px solid #f3f4f6;
}

.form-footer p {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0;
}

.signup-link {
    color: #aa7a11;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    position: relative;
}

.signup-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.signup-link:hover {
    color: #d4a517;
}

.signup-link:hover::after {
    transform: scaleX(1);
}

/* Animations */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
    .form-title {
        font-size: 1.75rem;
    }

    .form-subtitle {
        font-size: 0.925rem;
    }

    .logo {
        width: 70px;
        height: 70px;
    }
}
</style>

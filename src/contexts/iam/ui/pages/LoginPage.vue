<template>
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-blue-50 to-blue-100">
        <div class="w-[560px] rounded-2xl border border-blue-200/50 bg-white/60 backdrop-blur-sm px-14 py-12 shadow-sm">
            <img src="/src/assets/images/logo.png" alt="Nexora Logo" class="mx-auto w-16 h-16 mb-4" />
            <h1 class="text-xl font-semibold text-center">Nexora Admin</h1>
            <p class="text-sm text-neutral-600 text-center mt-1 mb-8">Ingresa a tu panel de administración</p>
            <form class="space-y-5">
                <div class="space-y-2">
                    <label class="text-sm font-medium">Correo electrónico</label>
                    <div class="rounded-full border border-neutral-200 flex items-center gap-2 px-4 py-2 bg-neutral-50">
                        <img src="/src/assets/images/icon-email.png" alt="Lock Icon" class="w-4 h-4 opacity-40" />
                        <input type="email" class="flex-1 bg-transparent outline-none text-sm"
                            placeholder="tu.correo@ejemplo.com" />
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Contraseña</label>
                    <div class="rounded-full border border-neutral-200 flex items-center gap-2 px-4 py-2 bg-neutral-50">
                        <img src="/src/assets/images/icon-password.png" alt="Lock Icon" class="w-4 h-4 opacity-40" />
                        <input type="password" class="flex-1 bg-transparent outline-none text-sm"
                            placeholder="••••••••••" />
                    </div>
                </div>
                <button type="button"
                    class="w-full h-11 rounded-xl bg-linear-to-r from-blue-600 to-blue-300 text-white font-medium mt-4 hover:opacity-90 transition"
                    @click="login">Iniciar sesión</button>
            </form>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function login() {
    // TODO: autenticar
    router.push('/dashboard')
}
</script>

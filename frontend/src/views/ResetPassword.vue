<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Αλλαγή κωδικού
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="submit" class="space-y-6" method="PATCH">
                <ul
                    v-if="errors.length"
                    class="mt-4 bg-red-100 p-2 rounded list-disc list-inside text-red-600 text-sm"
                >
                    <li v-for="error in errors">
                        {{ error.message }}
                    </li>
                </ul>

                <label class="block text-sm font-medium leading-6 text-gray-900">
                    <span>Νέος κωδικός</span>

                    <input
                        v-model="password"
                        id="password"
                        name="password"
                        type="password"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                    />
                </label>

                <label class="block text-sm font-medium leading-6 text-gray-900">
                    <span>Επιβεβαίωση νέου κωδικού</span>

                    <input
                        v-model="passwordConfirm"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                    />
                </label>

                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold
                        leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Αποθήκευση
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import axios from 'axios'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    const redirectPath = ref(route.query.redirect || '/')

    const password = ref('')
    const passwordConfirm = ref('')
    let errors = ref([])

    const submit = async event => {
        try {
            const response = await axios.patch(
                `https://localhost:3000/api/v1/users/resetPassword/${route.params.token}`,
                {
                    password: password.value,
                    passwordConfirm: passwordConfirm.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                    }
                }
            )

            localStorage.setItem('user', JSON.stringify(response.data.data.user))
            localStorage.setItem('token', response.data.token)

            router.push(redirectPath.value)
        } catch (err) {
            errors.value = Object.values(err.response.data.error.errors)
            window.scrollTo(0, 0)
        }
    }
</script>
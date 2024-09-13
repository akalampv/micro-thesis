<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Συνδεθείτε στο λογαριασμό σας
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="mb-6 bg-red-100 p-2 rounded text-red-600 text-sm" v-if="error">
                {{ error }}
            </div>

            <div class="mt-6 bg-green-100 rounded p-2 text-green-600 text-sm" v-if="success">
                {{ success }}
            </div>

            <form @submit.prevent="submit" class="space-y-6" method="POST">
                <label class="block text-sm font-medium leading-6 text-gray-900">
                    <span>Email</span>

                    <input
                        v-model="email"
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                    />
                </label>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
                            Κωδικός
                        </label>

                        <button
                            type="button"
                            @click="forgotPassword"
                            class="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Ξεχάσατε τον κωδικό σας;
                        </button>
                    </div>
                    <div class="mt-2">
                        <input
                            v-model="password"
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold
                        leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Είσοδος
                </button>

                <div class="text-sm">
                    <span>Δεν είστε μέλος;</span>
                    <router-link
                    :to="{ name: 'Signup' }"
                    class="text-indigo-600 hover:text-indigo-500 font-semibold"
                >
                    Μεταβείτε στη σελίδα εγγραφής
                </router-link>
                </div>
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

    const email = ref('')
    const password = ref('')
    const error = ref('')
    const success = ref('')

    const forgotPassword = async () => {
        error.value = ''

        try {
            await axios.post('https://localhost:3000/forgotPassword', {
                email: email.value
            })

            success.value = 'Ένα email στάλθηκε στο email σας με οδηγίες για την αλλαγή του κωδικού σας.'

            setTimeout(() => {
                success.value = ''
            }, 2000);
        } catch (err) {
            error.value = err.response.data.message
            window.scrollTo(0, 0)
        }
    }

    const submit = async event => {
        error.value = ''

        try {
            const response = await axios.post('https://localhost:3000/login', {
                email: email.value,
                password: password.value
            })

            localStorage.setItem('user', JSON.stringify(response.data.data.user))
            localStorage.setItem('token', response.data.token)

            router.push(redirectPath.value)
        } catch (err) {
            error.value = err.response.data.message
            window.scrollTo(0, 0)
        }
    }
</script>
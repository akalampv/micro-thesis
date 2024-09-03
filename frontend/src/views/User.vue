<template>
    <form @submit.prevent="submit" class="px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl py-20">
        <ul
            v-if="errors.length"
            class="bg-red-100 rounded text-red-600 p-2 mb-8 list-disc list-inside text-sm"
        >
            <li v-for="error in errors">
                {{ error.message }}
            </li>
        </ul>

        <div
            v-if="success"
            class="bg-green-100 rounded text-green-600 p-2 mb-8 text-sm"
        >
            {{ success }}
        </div>

        <!-- Personal information -->
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <h2 class="text-base font-semibold leading-7 text-gray-900 sm:col-span-6">
                Προσωπικές πληροφορίες
            </h2>

            <!-- Service -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Επιλέξτε την υπηρεσία στην οποία ανήκετε:</span>

                <select
                    name="service"
                    v-model="user.service._id"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                >
                    <option
                        v-for="service in services"

                        :value="service._id"
                    >
                        {{ service.name }}
                    </option>
                </select>
            </label>

            <!-- Name -->
            <label
                v-if="user.role !== 'employee'"
                class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Όνομα:</span>

                <input
                    type="text"
                    name="name"
                    v-model="user.name"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- First name -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Όνομα</span>

                <input
                    type="text"
                    name="firstName"
                    v-model="user.firstName"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Last name -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Επώνυμο</span>

                <input
                    type="text"
                    name="lastName"
                    v-model="user.lastName"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Father's name -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Όνομα και Επώνυμο Πατέρα:</span>

                <input
                    type="text"
                    name="fatherName"
                    v-model="user.fatherName"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Mother's name -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Όνομα και Επώνυμο Μητέρας:</span>

                <input
                    type="text"
                    name="motherName"
                    v-model="user.motherName"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Date of birth -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Ημερομηνία γέννησης:</span>

                <input
                    type="text"
                    name="dateOfBirth"
                    :value="(new Date(user?.dateOfBirth)).toLocaleDateString('en')"
                    @input="event => user.dateOfBirth = event.target.value"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Place of birth -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Τόπος Γέννησης:</span>

                <input
                    type="text"
                    name="placeOfBirth"
                    v-model="user.placeOfBirth"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- ID Number -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Αριθμός Δελτίου Ταυτότητας:</span>

                <input
                    type="text"
                    name="idNumber"
                    v-model="user.idNumber"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- VAT Number -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Α.Φ.Μ.:</span>

                <input
                    type="text"
                    name="vatNumber"
                    v-model="user.vatNumber"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- City -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Τόπος Κατοικίας:</span>

                <input
                    type="text"
                    name="city"
                    v-model="user.address.city"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Address -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>Διεύθνυση:</span>

                <input
                    type="text"
                    name="address"
                    v-model="user.address.address"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Postal code -->
            <label
                v-if="user.role === 'employee'"
                class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900"
            >
                <span>ΤΚ:</span>

                <input
                    type="text"
                    name="postalCode"
                    v-model="user.address.postalCode"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Email -->
            <label class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900">
                <span>Δ/νση Ηλεκτρ. Ταχυδρομείου (Εmail):</span>

                <input
                    type="text"
                    name="email"
                    v-model="user.email"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>

            <!-- Phone -->
            <label class="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900">
                <span>Τηλέφωνο:</span>

                <input
                    type="text"
                    name="phone"
                    v-model="user.phone"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                />
            </label>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <router-link
                :to="{ name: 'Home' }"
                class="text-sm font-semibold leading-6 text-gray-900"
            >
                Ακύρωση
            </router-link>

            <button
                type="submit"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
                    hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Αποθήκευση
            </button>
        </div>
    </form>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const errors = ref([])
    const success = ref(null)

    const services = ref([])

    const user = ref(JSON.parse(localStorage.getItem('user')))

    onMounted(async () => {
        const response = await axios.get('https://localhost:3000/api/v1/users/services')

        services.value = response.data.data.services
    })

    const submit = async () => {
        success.value = null
        errors.value = []

        try {
            const response = await axios.patch(
                'https://localhost:3000/api/v1/users/updateMe',
                user.value,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                    }
                }
            )

            localStorage.setItem('user', JSON.stringify(response.data.data.user))

            success.value = 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς!'
            window.scrollTo(0, 0)

            setTimeout(() => {
                success.value = null
            }, 1000);
        } catch (err) {
            if (err.response.status === 401) {
                router.push({ name: 'Login' })
            }

            errors.value = Object.values(err.response.data.error.errors)
            window.scrollTo(0, 0)
        }

    }
</script>
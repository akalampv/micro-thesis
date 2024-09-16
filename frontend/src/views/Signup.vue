<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Δημιουργία λογαριασμού
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
            <ul class="mb-8 bg-red-100 p-2 rounded text-red-600 text-sm list-disc list-inside" v-if="errors.length">
                <li v-for="error in errors">
                    {{ error.message }}
                </li>
            </ul>

            <form @submit.prevent="submit" class="space-y-6" method="POST">
                <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <!-- Role -->
                    <fieldset
                        class="sm:col-span-6 text-sm font-medium leading-6 text-gray-900 space-y-2
                            flex justify-between"
                    >
                        <legend class="font-bold">Επιλέξτε ρόλο:</legend>

                        <label class="flex items-center gap-2">
                            <input
                                type="radio"
                                name="role"
                                v-model="user.role"
                                value="employee"
                            />

                            <span>Υπάλληλος</span>
                        </label>

                        <label class="flex items-center gap-2">
                            <input
                                type="radio"
                                name="role"
                                v-model="user.role"
                                value="publicService"
                            />

                            <span>Υπηρεσία</span>
                        </label>

                        <label class="flex items-center gap-2">
                            <input
                                type="radio"
                                name="role"
                                v-model="user.role"
                                value="auditService"
                            />

                            <span>Ελεγκτική αρχή</span>
                        </label>
                    </fieldset>

                    <!-- Service -->
                    <label
                        v-if="user.role === 'employee'"
                        class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900"
                    >
                        <span>Επιλέξτε την υπηρεσία στην οποία ανήκετε:</span>

                        <select
                            name="service"
                            v-model="user.service"
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

                        <!-- :value="(new Date(user?.dateOfBirth)).toLocaleDateString('en')" -->

                        <input
                            type="text"
                            name="dateOfBirth"
                            v-model="user.dateOfBirth"
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

                    <!-- Password -->
                    <label class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900">
                        <span>Κωδικός:</span>

                        <input
                            type="text"
                            name="password"
                            v-model="user.password"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                        />
                    </label>

                    <!-- Password confirm -->
                    <label class="sm:col-span-6 block text-sm font-medium leading-6 text-gray-900">
                        <span>Επιβεβαίωση κωδικού:</span>

                        <input
                            type="text"
                            name="passwordConfirm"
                            v-model="user.passwordConfirm"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold
                        leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Εγγραφή
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
    import axios from 'axios'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    const redirectPath = ref(route.query.redirect || '/')

    const services = ref([])

    const user = ref({
        role: 'employee',
        service: null,
        name: null,
        firstName: null,
        lastName: null,
        fatherName: null,
        motherName: null,
        dateOfBirth: null,
        placeOfBirth: null,
        address: {
            city: null,
            address: null,
            postalCode: null
        },
        idNumber: null,
        vatNumber: null,
        phone: null,
        email: null,
        password: null,
        passwordConfirm: null
    })

    let errors = ref([])

    onMounted(async () => {
        const response = await axios.get('https://localhost:3000/users?role=publicService', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
            }
        })

        services.value = response.data.data.users
    })

    const submit = async () => {
        try {
            const response = await axios.post('https://localhost:3000/signup', user.value)

            localStorage.setItem('user', JSON.stringify(response.data.data.user))
            localStorage.setItem('token', response.data.token)

            router.push(redirectPath.value)
        } catch (err) {
            errors.value = Object.values(err.response.data.error.errors)
            window.scrollTo(0, 0)
        }
    }
</script>
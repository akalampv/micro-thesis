<template>
    <div class="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl mt-20">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-bold leading-6 text-gray-900">
                    Δηλώσεις
                </h1>

                <p class="mt-2 text-sm text-gray-700">
                    Μια λίστα με όλες τις υποβληθείσες δηλώσεις.
                </p>
            </div>

            <div v-if="canCreateForm" class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <router-link
                    :to="{ name: 'Form' }"
                    class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm
                        font-semibold text-white shadow-sm hover:bg-indigo-500
                        focus-visible:outline focus-visible:outline-2 disabled:opacity-50
                        focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Νέα δήλωση
                </router-link>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="mt-8">
            <div class="relative text-gray-400 focus-within:text-gray-600 mb-8" v-if="user.role !== 'employee'">
                <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <MagnifyingGlassIcon class="h-5 w-5" />
                </div>

                <input
                    type="text"
                    placeholder="Αναζήτηση με βάση το Χρήστη ή την Υπηρεσία"
                    :value="query.search"
                    @input="updateSearch($event.target.value)"
                    @keydown.esc.prevent.stop="$event.target.blur()"
                    class="block w-full text-gray-600 shadow-sm text-sm border-gray-300 rounded-md
                        focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                />
            </div>

            <div class="flex flex-wrap gap-4">
                <div v-for="(filterOptions, name) in filters" class="min-w-[209px]">
                    <multiselect
                        :modelValue="Number(query[name]) || query[name]"
                        @update:modelValue="updateFilter(name, $event)"
                        :options="filterOptions.options"
                        :placeholder="filterOptions.title"
                        :showLabels="false"
                        :showNoResults="false"
                        :showPointer="true"
                    />
                </div>
            </div>
        </div>

        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table class="min-w-full" aria-label="Form submissions">
                        <thead class="bg-white">
                            <tr>
                                <th
                                    v-if="user.role !== 'employee'"
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    <button
                                        @click="updateSort('userName')"
                                        class="inline-flex items-center"
                                        :class="{
                                            'text-indigo-600': sortName !== 'userName',
                                            'text-indigo-700 font-bold': sortName == 'userName'
                                        }"
                                    >
                                        <span>Χρήστης</span>
                                        <ChevronDownIcon
                                            class="w-4 h-4 ml-1"
                                            :class="{
                                                'transform rotate-180': (
                                                    sortDirection == 'asc' && sortName == 'userName'
                                                )
                                            }"
                                        />
                                    </button>
                                </th>
                                <th
                                    v-if="user.role === 'auditService'"
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    <button
                                        @click="updateSort('serviceName')"
                                        class="inline-flex items-center"
                                        :class="{
                                            'text-indigo-600': sortName !== 'serviceName',
                                            'text-indigo-700 font-bold': sortName == 'serviceName'
                                        }"
                                    >
                                        <span>Υπηρεσία</span>
                                        <ChevronDownIcon
                                            class="w-4 h-4 ml-1"
                                            :class="{
                                                'transform rotate-180': (
                                                    sortDirection == 'asc' && sortName == 'serviceName'
                                                )
                                            }"
                                        />
                                    </button>
                                </th>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    <button
                                        @click="updateSort('year')"
                                        class="inline-flex items-center"
                                        :class="{
                                            'text-indigo-600': sortName !== 'year',
                                            'text-indigo-700 font-bold': sortName == 'year'
                                        }"
                                    >
                                        <span>Έτος</span>
                                        <ChevronDownIcon
                                            class="w-4 h-4 ml-1"
                                            :class="{
                                                'transform rotate-180': (
                                                    sortDirection == 'asc' && sortName == 'year'
                                                )
                                            }"
                                        />
                                    </button>
                                </th>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    <button
                                        @click="updateSort('semester')"
                                        class="inline-flex items-center"
                                        :class="{
                                            'text-indigo-600': sortName !== 'semester',
                                            'text-indigo-700 font-bold': sortName == 'semester'
                                        }"
                                    >
                                        <span>Εξάμηνο</span>
                                        <ChevronDownIcon
                                            class="w-4 h-4 ml-1"
                                            :class="{
                                                'transform rotate-180': (
                                                    sortDirection == 'asc' && sortName == 'semester'
                                                )
                                            }"
                                        />
                                    </button>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    <button
                                        @click="updateSort('createdAt')"
                                        class="inline-flex items-center"
                                        :class="{
                                            'text-indigo-600': sortName !== 'createdAt',
                                            'text-indigo-700 font-bold': sortName == 'createdAt'
                                        }"
                                    >
                                        <span>Ημερομηνία υποβολής</span>
                                        <ChevronDownIcon
                                            class="w-4 h-4 ml-1"
                                            :class="{
                                                'transform rotate-180': (
                                                    sortDirection == 'asc' && sortName == 'createdAt'
                                                )
                                            }"
                                        />
                                    </button>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Είδος
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Κατάσταση
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                    <span class="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody class="bg-white">
                            <template v-for="(form, index) in forms" :key="form._id">
                                <tr :class="[index === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t']">
                                    <td v-if="user.role !== 'employee'" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                        {{ form.userName }}
                                    </td>

                                    <td v-if="user.role === 'auditService'" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                        {{ form.serviceName }}
                                    </td>

                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                        {{ form.year }}
                                    </td>

                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                        {{ form.semester }}
                                    </td>

                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ (new Date(form.createdAt)).toLocaleString('en') }}
                                    </td>

                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ form.parent ? 'Τροποποιητική' : 'Αρχική' }}
                                    </td>

                                    <td class="px-3 py-4">
                                        <div
                                        class="w-2 h-2 rounded-full"
                                        :title="form.status"
                                        :class="{
                                            'bg-green-500': form.status === 'completed',
                                            'bg-blue-500': form.status === 'approved',
                                            'bg-red-500': form.status === 'rejected',
                                            'bg-yellow-500': form.status === 'pending',
                                        }"
                                        ></div>
                                    </td>

                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm
                                        font-medium sm:pr-3 space-y-2"
                                    >
                                        <div>
                                            <router-link
                                                :to="{ name: 'Form', params: {id: form._id} }"
                                                class="text-indigo-500"
                                            >
                                                {{
                                                    form.status === 'completed' || user.role !== 'employee' ? (
                                                        'Προβολή'
                                                    ) : 'Επεξεργασία'
                                                }}
                                            </router-link>
                                        </div>
                                        <div v-if="form.status === 'completed' && user.role === 'employee' && !form.hasChildren">
                                            <router-link
                                                :to="{ name: 'FormRevision', params: {id: form._id} }"
                                                class="text-indigo-500"
                                            >
                                                Τροποποίηση
                                            </router-link>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Pagination
            :page="query.page * 1 || 1"
            :limit="query.limit * 1 || 10"
            :total="total"
            @update:page="updatePage($event)"
        />
    </div>
</template>

<script setup>
    import { onMounted, reactive, ref, watch, computed } from 'vue'
    import axios from 'axios'
    import { useRouter } from 'vue-router'
    import Pagination from './Components/Pagination.vue'
    import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
    import Multiselect from 'vue-multiselect'
    import { debounce } from 'lodash'

    const router = useRouter()
    const query = reactive({...router.currentRoute.value.query})

    const forms = ref([])
    const user = JSON.parse(localStorage.getItem('user'))
    const filters = ref({})
    const total = ref(0)
    const canCreateForm = ref(false)

    const sortName = computed({
        get() {
            return query.sort?.split(':').shift() ?? 'createdAt'
        },
        set(newValue) {
            query.sort = `${newValue}:${sortDirection.value}`
        }
    })

    const sortDirection = computed({
        get() {
            return query.sort?.split(':').pop() ?? 'desc'
        },
        set(newValue) {
            query.sort = `${sortName.value}:${newValue}`
        }
    })

    const fetchForms = async () => {
        try {
            const queryParams = new URLSearchParams(query)

            const response = await axios.get(`https://localhost:3000/api/v1/forms?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                }
            });

            forms.value = response.data.data.forms
            total.value = response.data.data.total
            filters.value = response.data.data.filters
            canCreateForm.value = response.data.data.canCreateForm

            router.push({ query })
        } catch (err) {
            if (err.response.status === 401) {
                router.push({ name: 'Login' })
            }
            console.log(err, err.response)
        }
    }

    const updateSort = name => {
        if (sortName.value === name) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortName.value = name
            sortDirection.value = 'asc'
        }

        fetchForms()
    }

    const updatePage = (page) => {
        query.page = page

        fetchForms()
    }

    const updateFilter = (name, value) => {
        if (value) {
            query[name] = value
        } else {
            delete query[name]
        }

        delete query.page

        fetchForms()
    }

    const updateSearch = debounce((value) => {
        if (value) {
            query.search = value
        } else {
            delete query.search
        }

        delete query.page

        fetchForms()
    }, 200)

    onMounted(fetchForms)
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
    .multiselect__input,
    .multiselect__input:focus {
        font-size: 14px !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .multiselect__option,
    .multiselect__single {
        font-size: 14px !important;
    }
</style>
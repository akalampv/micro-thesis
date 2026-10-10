<template>
    <form @submit.prevent="submit" class="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-20" v-if="!loading">
        <ul
            v-if="errors.length"
            class="bg-red-100 rounded text-red-600 p-2 mb-8 list-disc list-inside text-sm"
        >
            <li v-for="error in errors">
                {{ error }}
            </li>
        </ul>

        <div
            v-if="success"
            class="bg-green-100 rounded text-green-600 p-2 mb-8 text-sm"
        >
            {{ success }}
        </div>

        <div class="space-y-12">
            <!-- User -->
            <div class="border-b border-gray-900/10 pb-12 flex justify-between">
                <div class="flex items-center gap-2">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Χρήστης:</h2>
                    <router-link
                        :to="{ name: 'User' }"
                        class="text-indigo-600 hover:text-indigo-500"
                    >
                        {{ userName }}
                    </router-link>
                </div>

                <div v-if="form.parent || form.child" class="space-y-2">
                    <router-link
                        v-if="form.parent"
                        :to="{
                            name: 'Form',
                            params: { id: form.parent }
                        }"
                        class="text-indigo-600 hover:text-indigo-500 block"
                    >
                        Προβολή αρχικής δήλωσης
                    </router-link>
                    <router-link
                        v-if="form.child"
                        :to="{
                            name: 'Form',
                            params: { id: form.child._id }
                        }"
                        class="text-indigo-600 hover:text-indigo-500 block"
                    >
                        Προβολή τροποποιητικής δήλωσης
                    </router-link>
                </div>
            </div>

            <!-- Main income -->
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">
                    Αποδοχές κύριας απασχόλησης
                </h2>

                <!-- Income -->
                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border rounded-lg p-4">
                    <!-- Role -->
                    <label class="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                        <span>Ιδιότητα</span>

                        <input
                            type="text"
                            :disabled="!editable"
                            v-model="form.mainIncome.role"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                        />
                    </label>

                    <!-- Carrier -->
                    <label class="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                        <span>Φορέας</span>

                        <input
                            type="text"
                            :disabled="!editable"
                            v-model="form.mainIncome.carrier"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                        />
                    </label>

                    <!-- Carrier code -->
                    <label class="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                        <span>Κωδικός Φορέας</span>

                        <input
                            type="text"
                            :disabled="!editable"
                            v-model="form.mainIncome.carrierCode"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                        />
                    </label>

                    <!-- Income -->
                    <div
                        class="sm:col-span-6 justify-between gap-2 overflow-x-auto
                            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
                    >
                        <div v-for="month in form?.mainIncome?.income.keys() ?? []">
                            <div class="font-bold text-lg">
                                {{ getMonthName(parseInt(month) + parseInt((form?.semester - 1) * 6)) }}
                            </div>

                            <label class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                <span>Ακαθάριστες:</span>

                                <input
                                    type="text"
                                    :disabled="!editable"
                                    :name="`main-income-gross[${month}]`"
                                    v-model="form.mainIncome.income[month].gross"
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </label>

                            <label class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                <span>Καθαρές:</span>

                                <input
                                    type="text"
                                    :disabled="!editable"
                                    :name="`main-income-gross[${month}]`"
                                    v-model="form.mainIncome.income[month].net"
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                        focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </label>
                        </div>

                        <!-- Files -->
                        <div class="mt-10 border rounded-lg p-4 col-span-full">
                            <h2 class="text-sm font-semibold leading-7 text-gray-900">
                                Μεταφόρτωση αρχείων
                            </h2>
                            <p class="mt-2 text-sm text-gray-700">
                                Παρακαλώ επισυνάψτε τις βεβαιώσεις αποδοχών για κάθε μήνα του εξαμήνου σε μορφή PDF.
                            </p>

                            <div
                                v-for="month, index in form?.mainIncome?.income ?? []"
                                class="mt-4 flex items-center gap-4 pt-8 border-t"
                            >
                                <div class="text-xs text-gray-900 font-semibold basis-[200px]">
                                    {{ getMonthName(parseInt(index) + parseInt((form?.semester - 1) * 6)) }}
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        class="hidden peer"
                                        :id="`mainIncomeFile-${index}`"
                                        :name="`mainIncomeFile-${index}`"
                                        :disabled="uploading"
                                        @change="uploadFile(month, $event.target.files[0] ?? null)"
                                    >

                                    <label
                                        class="flex items-center justify-start gap-4 group
                                            peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                                        :for="`mainIncomeFile-${index}`"
                                    >
                                        <div class="px-3 py-2 border hover:border-indigo-500 rounded
                                            hover:text-white hover:bg-indigo-500 text-sm cursor-pointer"
                                        >
                                            Επιλογή αρχείου
                                        </div>
                                    </label>
                                </div>

                                <div v-if="month.file">
                                    <button
                                        type="button"
                                        @click="downloadFile(month.file)"
                                    >
                                        {{ month.file.name }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Extra income -->
            <div class="border-b border-gray-900/10 pb-12">
                <div class="flex gap-4 justify-between items-center">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">
                        Αποδοχές δευτερεύσουσας απασχόλησης
                    </h2>
                    <button
                        v-if="editable"
                        type="button"
                        class="text-white rounded-full w-6 h-6 bg-indigo-600 flex justify-center items-center"
                        @click="addExtraIncome"
                    >+</button>
                </div>

                <div class="space-y-10 mt-10">
                    <div
                        v-for="index in form.extraIncome.keys() ?? []"
                        class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border p-4 rounded-lg"
                    >
                        <div v-if="editable" class="sm:col-span-6 text-right">
                            <button
                                type="button"
                                class="w-6 h-6 inline-flex justify-center items-center text-white bg-red-600 rounded-full"
                                @click="removeExtraIncome(index)"
                            >-</button>
                        </div>

                        <!-- Role -->
                        <label class="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                            <span>Ιδιότητα</span>

                            <input
                                type="text"
                                :disabled="!editable"
                                name="role"
                                v-model="form.extraIncome[index].role"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                    ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                    focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                            />
                        </label>

                        <!-- Carrier -->
                        <label class="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                            <span>Φορέας</span>

                            <input
                                type="text"
                                :disabled="!editable"
                                name="carrier"
                                v-model="form.extraIncome[index].carrier"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                    ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                    focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                            />
                        </label>

                        <!-- Carrier code -->
                        <label class="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                            <span>Κωδικός Φορέας</span>

                            <input
                                type="text"
                                :disabled="!editable"
                                name="carrier"
                                v-model="form.extraIncome[index].carrierCode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                    ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                    focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                            />
                        </label>

                        <!-- Income -->
                        <div
                            class="sm:col-span-6 justify-between gap-2 overflow-x-auto
                                grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
                        >
                            <div v-for="month in form.extraIncome[index].income.keys() ?? []">
                                <div class="font-bold text-lg">
                                    {{ getMonthName(parseInt(month) + parseInt((form?.semester - 1) * 6)) }}
                                </div>

                                <label class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    <span>Ακαθάριστες:</span>

                                    <input
                                        type="text"
                                        :disabled="!editable"
                                        :name="`extra-income-gross[${index}][${month}]`"
                                        v-model="form.extraIncome[index].income[month].gross"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                            ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                            focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </label>

                                <label class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    <span>Καθαρές:</span>

                                    <input
                                        type="text"
                                        :disabled="!editable"
                                        :name="`main-income-gross[${index}][${month}]`"
                                        v-model="form.extraIncome[index].income[month].net"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                            ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                                            focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </label>
                            </div>

                            <!-- Files -->
                            <div class="mt-10 border rounded-lg p-4 col-span-full">
                                <h2 class="text-sm font-semibold leading-7 text-gray-900">
                                    Μεταφόρτωση αρχείων
                                </h2>
                                <p class="mt-2 text-sm text-gray-700">
                                    Παρακαλώ επισυνάψτε τη σύμβαση εργασίας και τις βεβαιώσεις αποδοχών για κάθε μήνα του εξαμήνου σε μορφή PDF.
                                </p>

                                <div class="mt-4 flex items-center gap-4 pt-8 border-t">
                                    <div class="text-xs text-gray-900 font-semibold basis-[200px]">
                                        Σύμβαση εργασίας
                                    </div>

                                    <div>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            class="hidden peer"
                                            :id="`extraIncomeFile-${index}`"
                                            :name="`extraIncomeFile-${index}`"
                                            :disabled="uploading"
                                            @change="uploadFile(form.extraIncome[index], $event.target.files[0] ?? null)"
                                        >

                                        <label
                                            class="flex items-center justify-start gap-4 group
                                                peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                                            :for="`extraIncomeFile-${index}`"
                                        >
                                            <div class="px-3 py-2 border hover:border-indigo-500 rounded
                                                hover:text-white hover:bg-indigo-500 text-sm cursor-pointer"
                                            >
                                                Επιλογή αρχείου
                                            </div>
                                        </label>
                                    </div>

                                    <div v-if="form.extraIncome[index].file">
                                        <button
                                            type="button"
                                            @click="downloadFile(form.extraIncome[index].file)"
                                        >
                                            {{ form.extraIncome[index].file.name }}
                                        </button>
                                    </div>
                                </div>

                                <div
                                    v-for="month, monthIndex in form.extraIncome[index].income ?? []"
                                    class="mt-4 flex items-center gap-4 pt-8 border-t"
                                >
                                    <div class="text-xs text-gray-900 font-semibold basis-[200px]">
                                        {{ getMonthName(parseInt(monthIndex) + parseInt((form?.semester - 1) * 6)) }}
                                    </div>

                                    <div>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            class="hidden peer"
                                            :id="`extraIncomeFile-${index}-${monthIndex}`"
                                            :name="`extraIncomeFile-${index}-${monthIndex}`"
                                            :disabled="uploading"
                                            @change="uploadFile(month, $event.target.files[0] ?? null)"
                                        >

                                        <label
                                            class="flex items-center justify-start gap-4 group
                                                peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                                            :for="`extraIncomeFile-${index}-${monthIndex}`"
                                        >
                                            <div class="px-3 py-2 border hover:border-indigo-500 rounded
                                                hover:text-white hover:bg-indigo-500 text-sm cursor-pointer"
                                            >
                                                Επιλογή αρχείου
                                            </div>
                                        </label>
                                    </div>

                                    <div v-if="month.file">
                                        <button
                                            type="button"
                                            @click="downloadFile(month.file)"
                                        >
                                            {{ month.file.name }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div
                :class="{
                    'border-b border-gray-900/10 pb-12': editable,
                }"
                v-for="type in ['gross', 'net']"
            >
                <h2 class="text-base font-semibold leading-7 text-gray-900">
                    Σύνοψη {{ type === 'gross' ? 'ακαθάριστων' : 'καθαρών' }} αποδοχών
                </h2>

                <div class="mt-10 flex gap-4 border rounded-lg p-4">
                    <!-- Income -->
                    <div
                        class="sm:col-span-6 justify-between gap-2 overflow-x-auto
                            grid grid-cols-[repeat(6,minmax(max-content,1fr))] grow"
                    >
                        <div v-for="month in form?.mainIncome?.income.keys() ?? []">
                            <div class="font-bold text-lg">
                                {{ getMonthName(parseInt(month) + parseInt((form?.semester - 1) * 6)) }}
                            </div>

                            <div class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                <span class="underline">Κύρια:</span>

                                <div class="rounded-md border-0 py-1.5 text-gray-900 sm:text-sm sm:leading-6 font-bold">
                                    {{ summary.perMonth.mainIncome[month]?.[type] ?? 0 }} €
                                </div>
                            </div>

                            <div class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                <span class="underline">Δευτερεύουσα:</span>

                                <div class="rounded-md border-0 py-1.5 text-gray-900 sm:text-sm sm:leading-6 font-bold">
                                    {{ summary.perMonth.extraIncome[month]?.[type] ?? 0 }} €
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-l pl-4 border-gray-900">
                        <div class="font-bold text-lg">Σύνολο</div>

                        <div class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                            <span class="underline">Κύρια:</span>

                            <div class="rounded-md border-0 py-1.5 text-gray-900 sm:text-sm sm:leading-6 font-bold">
                                {{ summary.total.mainIncome[type] }} €
                            </div>
                        </div>

                        <div class="block text-sm font-medium leading-6 text-gray-900 mt-2">
                            <span class="underline">Δευτερεύουσα:</span>

                            <div class="rounded-md border-0 py-1.5 text-gray-900 sm:text-sm sm:leading-6 font-bold">
                                {{ summary.total.extraIncome[type] }} €
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Submit -->
        <div v-if="editable" class="mt-6 flex items-center justify-end gap-x-6">
            <router-link
                :to="{ name: 'Home' }"
                class="text-sm font-semibold leading-6 text-gray-900"
            >
                Ακύρωση
            </router-link>

            <button
                type="submit"
                :disabled="uploading"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
                    hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                    disabled:cursor-not-allowed disabled:opacity-50"
            >
                Αποθήκευση
            </button>
        </div>

        <!-- Approve/Reject -->
        <div v-if="canChangeStatus" class="pt-12 mt-12 border-t">
            <div>
                <label for="comment" class="block text-sm font-medium leading-6 text-gray-900">
                    Προσθέστε σχόλιο
                </label>

                <div class="mt-2">
                    <textarea
                        rows="4"
                        name="comment"
                        id="comment"
                        v-model="form.comment"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                    />
                </div>
            </div>

            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    @click="changeStatus('rejected')"
                    class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
                        hover:bg-red-500 focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    Απόρριψη
                </button>

                <button
                    type="button"
                    @click="changeStatus(currentUser.role === 'publicService' ? 'approved' : 'completed')"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Αποδοχή
                </button>
            </div>

        </div>
    </form>
</template>

<script setup>
    import { onMounted, ref, computed, watch } from 'vue'
    import axios from 'axios'
    import { useRouter } from 'vue-router'

    const greekMonths = [
        'Ιανουάριος',
        'Φεβρουάριος',
        'Μάρτιος',
        'Απρίλιος',
        'Μάιος',
        'Ιούνιος',
        'Ιούλιος',
        'Αύγουστος',
        'Σεπτέμβριος',
        'Οκτώβριος',
        'Νοέμβριος',
        'Δεκέμβριος'
    ]

    const router = useRouter()
    const route = router.currentRoute.value.name

    const props = defineProps({
        id: String,
    })

    const form = ref(null)
    const userName = ref(null)
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const errors = ref([])
    const success = ref(null)
    const uploading = ref(false)

    const editable = computed(() => {
        return currentUser.role === 'employee' && (
            form.value.status !== 'completed' || route === 'FormRevision'
        )
    })

    const canChangeStatus = computed(() => {
        return (
            currentUser.role === 'publicService' && form.value.status === 'pending'
        ) || (
            currentUser.role === 'auditService' && form.value.status === 'approved'
        )
    })

    const summary = computed(() => {
        const mainIncome = form.value.mainIncome?.income?.map(income => {
            return {
                gross: Number(income.gross),
                net: Number(income.net)
            }
        })

        const extraIncome = form.value.extraIncome?.reduce((acc, extraIncome) => {
            extraIncome.income.forEach((income, index) => {
                acc[index] = acc[index] ?? {gross: 0, net: 0}
                acc[index].gross += Number(income.gross)
                acc[index].net += Number(income.net)
            })

            return acc
        }, [])

        return {
            perMonth: {
                mainIncome,
                extraIncome
            },
            total: {
                mainIncome: mainIncome.reduce((acc, income) => {
                    acc.gross += income.gross
                    acc.net += income.net
                    return acc
                }, {gross: 0, net: 0}),
                extraIncome: extraIncome.reduce((acc, income) => {
                    acc.gross += income.gross
                    acc.net += income.net
                    return acc
                }, {gross: 0, net: 0})
            }
        }
    })

    const loading = ref(true)

    const getMonthName = (monthNumber) => {
        return greekMonths[monthNumber]
    }

    const createRevision = async () => {
        if (!form.value._id || form.value.child) {
            return
        }

        const parent = form.value._id
        const { _id, __v, createdAt, updatedAt, ...revision } = form.value
        revision.parent = parent
        revision.status = 'pending'

        makeRequest(async () => {
            return await axios.request({
                method: 'post',
                url: 'http://localhost:3000/forms',
                data: revision,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                }
            })
        })
    }

    const changeStatus = async status => {
        form.value.status = status

        makeRequest(async () => {
            return await axios.request({
                method: 'patch',
                url: `http://localhost:3000/forms/${props.id}`,
                data: {
                    status,
                    comment: form.value.comment
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                }
            })
        })
    }

    const submit = async () => {
        if (!editable) {
            return
        }

        if (route === 'FormRevision') {
            return createRevision()
        }

        makeRequest(async () => {
            return await axios.request({
                method: props.id ? 'patch' : 'post',
                url: ['http://localhost:3000/forms', props.id].join('/'),
                data: form.value,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                }
            })
        })
    }

    const makeRequest = async (callback) => {
        success.value = null
        errors.value = []
        try {
            const response = await callback()

            success.value = 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς!'
            window.scrollTo(0, 0)

            setTimeout(() => {
                success.value = null

                router.push({
                    name: 'Form',
                    params: {id: response.data.data.form._id}
                })
            }, 1000);
        } catch (err) {
            if (err.response.status === 401) {
                router.push({ name: 'Login' })
            }

            errors.value = [...new Set(
                Object.values(err.response.data.error.errors)
                    .map(error => error.message)
            )]
            window.scrollTo(0, 0)
        }
    }

    const removeExtraIncome = (index) => {
        form.value.extraIncome.splice(index, 1)
    }

    const addExtraIncome = () => {
        form.value.extraIncome.push({
            role: null,
            carrier: null,
            carrierCode: null,
            income: [
                { gross: null, net: null, file: null },
                { gross: null, net: null, file: null },
                { gross: null, net: null, file: null },
                { gross: null, net: null, file: null },
                { gross: null, net: null, file: null },
                { gross: null, net: null, file: null },
            ],
            file: null
        })
    }

    const uploadFile = async (obj, file) => {
        if (!file) {
            return
        }

        uploading.value = true

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await axios.request({
                method: 'post',
                url: 'http://localhost:3000/forms/upload',
                data: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            const uploadedFile = response.data.data.file

            obj.file = {
                name: uploadedFile.originalname,
                uri: uploadedFile.path
            }
        } finally {
            uploading.value = false
        }
    }

    const downloadFile = async file => {
        const response = await axios.request({
            method: 'post',
            url: 'http://localhost:3000/forms/download',
            responseType: 'arraybuffer',
            data: file,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
            }
        })

        const blob = new Blob([response.data], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);

        const pdfWindow = window.open(url);

        const interval = setInterval(() => {
            if (pdfWindow.closed) {
                clearInterval(interval)
                window.URL.revokeObjectURL(url)
            }
        }, 500);
    }

    onMounted(async () => {
        try {
            if (props.id) {
                const response = await axios.get(`http://localhost:3000/forms/${props.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
                    }
                });

                form.value = response.data.data.form
                userName.value = form.value.userName
            } else {
                userName.value = `${currentUser.firstName} ${currentUser.lastName}`
                form.value = {
                    user: currentUser._id,
                    userName: `${currentUser.firstName} ${currentUser.lastName}`,
                    email: currentUser.email,
                    service: currentUser.service,
                    serviceName: currentUser.service.name,
                    status: 'pending',
                    year: (new Date()).getFullYear(),
                    semester: (new Date).getMonth() < 6 ? 1 : 2,
                    mainIncome: {
                        role: null,
                        carrier: null,
                        carrierCode: null,
                        income: [
                            { gross: null, net: null, file: null },
                            { gross: null, net: null, file: null },
                            { gross: null, net: null, file: null },
                            { gross: null, net: null, file: null },
                            { gross: null, net: null, file: null },
                            { gross: null, net: null, file: null },
                        ],
                    },
                    extraIncome: [],
                }
            }

            loading.value = false
        } catch (err) {
            if (err.response?.status === 401) {
                router.push({ name: 'Login' })
            }
            console.log(err, err.response)
        }
    })

    watch(form, (newValue, oldValue) => {
        if (oldValue) {
            currentUser.role === 'employee' && form.value.status !== 'completed' && (form.value.status = 'pending')
        }
    }, { deep: true })
</script>
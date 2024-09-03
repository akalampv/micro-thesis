<template>
    <div v-if="maxPage > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-10 sm:px-6 mt-16">
        <div class="flex flex-1 justify-between sm:hidden">
            <button
                @click="previousPage"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4
                    py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <span class="sr-only">Προηγούμενη</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button
                @click="nextPage"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4
                    py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <span class="sr-only">Επόμενη</span>
                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
        </div>

        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Προβολή
                    {{ ' ' }}
                    <span class="font-medium">{{ limit * (page - 1) + 1 }}</span>
                    {{ ' ' }}
                    έως
                    {{ ' ' }}
                    <span class="font-medium">{{ Math.min(limit * page, total) }}</span>
                    {{ ' ' }}
                    από
                    {{ ' ' }}
                    <span class="font-medium">{{ total }}</span>
                    {{ ' ' }}
                    αποτελέσματα
                </p>
            </div>

            <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                        @click="previousPage"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1
                            ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span class="sr-only">Προηγούμενη</span>
                        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                    </button>

                    <template v-for="element in elements">
                        <button
                            v-if="typeof element === 'number'"
                            @click="$emit('update:page', element)"
                            :class="{
                                'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': element === page,
                                'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0': element !== page
                            }"
                            class="relative hidden items-center px-4 py-2 text-sm font-semibold focus:z-20 lg:inline-flex"
                        >
                            {{ element }}
                        </button>

                        <span
                            v-else
                            class="relative block p-2 w-[40px] border border-gray-300 bg-white text-sm
                                text-center font-medium text-gray-700"
                        >
                            ...
                        </span>
                    </template>

                    <button
                        @click="nextPage"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1
                            ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span class="sr-only">Επόμενη</span>
                        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { range } from 'lodash'
    import { computed } from 'vue';
    import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

    const emit = defineEmits(['update:page']);

    const props = defineProps({
        page: Number,
        limit: Number,
        total: Number,
        onEachSide: {
            type: Number,
            default: 1,
        },
    });

    const maxPage = computed(() => Math.ceil(props.total / props.limit))

    const elements = computed(() => {
        const _window =
            maxPage.value < props.onEachSide * 2 + 5 ? getSmallSlider() : getUrlSlider()

        return [
            ..._window.first,
            _window.slider.length ? '...' : null,
            ..._window.slider,
            _window.last.length ? '...' : null,
            ..._window.last,
        ].filter(item => item !== null)
    })

    const getSmallSlider = () => {
        return {
            first: range(1, maxPage.value + 1),
            slider: [],
            last: [],
        }
    }

    const getUrlSlider = () => {
        const _window = props.onEachSide + 2

        if (props.page <= _window) {
            return getSliderTooCloseToBeginning(_window)
        } else if (props.page > maxPage.value - _window) {
            return getSliderTooCloseToEnding(_window)
        }

        return getFullSlider()
    }

    const getSliderTooCloseToBeginning = _window => {
        return {
            first: range(1, _window + props.onEachSide + 1),
            slider: [],
            last: range(maxPage.value - 1, maxPage.value + 1),
        }
    }

    const getSliderTooCloseToEnding = _window => {
        return {
            first: [1, 2],
            slider: [],
            last: range(maxPage.value - (_window + (props.onEachSide - 1)), maxPage.value + 1),
        }
    }

    const getFullSlider = () => {
        return {
            first: [1],
            slider: range(props.page - props.onEachSide, props.page + props.onEachSide + 1),
            last: [maxPage.value],
        }
    }

    const previousPage = () => {
        if (props.page -1 < 1) {
            return;
        }

        emit('update:page', props.page - 1);
    }

    const nextPage = () => {
        if (props.page + 1 > maxPage.value) {
            return;
        }

        emit('update:page', props.page + 1);
    }
</script>
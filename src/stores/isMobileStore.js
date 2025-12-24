import {defineStore} from "pinia";
import {ref} from "vue";

export const useIsMobileStore = defineStore(
    'isMobileStore',
    () => {
        const match = window.matchMedia('(max-width: 900px)');
        const isMobile = ref(match.matches);

        match.addEventListener('change', () => {
            isMobile.value = match.matches;
        })

        return {isMobile};
    },
    {
        persist: true,
    },
);

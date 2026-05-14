import {createRouter, createWebHistory} from "vue-router";
import ZzzView from "@/views/ZzzAchievement/ZzzView.vue";
import HomeView from "@/views/Home/HomeView.vue"
import SrView from "@/views/SrAchievement/SrView.vue";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useServerUpdateLogStore} from "@/scripts/stores/serverUpdateLogStore.js";

const routes = [
    {
        path: "/",
        component: HomeView,
        meta: {
            title: "首页",
            theme: 'light',
            color: '#FFFFFF'
        },
        beforeEnter: async (to, from, next) => {
            const srAchievementStore = useSrAchievementStore();
            const zzzAchievementStore = useZzzAchievementStore();
            const serverUpdateLogStore = useServerUpdateLogStore();

            // Ensure SR's data are loaded
            await srAchievementStore.checkAchievementVersion();

            // Ensure ZZZ's data are loaded
            await zzzAchievementStore.checkAchievementVersion();

            // Fetch the server update log
            await serverUpdateLogStore.ensureServerUpdateLog();

            next();
        }
    },
    {
        path: "/zzz",
        component: ZzzView,
        meta: {
            title: '绝区零成就',
            theme: 'dark',
            color: '#000000'
        },
        beforeEnter: (to, from, next) => {
            const uuid = resolveUuid(to);

            if (uuid) {
                next();
            } else {
                next('/');
            }
        },
    },
    {
        path: "/hsr",
        component: SrView,
        meta: {
            title: '崩坏：星穹铁道成就',
            theme: 'light',
            color: '#f6f6f6'
        },
        beforeEnter: (to, from, next) => {
            const uuid = resolveUuid(to);

            if (uuid) {
                next();
            } else {
                next('/');
            }
        },
    },
];

function resolveUuid(to) {
    const accountStore = useAccountStore();

    if (accountStore.getAccounts().length === 0) {
        return null;
    }

    const shortId = to.query.id;
    if (!shortId) {
        return null;
    }

    const found = accountStore
        .getAccounts()
        .find(acc => acc.uuid.endsWith(shortId));

    return found?.uuid ?? null;
}

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

import {createRouter, createWebHistory} from "vue-router";
import ZzzView from "@/views/ZzzAchievement/ZzzView.vue";
import HomeView from "@/views/Home/HomeView.vue"
import SrView from "@/views/SrAchievement/SrView.vue";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useServerInfoStore} from "@/scripts/stores/serverInfoStore.js";

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
            const serverInfoStore = useServerInfoStore();

            // Ensure SR's data are loaded
            await srAchievementStore.ensureAchievementData();
            await srAchievementStore.ensureBranchData();

            // Ensure ZZZ's data are loaded
            await zzzAchievementStore.ensureAchievementData();
            await zzzAchievementStore.ensureBranchData();
            // Fetch the server info
            await serverInfoStore.ensureServerInfo();

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
            const accountStore = useAccountStore();

            if (accountStore.getAccounts().length === 0) {
                return next('/');
            }

            const shortId = to.query.id;
            const found = accountStore.getAccounts().find(acc => acc.uuid.endsWith(shortId));

            if (found) {
                to.meta.uuid = found.uuid;
                next();
            } else {
                next('/');
            }
        },
    },
    {
        path: "/sr",
        component: SrView,
        meta: {
            title: '崩坏：星穹铁道成就',
            theme: 'light',
            color: '#f6f6f6'
        },
        beforeEnter: (to, from, next) => {
            const accountStore = useAccountStore();

            if (accountStore.getAccounts().length === 0) {
                return next('/');
            }

            const shortId = to.query.id;
            const found = accountStore.getAccounts().find(acc => acc.uuid.endsWith(shortId));

            if (found) {
                to.meta.uuid = found.uuid;
                next();
            } else {
                next('/');
            }
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

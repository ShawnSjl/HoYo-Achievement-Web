import {defineStore} from "pinia";
import {ref} from "vue";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {getAllServerInfo, getLatestServerInfo} from "@/api/serverInfo.js";

export const useServerInfoStore = defineStore(
    'serverInfoStore',
    () => {
        const allInfo = ref([]);
        const lastestInfo = ref(null);

        /**
         * Fetch server info from the backend.
         * @returns {Promise<void>}
         */
        async function fetchServerInfo() {
            try {
                const allInfoResponse = await getAllServerInfo();
                if (allInfoResponse.code === 200) {
                    allInfo.value = allInfoResponse.data;
                } else {
                    showInfo(allInfoResponse.msg);
                }

                const lastestInfoResponse = await getLatestServerInfo();
                if (lastestInfoResponse.code === 200) {
                    lastestInfo.value = lastestInfoResponse.data;
                } else {
                    showInfo(lastestInfoResponse.msg)
                }

                showSuccess("服务器信息获取完成")
            } catch (error) {
                console.log("Fail to fetch server info:", error)
                showError("获取服务器信息错误", error)
            }
        }

        /**
         * Ensure that the server info data is fetched from the backend.
         * @returns {Promise<void>}
         */
        async function ensureServerInfo() {
            if (allInfo.value.length === 0 || lastestInfo.value === null) await fetchServerInfo();
        }

        return {allInfo, lastestInfo, ensureServerInfo, fetchServerInfo};
    },
    {
        persist: true,
    },
)
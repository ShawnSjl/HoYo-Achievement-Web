import {defineStore} from "pinia";
import {ref} from "vue";
import {showError, showInfo, showSuccess, showWarn} from "@/scripts/utils/notification.js";
import {getAllServerUpdateLog, getLatestServerUpdateLog} from "@/scripts/api/serverUpdateLog.js";

export const useServerUpdateLogStore = defineStore(
    'serverInfoStore',
    () => {
        const updateLog = ref([]);

        /**
         * Get the latest server update log.
         * @return {*|null}
         */
        function getLatestLog() {
            if (updateLog.value.length === 0) return null;
            return updateLog.value[0];
        }

        /**
         * Fetch all server update log from the backend.
         * @returns {Promise<void>}
         */
        async function fetchServerInfo() {
            try {
                const allLogResp = await getAllServerUpdateLog();
                if (allLogResp.code === 200) {
                    updateLog.value = allLogResp.data.sort((a, b) => b.id - a.id);
                    showSuccess(allLogResp.msg)
                } else {
                    showInfo(allLogResp.msg);
                }
            } catch (error) {
                console.error("Fail to fetch server info:", error)
                showError("获取服务器更新信息错误", error)
            }
        }

        /**
         * Fetch the latest server update log from the backend.
         * @param {boolean} active Whether to show a notification if the log is already the latest.
         * @return {Promise<void>}
         */
        async function fetchLatestServerUpdateLog(active = false) {
            try {
                const requestBody = {logID: updateLog.value[0].id}
                const newLogsResp = await getLatestServerUpdateLog(requestBody);
                if (newLogsResp.code === 200) {
                    if (newLogsResp.data.length === 0) {
                        if (active) {
                            showInfo("历史更新信息已是最新")
                        }
                        return;
                    }
                    updateLog.value.unshift(...newLogsResp.data.sort((a, b) => b.id - a.id));
                    showSuccess(newLogsResp.msg)
                } else {
                    showWarn("", newLogsResp.msg)
                }
            } catch (error) {
                console.error("Fail to fetch latest server update log: ", error)
                showError("获取服务器最新更新信息错误", error)
            }
        }

        async function ensureServerUpdateLog() {
            if (updateLog.value.length === 0) {
                await fetchServerInfo();
            } else {
                await fetchLatestServerUpdateLog();
            }
        }

        return {
            updateLog,
            getLatestLog,
            ensureServerUpdateLog,
            fetchServerInfo,
            fetchLatestServerUpdateLog,
        };
    },
    {
        persist: true,
    },
)
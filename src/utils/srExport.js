import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {showError} from "@/utils/notification";
import {useAccountStore} from "@/stores/accountStore.js";
import {useSrAchievementStore} from "@/stores/srAchievementStore";

export const srExport = async (uuid) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SR Achievements');

        // 表头
        worksheet.columns = [
            {header: '成就ID', key: 'achievement_id', width: 15},
            {header: '类别', key: 'class_name', width: 10},
            {header: '名称', key: 'name', width: 20},
            {header: '描述', key: 'description', width: 40},
            {header: '奖励等级', key: 'reward_level', width: 15},
            {header: '版本', key: 'game_version', width: 12},
            {header: '状态', key: 'complete', width: 10}
        ];

        // 获取数据
        const achievementStore = useSrAchievementStore();
        const accountStore = useAccountStore();
        const account = accountStore.getAccounts().find(account => account.uuid === uuid);

        // 处理数据
        const recordMap = new Map();
        account.records.forEach(record => {
            recordMap.set(record.achievement_id, record.complete)
        });

        const json_data = achievementStore.achievements.map(achievement => {
            const status = recordMap.get(achievement.achievement_id) ?? 0;

            return {
                ...achievement,
                complete: status
            };
        })

        // 添加数据行
        json_data.forEach(item => {
            worksheet.addRow(item);
        });

        // 创建 blob 并下载
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const now = new Date();
        const formatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-`
            + `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

        saveAs(blob, `崩坏：星穹铁道成就表格_${formatted}.xlsx`);
    } catch (error) {
        console.error(error);
        showError('成就表格导出失败')
    }
}
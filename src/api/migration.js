import api from "@/utils/request"

// Get all data migration records
export const getAllMigrationRecords = () => {
    return api.get('/api/migration/all');
}

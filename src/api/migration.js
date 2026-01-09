import api from "@/utils/request"

// Get all data migration records
export const getAllMigrationRecords = () => {
    return api.get('/api/migration/all');
}

// Load local data in server
export const loadLocalData = () => {
    return api.post('/api/migration/load-local')
}

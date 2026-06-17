export const categories = ['故事', '城市', '战术', '探索'];

export const storyClasses = ['法厄同纪事', '代理人秘闻', '独家视界', '代理人信赖', '际会之时', '绳网热议']
export const cityClasses = ['绳匠业务', '雅努斯区', '卫非地', '外环地带', '索恩区', '布亚斯特'];
export const tacticsClasses = ['迷失之地', '枯萎之都', '作战技巧', '敌对目标', '战斗成就']
export const explorationClasses = ['空洞探索指南', '零号密钥', '勘域探境']

export const zzzGetClassByCategory = (category) => {
    switch (category) {
        case '故事':
            return storyClasses;
        case '城市':
            return cityClasses;
        case '战术':
            return tacticsClasses;
        case '探索':
            return explorationClasses;
        default:
            return storyClasses;
    }
}

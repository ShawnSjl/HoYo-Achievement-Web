export const categories = ['故事', '城市', '战术', '探索'];

export const storyClasses = ['法厄同纪事', '代理人秘闻', '独家视界', '代理人信赖', '际会之时', '绳网热议']
export const cityClasses = ['绳匠业务', '雅努斯区', '卫非地', '外环地带', '索恩区'];
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

export const zzzGetClassIdByName = (class_name) => {
    switch (class_name) {
        case '法厄同纪事':
            return 1001;
        case '代理人秘闻':
            return 1002;
        case '独家视界':
            return 1003;
        case '代理人信赖':
            return 1004;
        case '际会之时':
            return 1005;
        case '绳网热议':
            return 1006;
        case '绳匠业务':
            return 2001;
        case '雅努斯区':
            return 2002;
        case '卫非地':
            return 2003;
        case '外环地带':
            return 2004;
        case '索恩区':
            return 2005;
        case '迷失之地':
            return 3001;
        case '枯萎之都':
            return 3002;
        case '作战技巧':
            return 3003;
        case '敌对目标':
            return 3004;
        case '战斗成就':
            return 3005;
        case '空洞探索指南':
            return 4001;
        case '零号密钥':
            return 4002;
        case '勘域探境':
            return 4003;
        default:
            return 0;
    }
}
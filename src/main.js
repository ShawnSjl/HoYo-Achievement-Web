import { createApp } from 'vue';  // Vue 3 API
import App from './App.vue';       // 导入 App.vue
import router from './router';     // 导入 Vue Router
import { createPinia } from 'pinia'; // 导入 Pinia 状态管理
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/style.css'

// 创建 Vue 应用实例
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

router.beforeEach((to, from, next) => {
    const defaultTitle = '游戏成就'
    document.title = to.meta.title
        ? to.meta.title
        : defaultTitle

    const theme = to.meta.theme || 'light'
    const color = to.meta.color || '#ffffff'
    setTheme(theme, color)

    next()
})

// 使用 Vue Router 和 Pinia
app.use(router);
app.use(ElementPlus);
app.use(pinia);

// 挂载到 `index.html` 的 #app
app.mount('#app');


// 通用主题设置函数
function setTheme(theme, color) {
    // 1. 设置 html class
    const html = document.documentElement
    html.classList.remove('light-theme', 'dark-theme')
    html.classList.add(`${theme}-theme`)

    // 2. 设置 <meta name="color-scheme">
    setOrUpdateMeta('color-scheme', theme)

    // 3. 设置 <meta name="theme-color">
    setOrUpdateMeta('theme-color', color)
}

function setOrUpdateMeta(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`)
    if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', name)
        document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
}

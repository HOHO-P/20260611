import { createRouter, createWebHistory } from 'vue-router'

// 引入我們想要當作「頁面」的元件
import HomePage from '../components/HomePage.vue'
import Quiz from '../components/Quiz.vue'
import Calculator from '../components/Calculator.vue'

// 定義路由規則陣列
// 每個物件都代表一個頁面
const routes = [
  {
    path: '/', // 網址路徑
    name: 'Home', // 頁面名稱
    component: HomePage // 使用 HomePage.vue 這個元件
  },
  // 為了讓導覽列的連結可以運作，我們將現有元件也設定為獨立頁面
  {
    path: '/culture', // 對應導覽列的「甜點意義」
    name: 'Culture',
    component: Quiz // 範例：點擊後會顯示測驗元件
  },
  {
    path: '/baking', // 對應導覽列的「烘焙實作」
    name: 'Baking',
    component: Calculator // 範例：點擊後會顯示計算機元件
  }
]

// 建立 Router instance
const router = createRouter({
  history: createWebHistory(), // 使用現代瀏覽器的 History API
  routes, // 套用我們定義好的路由規則
})

export default router
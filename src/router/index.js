import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [{
  path: '/',
  redirect: '/index',
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})



export default router

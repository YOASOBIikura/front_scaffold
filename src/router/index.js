import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/homepage'
},
{
  path: '/homepage',
  name: 'homepage',
  component: () => import('@/view/homepage.vue')
},
{
  path: '/marketPlace',
  name: 'marketPlace',
  component: () => import('@/view/marketPlace.vue')
},
{
  path: "/optionReview",
  name: "optionReview",
  component: () => import('@/view/optionReview.vue')
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

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
  path: '/optionReview',
  name: 'optionReview',
  component: () => import('@/view/optionReview.vue')
},
{
  path: '/sellOption',
  name: 'sellOption',
  component: () => import('@/view/sellOption.vue')
},
{
  path:"/protfolio",
  name:"protfolio",
  component: () => import('@/view/protfolio.vue')
},
  {
    path:"/assets",
    name: "assets",
    component: () => import('@/view/assets.vue')
  },
  {
    path:"/assetsNetworkFailed",
    name: "assetsNetworkFailed",
    component: () => import('@/view/assetsNetworkFailed.vue')
  },
  {
    path:"/userProfile",
    name: "userProfile",
    component: () => import('@/view/userProfile.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

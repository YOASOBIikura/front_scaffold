import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [{
  path: '/',
  redirect: '/homepage'
},
{
  path: '/homepage',
  name: 'homepage',
  component: () => import('@/view/homepage.vue'),
  meta: {
    showLayout: false
  }
},
{
  path: '/marketPlace',
  name: 'marketPlace',
  component: () => import('@/view/marketPlace.vue'),
  meta: {
    showLayout: true
  }
},
{
  path: '/optionReview',
  name: 'optionReview',
  component: () => import('@/view/optionReview.vue'),
  meta: {
    showLayout: false
  }
},
{
  path: '/sellOption',
  name: 'sellOption',
  component: () => import('@/view/sellOption.vue'),
  meta: {
    showLayout: false
  }
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
  component: () => import('@/view/protfolio.vue'),
  meta: {
    showLayout: true
  }
},
  {
    path:"/assets",
    name: "assets",
    component: () => import('@/view/assets.vue'),
    meta: {
      showLayout: true
    }
  },
  {
    path:"/assetsNetworkFailed",
    name: "assetsNetworkFailed",
    component: () => import('@/view/assetsNetworkFailed.vue'),
    meta: {
      showLayout: false
    }
  },
  {
    path:"/userProfile",
    name: "userProfile",
    component: () => import('@/view/userProfile.vue'),
    meta: {
      showLayout: false
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})



export default router

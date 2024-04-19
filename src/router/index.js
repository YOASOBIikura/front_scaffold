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
  path: '/buyOption',
  name: 'buyOption',
  component: () => import('@/view/buyOption.vue'),
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
    component: () => import('@/view/assets/assets.vue') 
  },
  {
    path:"/networkError",
    name: "networkError",
    component: () => import('@/view/error/network.vue')
  },
  {
    path:"/assetTransfer",
    name: "assetTransfer",
    component: () => import('@/view/assets/transfer.vue')
  },  
  {
    path:"/logout",
    name: "logout",
    component: () => import('@/view/assets/logout.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})



export default router

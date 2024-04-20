import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [{
  path: '/',
  redirect: '/marketPlace',
  meta:{
    showLayout: true
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
  path: '/buyCall',
  name: 'buyCall',
  component: () => import('@/view/buyOption/buyCall.vue'),
  meta:{
    showLayout: false
  }
},
{
  path: '/buyPut',
  name: 'buyPut',
  component: () => import('@/view/buyOption/buyPut.vue'),
  meta:{
    showLayout: false
  }
},

{
  path: '/sellCall',
  name: 'sellCall',
  component: () => import('@/view/sellOption/sellCall.vue'),
  meta:{
    showLayout: false
  }
},

{
  path: '/sellPut',
  name: 'sellPut',
  component: () => import('@/view/sellOption/sellPut.vue'),
  meta:{
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
    path:"/asset",
    name: "asset",
    component: () => import('@/view/assets/assets.vue'),
    meta: {
      showLayout: true
     }
  },
  {
    path:"/networkError",
    name: "networkError",
    component: () => import('@/view/error/network.vue'),
    meta:{
      showLayout: false
    }

  },
  {
    path:"/assetTransfer",
    name: "assetTransfer",
    component: () => import('@/view/assets/transfer.vue'),
    meta:{
      showLayout: false
    }
  },  
  {
    path:"/logout",
    name: "logout",
    component: () => import('@/view/assets/logout.vue'),
    meta:{
      showLayout: false
    }
  },
  {
    path:"/notification",
    name: "notification",
    component: () => import('@/view/notification.vue'),
    meta:{
      showLayout: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})



export default router

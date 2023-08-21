import { lazy } from "react";



const Routes = [
    {
        path: "/",
        component: lazy(() => import('../loginpages/Login.js')),
        name: '/'
    },
    {
        path: "/login/admin",
        component: lazy(() => import('../loginpages/Login.js')),
    
    },
    {
        path: "/dashboard",
        component: lazy(() => import('../dashboard/Dashboard.js')),
        name: '/admin'
    },
    {
            path: "/addcategory",
            component: lazy(() => import('../category/addcategory.js')),
            name: '/admin'
        },
    {
        path: "/collectionlist",
        component: lazy(() => import('../promotion_collection/collectionlist')),
        name: '/admin'
    },
    {
        path: "/categorylist",
        component: lazy(() => import('../category/categorylist.js')),
        name: '/admin'
    },
    {
        path: "/editcategory",
        component: lazy(() => import('../category/addcategory.js')),
        name: '/admin'
    },
    {
        path: "/currencylist",
        component: lazy(() => import('../currencyList/currencylist.js')),
        name: '/admin'
    },
    {
        path: "/subscriberslist",
        component: lazy(() => import('../subscribers/subscriberlist.js')),
        name: '/admin'
    },
    {
        path: "/sendmail",
        component: lazy(() => import('../subscribers/sendmail.js')),
        name: '/admin'
    },
    {
        path: "/sociallist",
        component: lazy(() => import('../sociallinks/socaillinks.js')),
        name: '/admin'
    },
    {
        path: "/editsociallink",
        component: lazy(() => import('../sociallinks/socaillinks.js')),
        name: '/admin'
    },
    {
        path: "/servicefee",
        component: lazy(() => import('../serviceFeeManagement/listservicefee.js')),
        name: '/admin'
    },
    {
        path: "/userlist",
        component: lazy(() => import('../user/userlist')),
        name: '/admin'
    },
    {
        path:"/userdetail",
        component: lazy(() => import('../user/userlist')),
        name:'/admin'
    },
    {
        path: "/nfttaglist",
        component: lazy(() => import('../nfttag/nfttaglist.js')),
        name: '/admin'
    },
    {
        path: "/editnfttag",
        component: lazy(() => import('../nfttag/nfttaglist.js')),
        name: '/admin'
    },
    {
        path:"/tokenlist",
        component: lazy(() => import('../token/tokenlist')),
        name:'/admin'
    },
    {
        path:"/viewdetail",
        component: lazy(() => import('../token/tokenlist')),
        name:'/admin'
    },
]


export default Routes;

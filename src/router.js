import VueRouter from 'vue-router'

//导入对应的路由组件
import HomeContainer from './components/tabbar/HomeContainer.vue'
import MemberContainer from './components/tabbar/MemberContainer.vue'
import ShopcarContainer from './components/tabbar/ShopcarContainer.vue'
import SearchContainer from './components/tabbar/SearchContainer.vue'
import newList from './components/news/newList.vue'
import newInfo from './components/news/newInfo.vue'
import photoList from './components/photos/PhotoList.vue'
import photoInfo from './components/photos/PhotoInfo.vue'
import goodsList from './components/goods/goodsList.vue'
import goodsInfo from './components/goods/goodsInfo.vue'
import goodsComment from './components/goods/goodsComment.vue'
import goodsDesc from './components/goods/goodsDesc.vue'

var router=new VueRouter({
    routes:[//配置路由规则
        {path:'/',redirect:'home'},
        {path:'/home',component:HomeContainer},
        {path:'/member',component:MemberContainer},
        {path:'/shopcar',component:ShopcarContainer},
        {path:'/search',component:SearchContainer},
        {path:'/home/newList',component:newList},
        {path:'/home/newInfo/:id',component:newInfo},
        {path:'/home/photolist',component:photoList},
        {path:'/home/photoinfo/:id',component:photoInfo},
        {path:'/home/goodslist',component:goodsList},
        {path:'/home/goodsinfo/:id',component:goodsInfo,name:'goodsinfo'},
        {path:'/home/goodsdesc/:id',component:goodsDesc,name:'goodsdesc'},
        {path:'/home/goodscomment/:id',component:goodsComment,name:'goodscomment'},
    ],
    linkActiveClass:'mui-active' //覆盖默认的路由高亮的类
})

export default router
<template>
    <div class="goodsinfo-container">
        <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="ball" v-show="ballFlag" ref="ball"></div>
        </transition>
        <!-- 商品轮播图区域 -->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <swiper :lunbotuList="lunbotu" :isfull="false"></swiper>
                </div>
            </div>
        </div>
        <!-- 商品购买区域 -->
        <div class="mui-card">
            <div class="mui-card-header">{{goodsinfo.title}}</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p class="price">
                        市场价：<del>￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;销售价：<span class="now_price">￥{{goodsinfo.sell_price}}</span>
                    </p>
                    <p>购买数量：<numbox @getcount="getSelectedCount" :max="goodsinfo.stock_quantity"></numbox></p>
                    <p>
                        <mt-button type="primary" size="small">立即购买</mt-button>
                        <mt-button type="danger" size="small" @click="addToShopCar">加入购物车</mt-button>
                        <!-- 分析：如何实现假如购物车时候，拿到选择的数量 -->
                        <!-- 涉及到子组件向父组件传值 -->
                        <!-- 事件调用的本质：父向子传递的方法，同时把数据当做参数传递给这个方法 -->
                    </p>
                </div>
            </div>
        </div>
        <!-- 商品参数区域 -->
        <div class="mui-card">
            <div class="mui-card-header">商品参数</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p>商品货号：{{goodsinfo.goods_no}}</p>
                    <p>库存情况：{{goodsinfo.stock_quantity}}件</p>
                    <p>上架时间：{{goodsinfo.add_time | dateFormat}}</p>
                </div>
            </div>
            <div class="mui-card-footer">
                <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
                <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    //导入轮播图组件
    import swiper from '../subcomponents/swiper.vue'
    //导入数字选择框组件
    import numbox from '../subcomponents/goodsinfo_number.vue'
    export default {
        data(){
            return{
                id:this.$route.params.id,//将路由参数对象中的id挂载到data上
                lunbotu:[],//轮播图的数据
                goodsinfo:{},//获取到的商品信息
                ballFlag:false,//控制小球隐藏和显示的标识符
                selectedCount:1,//保存用户选中的商品数量，默认，认为用户买一个
                
            }
        },
        created(){
            this.getLunbotu();
            this.getGoodsInfo();
        },
        methods:{
            getLunbotu(){
                this.$http.get('api/getthumimages/'+this.id).then(result=>{
                    if(result.body.status===0){
                        //先循环轮播图数组的每一项，为item添加img属性，因为轮播图组件中，只认识item.img，不认识item.src
                        result.body.message.forEach(item=>{
                            item.img=item.src;
                        })
                        this.lunbotu=result.body.message;
                    }
                })
            },
            getGoodsInfo(){
                //获取商品的信息
                this.$http.get('api/goods/getinfo/'+this.id).then(result=>{
                    if(result.body.status===0){
                        this.goodsinfo=result.body.message[0];
                    }
                })
            },
            goDesc(id){
                //点击使用编程式导航跳转到图文介绍页面
                this.$router.push({name:'goodsdesc',params:{id:this.id}})
            },
            goComment(id){
                //点击跳转到评论页面
                this.$router.push({name:'goodscomment',params:{id:this.id}})
            },
            addToShopCar(){
                //添加购物车
                this.ballFlag=!this.ballFlag;
                // {id:商品id，count：要购买的数量,price：商品的单价，selected:true}
                //拼接出一个要保存到store中的car数组里的商品信息对象
                var goodsinfo = {id:this.id,count:this.selectedCount,price:this.goodsinfo.sell_price,selected:true}
                //调用store中的mutations来将商品加入购物车
                this.$store.commit('addToCar',goodsinfo)
            },
            beforeEnter(el){
                el.style.transform="translate(0,0)";
            },
            enter(el,done){
                el.offsetWidth;
                //小球动画优化思路：
                //1、不能把位置的横纵坐标距离直接写死了，而是应该根据不同情况，动态计算这个坐标值
                //2、先得到徽标的横纵坐标，再得到小球的横纵坐标，然后让y值求差，x值也求差，得到的结果，就是横纵坐标要位移的距离
                //3、如何获取徽标和小球的位置？ domObject.getBoundingClientRect()

                //获取小球在页面中的位置
                const ballPosition=this.$refs.ball.getBoundingClientRect();
                //获取徽标在页面中的位置
                const badgePosition=document.getElementById("badge").getBoundingClientRect();

                const xDist = badgePosition.left - ballPosition.left;
                const yDist = badgePosition.top - ballPosition.top;
                el.style.transform=`translate(${xDist}px, ${yDist}px)`;
                el.style.transition="all 0.5s cubic-bezier(.4,-0.3,1,.68)";
                done();
            },
            afterEnter(el){
                this.ballFlag=!this.ballFlag;
            },
            getSelectedCount(count){
                //当子组件把选中的数量传递给父组件的时候，把选中的值保存到data上
                this.selectedCount=count;
                console.log('父组件拿到的数量值：'+this.selectedCount);
            }
        },
        components:{
            swiper,
            numbox
        }
    }
</script>

<style lang="scss" scoped>
    .goodsinfo-container{
        background-color:#eee;
        overflow:hidden;
        width:375.2px;

        .now_price{
            color:red;
            font-size:16px;
            font-weight:bold;
        }
        .mui-card-footer{
            display:block;
            button{
                margin:15px 0;
            }
        }
        .ball{
            width:15px;
            height:15px;
            border-radius: 50%;
            background-color:red;
            position:absolute;
            z-index:99;
            top:390px;
            left:146px;
        }
    }
</style>
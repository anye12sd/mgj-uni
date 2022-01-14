<template>
	<view>
		<headerNav :value="navbar"></headerNav>
		<scroll-view class="product-list-nav" scroll-x="true" @scroll="scroll">
			<template v-for="(item, index) in title">
				<view class="product-list-nav-title" :class="{'active': titleIndex === index}"
					@click="checkTitleIndex(item, index)" :key="index">{{item.name}}</view>
			</template>
		</scroll-view>
		<scroll-view class="product-list-subnav" scroll-x="true" @scroll="subscroll" v-if="subtitle.length">
			<template v-for="(item, index) in subtitle">
				<view class="product-list-subnav-title" :class="{'active': subtitleIndex === index}"
					@click="checkSubTitleIndex(item, index)" :key="index">{{item.name}}</view>
			</template>
		</scroll-view>
		<view class="content">
			<template v-for="(item, index) in goodsList">
				<view class="list flex" :key="index">
					<view class="list-img" @click="toGoodsDetail(item)">
						<image class="list-img-img" mode="widthFix" :src="item.img">
							</imgage>
					</view>
					<view class="list-info" @click="toGoodsDetail(item)">
						<view class="list-name">{{item.name}}</view>
						<view class="list-star">
							<view class="star-box"></view>
							<view class="star-box"></view>
							<view class="star-box"></view>
							<view class="star-box"></view>
							<view class="star-box"></view>
							<view class="score">5.0</view>
						</view>
						<price :price="item.price"></price>
					</view>
					<view class="flex-1">
						<view class="add-cart-btn" v-if="item.num == 0">
							<image class="add-cart-btn-img" mode="widthFix" src="../../../static/img/cart_small@2x.png"
								@click.stop="cartAdd(item)">
							</image>
						</view>
						<view class="add-cart-btn" v-else>
							<view class="num-minus" @click.stop="cartMinus(item)"></view>
							<view class="num-box">{{item.num}}</view>
							<view class="num-add" @click.stop="cartAdd(item)"></view>
						</view>
					</view>
				</view>
			</template>
			<view class="dixian" v-if="dixianShow">我也是有底线的</view>
		</view>
		<view class="cart-bottom flex">
			<view class="cart-bottom-img" @click="showCartDetail()">
				<image mode="widthFix" src="../../../static/img/cart-large@2x.png"></image>
				<view class="selected-badge" v-if="selectedNum">{{selectedNum}}</view>
			</view>
			<view class="cart-bottom-price">
				<price class="price" :price="price"></price>
				<view class="origin-price">￥{{originPrice}}</view>
				<view class="discount-price">已优惠￥{{discountPrice}}</view>
			</view>
			<view class="cart-bottom-btn-box flex-1">
				<view class="cart-bottom-btn" @click="toPreOrder(10)">去结算</view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view class="shadow" v-if="cartShow"></view>
		<view class="cart-detail" :class="{'active': cartShow}" @touchmove.stop.prevent="moveHandle">
			<u-transition :show="cartShow" mode="fade-up">
				<view class="transition">
					<view class="cart-detail-header">
						<view class="cart-title">购物车列表</view>
						<view class="cart-close" @click="cartShow = false"></view>
					</view>
					<view class="cart-info flex">
						<view class="flex-1 cart-num">购物车已选{{cartTotalNum}}件商品</view>
						<view class="cart-clear" @click="clearCart">
							清空购物车
						</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y" @scroll="cartScroll">
						<template v-for="(item, index) in fruitSelectedGoods">
							<view class="flex" :key="index">
								<view class="cart-detail-img">
									<image mode="widthFix" :src="item.img"></image>
								</view>
								<view class="cart-detail-info">
									<view class="cart-detail-info-name">{{item.name}}</view>
									<view class="cart-detail-info-price">单价：
										<text class="cart-detail-info-price-price">￥{{item.price}}</text>
									</view>
								</view>
								<view class="cart-detail-info-right flex-1">
									<view class="cart-detail-info-total-price">
										<price :price="item.totalPrice"></price>
									</view>
									<view class="add-cart-btn">
										<view class="num-minus" @click="cartDetailMinus(item)"></view>
										<view class="num-box">{{item.num}}</view>
										<view class="num-add" @click="cartDetailAdd(item)"></view>
									</view>
								</view>
							</view>
						</template>
					</scroll-view>
				</view>
			</u-transition>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import price from '../../../components/price.vue'
	import {
		getCategory,
		getGoodsList
	} from '../../../config/api.js'
	export default {
		components: {
			price
		},
		data() {
			return {
				navbar:{
					title: '时令水果',
					custom: false
				},
				old: {
					cartScroll: 0,
					scrollTop: 0,
					subScrollTop: 0
				},
				title: [],
				subtitle: [],
				titleIndex: 0,
				subtitleIndex: 0,
				serviceId: 0, //父层id
				categoryId: 0, // 子层id
				goodsList: [],
				dixianShow: false,
				last_page: 0,
				page: 1,
				fruitSelectedGoods: [], //已加入购物车的数据
				selectedNum: 0, // 购物车数量
				originPrice: "0.00", // 折前价格
				price: "0.00", // 折后价格
				discountPrice: "0.00", // 优惠金额
				cartShow: false,
				cartTotalNum: 0, // 购物车总物品数
			}
		},
		onShow() {
			this.goodsList = []
			this.fruitSelectedGoods = uni.getStorageSync('HJKJ-fruitSelectedGoods') || []
			if (this.fruitSelectedGoods.length) {
				this.calcCart()
			}
			let pagearr = getCurrentPages();
			let currentPage = pagearr[pagearr.length - 1];
			this.fetchCategory(currentPage.options.id)
		},
		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			subscroll: function(e) {
				this.old.subScrollTop = e.detail.scrollTop
			},
			cartScroll: function(e) {
				this.old.cartScroll = e.detail.scrollTop
			},
			fetchCategory(id) {
				let data = {
					service_key: id,
				}
				uni.showLoading({
					title: '加载中'
				});
				getCategory(data).then((res) => {
					this.title = res
					this.subtitle = res[0].children
					this.serviceId = res[0].service_id
					this.categoryId = res[0].children[0].id
					uni.hideLoading();
					this.fetchProduct()
				})
			},
			fetchProduct() {
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					category: this.categoryId,
					service_key: this.serviceId,
					page: this.page
				}
				uni.showLoading({
					title: '加载中'
				});
				getGoodsList(data).then((res) => {
					if (this.page == res.last_page || res.total == 0) {
						this.dixianShow = true
					}
					this.last_page = res.last_page
					this.goodsList = this.goodsList.concat(res.data)
					this.goodsList.map(item => {
						item.num = 0
					})
					if (this.fruitSelectedGoods.length) {
						this.goodsList.map(item => {
							this.fruitSelectedGoods.map(items => {
								if (item.id == items.id) {
									item.num = items.num
								}
							})
						})
					}
					uni.hideLoading()
				})
			},
			checkTitleIndex(item, index) {
				if (this.titleIndex == index) {
					return
				}
				this.titleIndex = index
				this.subtitleIndex = 0
				this.subtitle = this.title[index].children
				this.page = 1
				this.dixianShow = false

				this.goodsList = []
				this.serviceId = item.service_id
				this.categoryId = item.children.length ? item.children[0].id : null
				this.fetchProduct()
			},
			checkSubTitleIndex(item, index) {
				if (this.subtitleIndex == index) {
					return
				}
				this.subtitleIndex = index
				this.categoryId = item.id
				this.page = 1
				this.goodsList = []
				this.dixianShow = false
				this.fetchProduct()
			},

			// 逻辑：先当前列表遍历使数量增加1，再嵌套循环若购物车里已有选中id则在该id的num上加一否则增加整个id所在类目
			cartAdd(goods) {
				let that = this
				that.goodsList.find(function(item) {
					if (item.id == goods.id) {
						item.num += 1
						if (item.num == 1) {
							that.fruitSelectedGoods.push(item)
						} else {
							let index;
							that.fruitSelectedGoods.find(function(items, indexs) {
								if (items.id == goods.id) {
									index = indexs
								}
							})
							that.fruitSelectedGoods[index].num = item.num
						}
					}
				})
				this.calcCart()
				uni.setStorageSync('HJKJ-fruitSelectedGoods', this.fruitSelectedGoods)
				this.goodsList = Object.assign([], this.goodsList)
			},
			// 逻辑：先当前列表遍历使数量减少1，再嵌套循环若购物车里已有选中id则在该id的num上减一，若减完为0则删除整个id所在类目
			cartMinus(goods) {
				let that = this
				that.goodsList.find(function(item) {
					if (item.id == goods.id) {
						item.num -= 1
						if (item.num == 0) {
							let index;
							that.fruitSelectedGoods.find(function(items, indexs) {
								if (items.id == goods.id) {
									index = indexs
								}
							})
							that.fruitSelectedGoods.splice(index, 1)
						} else {
							let index;
							that.fruitSelectedGoods.find(function(items, indexs) {
								if (items.id == goods.id) {
									index = indexs
								}
							})
							that.fruitSelectedGoods[index].num = item.num
						}
					}
				})
				this.calcCart()
				uni.setStorageSync('HJKJ-fruitSelectedGoods', this.fruitSelectedGoods)
				this.goodsList = Object.assign([], this.goodsList)
			},
			cartDetailAdd(goods){
				this.fruitSelectedGoods.find(function(item) {
					if(goods.id == item.id){
						item.num += 1
					}
				})
				this.calcCart()
				uni.setStorageSync('HJKJ-fruitSelectedGoods', this.fruitSelectedGoods)
				this.fruitSelectedGoods = Object.assign([], this.fruitSelectedGoods)
			},
			cartDetailMinus(goods){
				let that = this
				this.fruitSelectedGoods.find(function(item, index) {
					if(goods.id == item.id){
						item.num -= 1
						if (item.num == 0) {
							that.fruitSelectedGoods.splice(index, 1)
						}
					}
				})
				this.calcCart()
				uni.setStorageSync('HJKJ-fruitSelectedGoods', this.fruitSelectedGoods)
				this.fruitSelectedGoods = Object.assign([], this.fruitSelectedGoods)
			},
			clearCart(){
				this.fruitSelectedGoods = []
				this.goodsList = []
				this.fetchProduct()
				this.calcCart()
				uni.setStorageSync('HJKJ-fruitSelectedGoods', this.fruitSelectedGoods)
				this.fruitSelectedGoods = Object.assign([], this.fruitSelectedGoods)
			},
			calcCart() {
				let selectedNum = 0
				let originPrice = 0
				let price = 0
				let discountPrice = 0
				let cartTotalNum = 0
				this.fruitSelectedGoods.forEach(function(item) {
					selectedNum += item.num
					originPrice += parseFloat(item.original_price) * item.num
					price += parseFloat(item.price) * item.num
					item.totalPrice = (parseFloat(item.price) * item.num).toFixed(2)
					cartTotalNum += item.num
				})
				discountPrice = originPrice - price
				this.selectedNum = selectedNum
				this.originPrice = originPrice.toFixed(2)
				this.price = price.toFixed(2)
				this.discountPrice = discountPrice.toFixed(2)
				this.cartTotalNum = cartTotalNum
			},
			onReachBottom() {
				if (this.page == this.last_page) {
					return
				}
				this.page = this.page + 1
				this.fetchProduct()
			},
			toGoodsDetail(goods){
				uni.navigateTo({
					url: '/pages/laundryDetails/index?type=10&id=' + goods.id //跳转路径
				})
			},
			showCartDetail() {
				this.cartShow = true
			},
			toPreOrder(type){
				if(!this.cartTotalNum){
					this.$refs.uToast.show({
						type: 'error',
						message: '请先选择商品',
					})
					return
				}
				uni.navigateTo({
					url: '/pages/order/preOrder/index?type=' + type
				})
			},
			moveHandle() {}
		}
	}
</script>

<style scoped>
	.product-list-nav {
		width: 100%;
		white-space: nowrap;
	}

	.product-list-nav-title {
		display: inline-block;
		padding: 12px;
		font-weight: bold;
		font-size: 16px;
		color: #666;
	}

	.product-list-nav-title.active {
		color: #1a1a1a;
		position: relative;
	}

	.product-list-nav-title.active:after {
		content: "";
		display: block;
		background: url(../../../static/img/recommend@2x.png) no-repeat center;
		background-size: 10px;
		width: 10px;
		height: 8px;
		left: 0;
		right: 0;
		margin: 0 auto;
	}
	
	.product-list-subnav-title:nth-last-child(1) {
		margin-right: 20px;
	}

	.product-list-subnav {
		padding: 10px 12px;
		white-space: nowrap;
		width: auto !important;
	}

	.product-list-subnav-title {
		display: inline-block;
		width: 80px;
		height: 30px;
		line-height: 30px;
		color: #1a1a1a;
		font-size: 14px;
		text-align: center;
		background-color: #f5f5f5;
		margin-left: 12px;
		border-radius: 15px;
	}

	.product-list-subnav-title:nth-child(1) {
		margin-left: 0;
	}

	.product-list-subnav-title:nth-last-child(1) {
		margin-right: 20px;
	}

	.product-list-subnav-title.active {
		color: #fff;
		background: #FF8C4E;
	}

	.content {
		background-color: #f5f5f5;
		padding: 12px;
		padding-bottom: 80px;
		min-height: calc(100vh - 250px);
	}

	.list {
		background: #fff;
		padding: 12px;
		margin-top: 6px;
		position: relative;
		border-radius: 4px;
	}

	.list:nth-child(1) {
		margin-top: 0;
	}

	.list-img {
		width: 63px;
		height: 63px;
	}

	.list-img-img {
		width: 100%;
	}

	.list-info {
		margin-left: 12px;
	}

	.list-name {
		font-size: 16px;
		font-weight: bold;
		color: #1a1a1a;
	}

	.list-star {
		width: 100%;
		margin-top: -1px;
	}

	.star-box {
		background: url(../../../static/img/star@2x.png) no-repeat center;
		width: 8px;
		height: 8px;
		display: inline-block;
		margin-left: 5px;
		background-size: 8px;
	}

	.score {
		margin-left: 5px;
		color: #FF8C4E;
		font-size: 10px;
		font-weight: bold;
		display: inline-block;
	}

	.star-box:nth-child(1) {
		margin-left: 0px;
	}

	.list .flex-1 {
		position: relative;
	}

	.add-cart-btn {
		position: absolute;
		right: 0px;
		bottom: 0px;
	}

	.add-cart-btn-img {
		width: 31px;
		height: 31px;
	}

	.num-minus {
		background: url(../../../static/img/minus.png) no-repeat center;
		background-size: 20px;
		width: 10px;
		height: 10px;
		display: inline-block;
		margin-right: 6px;
		vertical-align: middle;
	}

	.num-box {
		display: inline-block;
		background: #f5f5f5;
		width: 50px;
		height: 25px;
		line-height: 25px;
		text-align: center;
		font-size: 12px;
		color: #000;
		border-radius: 2px;
	}

	.num-add {
		background: url(../../../static/img/add.png) no-repeat center;
		background-size: 20px;
		width: 10px;
		height: 10px;
		display: inline-block;
		margin-left: 6px;
		vertical-align: middle;
	}

	.dixian {
		font-size: 12px;
		color: #999;
		text-align: center;
		height: 35px;
		line-height: 35px;
		background: #f5f5f5;
		margin: 0 -12px;
		position: relative;
	}

	.dixian::before {
		display: block;
		content: "";
		width: 70px;
		height: 1px;
		background-color: #bbb;
		position: absolute;
		top: calc(50% - 1px);
		left: calc(50% - 120px)
	}

	.dixian::after {
		display: block;
		content: "";
		width: 70px;
		height: 1px;
		background-color: #bbb;
		position: absolute;
		top: calc(50% - 1px);
		right: calc(50% - 120px)
	}

	.cart-bottom {
		position: fixed;
		height: 60px;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		padding: 0 12px;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.08);
		z-index: 10;
	}

	.cart-bottom-img {
		width: 63px;
		height: 63px;
		margin-top: -10px;
		position: relative;
	}

	.selected-badge {
		position: absolute;
		top: -5px;
		right: 5px;
		color: #fff;
		font-size: 10px;
		background: #ff0000;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		text-align: center;
		line-height: 18px;
	}

	.cart-bottom-img image {
		width: 100%;
	}

	.cart-bottom-price {
		margin-left: 12px;
		margin-top: 12px;
	}

	.price {
		display: inline-block;
	}

	.origin-price {
		display: inline-block;
		font-size: 10px;
		color: #999;
		text-decoration: line-through;
		margin-left: 6px;
	}

	.discount-price {
		font-size: 12px;
		color: #666;
	}

	.cart-bottom-btn-box {
		text-align: right;
	}

	.cart-bottom-btn {
		padding: 10px 36px;
		border-radius: 40px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		display: inline-block;
		color: #fff;
		margin-top: 10px;
	}

	.cart-detail {
		position: fixed;
		bottom: 0;
		height: 350px;
		left: 0;
		right: 0;
		z-index: -1
	}

	.cart-detail.active {
		z-index: 5;
	}

	.transition {
		width: 100%;
		height: 350px;
		background: #fff;
	}

	.cart-detail-header {
		height: 45px;
		line-height: 45px;
		font-size: 16px;
		font-weight: bold;
		color: #000;
		text-align: center;
		background: #fff;
		position: relative;
	}

	.cart-close {
		position: absolute;
		background: url(../../../static/img/cart-close@2x.png) no-repeat center;
		background-size: 20px;
		width: 20px;
		height: 20px;
		right: 12px;
		top: 13px;
	}

	.cart-info {
		height: 30px;
		line-height: 30px;
		background: #f5f5f5;
		padding: 0 12px;
		justify-content: space-between;
	}

	.cart-num {
		font-size: 12px;
		font-weight: bold;
		color: #000;
		text-align: left;
	}

	.cart-clear {
		font-size: 12px;
		color: #666;
		text-align: right;
		background: url(../../../static/img/cart-clear@2x.png) no-repeat 2px;
		background-size: 12px;
		padding-left: 20px;
	}

	.scroll-Y {
		padding: 12px 24px;
		height: 200px;
		width: calc(100vw - 48px)
	}

	.scroll-Y .flex {
		margin-top: 18px;
	}

	.scroll-Y .flex:nth-child(1) {
		margin-top: 0;
	}

	.cart-detail-img {
		width: 55px;
		height: 55px;
	}

	.cart-detail-img image {
		width: 100%;
	}

	.cart-detail-info {
		margin-left: 12px;
	}

	.cart-detail-info-name {
		color: #000;
		font-size: 16px;
	}

	.cart-detail-info-price {
		margin-top: 10px;
		font-size: 12px;
		color: #999;
	}

	.cart-detail-info-price-price {
		color: #000;
	}
	.cart-detail-info-right{
		text-align: right;
		position: relative
	}
	.shadow{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 5;
		background: rgba(0,0,0,.5);
	}
</style>

<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<image style="width: 100%;" :src="goods.img" mode="widthFix"></image>
		<view class="name-box">
			<price :price="goods.price"></price>
			<view class="name">{{goods.name}}</view>
		</view>
		<view class="flex sales-box">
			<view></view>
			<view class="saled">已售：{{goods.sale_num}}</view>
		</view>
		<view class="divide"></view>
		<!--  #ifdef APP-PLUS -->
		<u-sticky :offsetTop="44 + StatusBar" zIndex="5">
		<!--  #endif -->
		<!--  #ifdef H5 -->
		<u-sticky :offsetTop="0" zIndex="5">
		<!--  #endif -->
			<view class="content-title flex">
				<view class="flex-1" :class="recommendIndex === 1?'active':''" @click="toRecommend(1)">商品详情</view>
				<view class="flex-1" :class="recommendIndex === 2?'active':''" @click="toRecommend(2)">用户评价</view>
				<view class="flex-1" :class="recommendIndex === 3?'active':''" @click="toRecommend(3)">购买须知</view>
			</view>
		</u-sticky>
		<view class="content">
			<view v-if="contentIndex === 1">
				<rich-text :nodes="goods.info"></rich-text>
			</view>
			<view v-if="contentIndex === 3">
				<rich-text :nodes="goods.notice"></rich-text>
			</view>
		</view>
		<view class="add-to-cart flex">
			<view class="add-to-cart-num" @click="toPage">
				<view class="add-to-cart-num-num">{{cartNum}}</view>
				<image class="add-to-cart-img" src="../../static/img/cart@2x.png" mode="widthFix"></image>
			</view>
			<view class="add-to-cart-btn" @click="addCart">加入购物车</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import price from '../../components/price.vue'
	import {
		getGoodsDetail
	} from '../../config/api.js';
	export default {
		components: {
			price,
		},
		data() {
			return {
				navbar:{
					title: '商品详情',
					custom: false
				},
				goods: [],
				cartList: [], //购物车数据
				cartNum: 0, //购物车数量
				cartIds: [],// 购物车物品id集合
				recommendIndex: 1,
				contentIndex: 1,
				id: 0,
				type: 1 ,//1为施太洗护商品详情， 10为水果商品详情
				barheight: this.StatusBar,
			}
		},
		onLoad(option) {
			this.type = option.type
			this.id = parseInt(option.id)
			this.fetch(option.id)
			if(this.type == 1){
				this.cartList = uni.getStorageSync('HJKJ-washSelectedGoods')
			}else if(this.type == 10){
				this.cartList = uni.getStorageSync('HJKJ-fruitSelectedGoods')
			}
			this.getCartInfo()
		},
		methods: {
			fetch(id) {
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					goods_key: id,
				}
				uni.showLoading({
					title: '加载中'
				});
				getGoodsDetail(data).then((res) => {
					this.goods = res
					uni.hideLoading();
				})
			},
			toRecommend(type) {
				if (this.recommendIndex === type) {
					return
				}
				this.recommendIndex = type
				this.contentIndex = type
			},
			toPage(){
				if(this.type == 1){
					uni.navigateTo({
						url: '/pages/personalCare/index?id=1'
					})
				}else if(this.type == 10){
					uni.navigateTo({
						url: '/fruitsPage/pages/index/index?id=10'
					})
				}	
			},
			getCartInfo(){
				if(!this.cartList.length){
					return
				}
				this.cartList.map((item) => {
					this.cartNum += item.num
					this.cartIds.push(item.id)
				})
			},
			addCart(){
				if(this.cartIds.includes(this.id)){
					this.cartList.map((item) => {
						if(this.id == item.id){
							item.num += 1
							item.totalPrice = (parseFloat(item.price) * item.num).toFixed(2)
						}
					})
				}else{
					console.log(this.goods)
					this.cartList.push({
						id: this.goods.id,
						name: this.goods.name,
						img: this.goods.img,
						num: 1,
						origin_price: this.goods.original_price,
						price: this.goods.price,
						totalPrice: (parseFloat(this.goods.price) * 1).toFixed(2)
					})
				}
				this.$refs.uToast.show({
					type: 'success',
					message: '加入购物车成功',
				})
				this.cartNum += 1
				if(this.type == 1){
					uni.setStorageSync('HJKJ-washSelectedGoods', this.cartList)
				} else if(this.type == 10){
					uni.setStorageSync('HJKJ-fruitSelectedGoods', this.cartList)
				}
			}
		}
	}
</script>
<style scoped>
	.divide {
		background-color: #f5f5f5;
		height: 12px;
	}

	.name-box {
		padding: 12px;
		border-bottom: 1px solid #e6e6e6;
	}

	.name {
		margin-top: 6px;
		font-weight: bold;
		font-size: 16px;
	}

	.sales-box {
		justify-content: space-between;
		padding: 12px;
	}

	.saled {
		text-align: right;
		font-size: 12px;
		color: #999;
	}

	.content-title {
		font-size: 14px;
		color: #1a1a1a;
		text-align: center;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #e6e6e6;
		background: #fff;
	}

	.content-title .active {
		color: #FF8C4E;
	}

	.content {
		padding: 12px;
		padding-bottom: 64px;
		min-height: 60px;
	}

	.add-to-cart {
		padding: 10px 12px;
		border-top: 1px solid #e6e6e6;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		text-align: center;
		z-index: 6;
	}

	.add-to-cart-btn {
		color: #fff;
		font-size: 16px;
		width: 100%;
		background: linear-gradient(270deg, #FFBA7D 0%, #FF8C4E 100%);
		margin-left: 26px;
		height: 40px;
		line-height: 40px;
		border-radius: 50px;
	}

	.add-to-cart-img {
		width: 30px;
		vertical-align: -webkit-baseline-middle;
	}

	.add-to-cart-img-text {
		font-size: 12px;
		color: #242424;
	}

	.add-to-cart-num {
		position: relative;
	}

	.add-to-cart-num-num {
		position: absolute;
		top: -5px;
		right: -10px;
		color: #fff;
		font-size: 10px;
		background: #ff0000;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		text-align: center;
		line-height: 18px;
		z-index: 5;
	}
</style>

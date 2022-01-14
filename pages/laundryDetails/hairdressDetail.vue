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
		<view class="content-title flex" :class="{'st':true,'sticky-fixed':isF}">
			<view class="flex-1" :class="recommendIndex === 1?'active':''" @click="toRecommend(1)">商品详情</view>
			<view class="flex-1" :class="recommendIndex === 2?'active':''" @click="toRecommend(2)">用户评价</view>
			<view class="flex-1" :class="recommendIndex === 3?'active':''" @click="toRecommend(3)">购买须知</view>
		</view>
		<view class="content">
			<view v-if="contentIndex === 1">
				<rich-text :nodes="goods.info"></rich-text>
			</view>
			<view v-if="contentIndex === 3">
				<rich-text :nodes="goods.notice"></rich-text>
			</view>
		</view>
		<view class="add-to-cart flex">
			<view class="add-to-cart-num flex-1">
				总价：
				<price :price="goods.price" style="display: inline-block;"></price>
			</view>
			<view class="add-to-cart-btn flex-1" @click="buy">立即抢购</view>
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
				recommendIndex: 1,
				contentIndex: 1,
				isF: false,
				id: 0,
				type: 1 //1为施太洗护商品详情， 10为水果商品详情，
			}
		},
		onLoad(option) {
			this.type = option.type
			this.id = parseInt(option.id)
			this.fetch(option.id)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			//#ifdef H5
			this.isF = true
			// #endif
			// #ifndef H5
			if (this.yuanH > e.scrollTop) {
				this.isF = false
			} else {
				this.isF = true
			}
			// #endif
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
			buy(){
				this.goods.totalPrice = this.goods.price
				uni.setStorageSync('HJKJ-hairdress', this.goods)
				uni.navigateTo({
					url: '/pages/order/preOrder/index?type=' + this.type
				})
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

	.st {
		height: 100rpx;
		width: 750rpx;
		background-color: #fff;
		z-index: 999;
		/* top: 300upx; */
	}

	.sticky-fixed {
		/* #ifdef H5 */
		position: sticky;
		top: 44px;
		/* #endif */
		/* #ifndef H5 */
		position: fixed;
		top: 0;
		/* #endif */
		z-index: 999;
		height: 50px;
		line-height: 50px;
		background: #fff;
	}

	.content-title {
		font-size: 14px;
		color: #1a1a1a;
		text-align: center;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #e6e6e6;
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
		text-align: left;
		line-height: 40px;
	}
</style>

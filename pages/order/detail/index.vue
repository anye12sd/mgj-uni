y<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<!-- <view class="detail-status">
			<view class="detail-status-title">订单已完成</view>
			<view class="detail-status-info">感谢你对麻管家的信任，期待再次光临</view>
			<view class="detail-status-btn flex">
				<view class="detail-status-btn-left flex-1">再来一单</view>
				<view class="detail-status-btn-right flex-1">我要评价</view>
			</view>
		</view> -->
		<view class="order-list" v-if="order.shop">
			<view class="list-header flex">
				<view class="list-header-shop-name">{{order.shop.name}}</view>
			</view>
			<view class="list-box" :class="{'auto-height': allGoods}">
				<view class="list" v-for="(item, index) in order.order_info" :key="index">
					<view class="list-middle flex">
						<view class="list-middle-shop-img">
							<img class="list-middle-shop-img-img" :src="item.goods_img" alt="">
						</view>
						<view class="list-middle-shop-info">
							<view class="list-middle-shop-name">{{item.goods_name}}</view>
							<view class="list-middle-shop-num">x{{item.goods_count}}</view>
						</view>
						<view class="list-middle-shop-total flex-1">
							<view class="list-middle-shop-price">
								<view class="list-middle-shop-price-price">￥{{item.goods_price * item.goods_count}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="order.order_info.length > 2" class="more-btn" :class="{'active': allGoods}" @click="showMore">
			</view>
			<view class="order-list-info">
				<view class="order-list-info-content flex">
					<view class="order-list-info-content-left">配送费</view>
					<view class="order-list-info-content-right">￥{{order.run_money}}</view>
				</view>
				<view class="order-list-info-content flex">
					<view class="order-list-info-content-left">优惠券</view>
					<view class="order-list-info-content-right order-list-info-content-right1">-￥{{order.coupon_money}}
					</view>
				</view>
			</view>
			<view class="total-num-box flex">
				<view class="total-discount flex-1">已优惠 {{order.coupon_money}}</view>
				<view class="total-num flex">合计<price class="total-num-price" :price="order.pay_money"></price>
				</view>
			</view>
		</view>
		<view class="order-detail">
			<view class="order-detail-list flex">
				<view class="order-detail-list-left">订单编号</view>
				<view class="order-detail-list-right">{{order.order_num}}</view>
			</view>
			<view class="order-detail-list flex">
				<view class="order-detail-list-left">订单时间</view>
				<view class="order-detail-list-right">{{timeFormatter(order.create_time * 1000)}}</view>
			</view>
			<!-- <view class="order-detail-list flex">
				<view class="order-detail-list-left">订单状态</view>
				<view class="order-detail-list-right">已配送</view>
			</view> -->
			<view class="order-detail-list flex">
				<view class="order-detail-list-left">支付方式</view>
				<view class="order-detail-list-right">{{getPayType(order.pay_type)}}</view>
			</view>
			<view class="order-detail-list flex">
				<view class="order-detail-list-left">订单备注</view>
				<view class="order-detail-list-right">{{order.user_mark || '无'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import price from '../../../components/price.vue'
	import {
		getOrderDetail
	} from '../../../config/api.js'
	export default {
		components: {
			price
		},
		data() {
			return {
				navbar:{
					title: '订单详情',
					custom: false
				},
				order: "",
				allGoods: false
			}
		},
		onLoad(option) {
			this.fetch(option.id)
		},
		methods: {
			fetch(id) {
				let data = {
					key: id
				}
				uni.showLoading({
					title: '加载中'
				});
				getOrderDetail(data).then((res) => {
					this.order = res
					uni.hideLoading()
				})
			},
			showMore() {
				this.allGoods = !this.allGoods
			},
			timeFormatter(e) {
				let year = new Date(e).getFullYear() + '-'
				let month = (new Date(e).getMonth() + 1 < 10 ? '0' + (new Date(e).getMonth() + 1) : new Date(e)
					.getMonth() + 1) + '-'
				let date = (new Date(e).getDate() < 10 ? '0' + new Date(e).getDate() : new Date(e).getDate()) + ' '
				let hour = (new Date(e).getHours() < 10 ? '0' + new Date(e).getHours() : new Date(e).getHours()) + ':'
				let minute = (new Date(e).getMinutes() < 10 ? '0' + new Date(e).getMinutes() : new Date(e).getMinutes())
				return year + month + date + hour + minute
			},
			getPayType(num) {
				let type
				switch (num) {
					case 0:
						type = '未支付'
						break;
					case 1:
						type = '微信支付'
						break;
					case 2:
						type = '支付宝'
						break;
					case 2:
						type = '余额'
						break;
					default:
						type = '其它'
				}
				return type
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: #f5f5f5;
		padding: 0 12px
	}

	.detail-status {
		background: #fff;
		padding-bottom: 12px;
		border-radius: 4px;
	}

	.detail-status-title {
		padding-top: 24px;
		color: #000;
		font-size: 19px;
		font-weight: bold;
		text-align: center;
	}

	.detail-status-info {
		font-size: 14px;
		color: #000;
		text-align: center;
		margin-top: 12px;
	}

	.detail-status-btn {
		width: 240px;
		text-align: center;
		margin: 0 auto;
		margin-top: 12px;
	}

	.detail-status-btn-right {
		color: #fff;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		font-size: 14px;
		margin-left: 20px;
		border-radius: 40px;
		height: 32px;
		line-height: 32px;
	}

	.detail-status-btn-left {
		color: #FF8C4E;
		background: #fff;
		font-size: 14px;
		border: 1px solid #FF8C4E;
		border-radius: 40px;
		height: 32px;
		line-height: 32px;
	}

	.order-list {
		margin-top: 6px;
		background: #fff;
		padding: 12px;
		border-radius: 4px;
	}

	.list-box {
		height: 170px;
		overflow: hidden;
	}

	.list-box.auto-height {
		height: auto
	}

	.list {
		border-radius: 4px;
	}

	.list-header {
		border-bottom: 1px solid #f5f5f5;
		padding-bottom: 12px;
	}

	.list-header-shop-name {
		color: #000;
		font-size: 14px;
		background: url(../../../static/img/shop-header-img@2x.png) no-repeat left;
		background-size: 25px;
		height: 25px;
		line-height: 25px;
		padding-left: 37px;
		position: relative;
	}

	.list-header-shop-name:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: -10px;
		margin-top: 9px
	}

	.list-header-status {
		color: #666;
		font-size: 11px;
		line-height: 25px;
	}

	.list-middle {
		padding: 12px 0;
	}

	.list-middle-shop-img {
		width: 60px;
		height: 60px;
	}

	.list-middle-shop-img .list-middle-shop-img-img {
		width: 100%;
	}

	.list-middle-shop-name {
		font-weight: bold;
		font-size: 14px;
		color: #1a1a1a;
	}

	.list-middle-shop-info {
		margin-left: 12px;
	}

	.list-middle-shop-price {
		font-size: 14px;
		color: #1a1a1a;
		margin-top: 3px;
	}

	.list-middle-shop-num {
		font-size: 11px;
		color: #666666;
		margin-top: 25px;
	}

	.list-middle-shop-total {
		text-align: right;
		margin-top: 35px;
	}

	.more-btn {
		width: 100%;
		height: 16px;
		position: relative;
	}

	.more-btn:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 0 1px 1px 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		left: calc(50vw - 28px);
	}

	.more-btn.active:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 0 0 1px;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		left: calc(50vw - 28px);
		margin-top: 6px;
	}

	.order-list-info-content {
		padding-top: 12px;
		justify-content: space-between;
		font-size: 14px;
		color: #000;
	}

	.order-list-info-content-right {
		color: #1a1a1a;
	}

	.order-list-info-content-right1 {
		color: #FF0000;
	}

	.total-num-box {
		margin-top: 28px;
		font-size: 12px;
		color: #000;
		height: 24px;
		line-height: 24px;
	}

	.total-num {
		display: inline-block;
		font-size: 14px;
	}

	.total-discount {
		text-align: right;
	}

	.total-num-price {
		display: inline-block;
		margin-left: 4px;
	}

	.total-discount {
		margin-right: 6px;
	}

	.order-detail {
		border-radius: 4px;
		margin-top: 6px;
		background: #fff;
		padding: 12px;
		font-size: 12px;
		color: #999;
	}

	.order-detail-list {
		padding-bottom: 12px;
		justify-content: space-between;
	}

	.order-detail-list-right {
		font-size: 12px;
		color: #000;
	}
</style>

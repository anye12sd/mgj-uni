<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<u-tabs :current="current" @change="tabChange" :list="list" lineWidth="30" lineColor="#FF8C4E" :activeStyle="{
								color: '#000',
								fontWeight: 'normal',
								fontSize: '14px',
							}" :inactiveStyle="{
								color: '#666',
								fontSize: '14px',
							}" itemStyle="padding: 12px">
		</u-tabs>
		<view class="order-list">
			<view class="list" v-for="(item, index) in orderList" :key="index">
				<view class="list-header flex">
					<view class="list-header-shop-name" @click="toShopDetail(item)">{{item.shop.name}}</view>
					<view class="list-header-status">{{getPayType(item.type)}}</view>
				</view>
				<template v-if="item.order_info.length == 1">
					<view class="list-middle flex" @click="toDetail(item)">
						<view class="list-middle-shop-img">
							<img class="list-middle-shop-img-img" :src="item.order_info[0].goods_img" alt="">
						</view>
						<view class="list-middle-shop-info">
							<view class="list-middle-shop-name">{{item.order_info[0].goods_name}}</view>
							<view class="list-middle-shop-price">￥{{item.pay_money}}</view>
							<view class="list-middle-shop-num">x{{item.order_info[0].goods_count}}</view>
						</view>
						<view class="list-middle-shop-total flex-1">
							<view class="list-middle-shop-price">
								<price class="list-middle-shop-price-price" :price="item.pay_money"></price>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="list-middle" @click="toDetail(item)">
						<view class="goods-show flex">
							<view class="goods-img flex-1 flex">
								<view v-for="(item1, index1) in item.order_info" :key="index1">
									<image mode="widthFix" class="goods-img-img" :src="item1.goods_img"></image>
									<view class="goods-img-text">{{item1.goods_name}}</view>
								</view>
							</view>
							<view class="total_num">
								<view>
									<price :price="item.pay_money"></price>
								</view>
								<view class="total_count">共{{item.total_count}}件</view>
							</view>
						</view>
					</view>
				</template>
				<view class="list-footer flex">
					<view class="list-footer-left">
						下单时间：{{timeFormatter(item.create_time * 1000)}}
					</view>
					<template v-if="item.type == 1">
						<view class="list-footer-right flex">
							<view class="list-footer-del">删除订单</view>
							<view class="list-footer-again" @click="toPay(item)">去支付</view>
						</view>
					</template>
					<template v-if="item.type == 2">
						<view class="list-footer-right flex">
							<view class="list-footer-cancel" @click="cancelOrder(item)">取消订单</view>
						</view>
					</template>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="show" content='确认取消订单吗？' @confirm="confirm" @cancel="cancel" :showCancelButton="true"></u-modal>
		<view class="dixian" v-if="dixianShow">我也是有底线的</view>
	</view>
</template>

<script>
	import price from '../../../components/price.vue'
	import {
		getOrderList, backOrder
	} from '../../../config/api.js'
	export default {
		components: {
			price
		},
		data() {
			return {
				navbar:{
					title: '我的订单',
					custom: false
				},
				list: [{
					name: '全部订单',
				}, {
					name: '未支付'
				}, {
					name: '已支付'
				}, {
					name: '待评价'
				}],
				current: 0,
				orderList: [],
				page: 1,
				last_page: 0,
				dixianShow: false,
				show: false,
				id: ""
			}
		},
		onLoad(option) {
			this.current = option.index || 0
			this.fetch()
		},

		methods: {
			fetch() {
				uni.showLoading({
					title: '加载中'
				});
				let data = {
					type: this.current,
					page: this.page
				}
				getOrderList(data).then((res) => {
					uni.hideLoading()
					if (res.total == 0) {
						console.log("没有订单")
						return
					}
					let orderList = res.data
					orderList.map((item) => {
						let total_count = 0
						item.order_info.map((item1) => {
							total_count += item1.goods_count
						})
						item.total_count = total_count
					})
					this.orderList = this.orderList.concat(orderList)
					this.last_page = res.last_page
				})
			},
			onReachBottom() {
				if (this.page == this.last_page) {
					this.dixianShow = true
					return
				}
				this.page = this.page + 1
				this.fetch()
			},
			tabChange(e) {
				if (this.current == e.index) {
					return
				}
				this.orderList = []
				this.dixianShow = false
				this.current = e.index
				this.page = 1
				this.fetch()
			},
			getPayType(num) {
				let type = ""
				switch (num) {
					case 1:
						type = "未支付"
						break;
					case 2:
						type = "已支付"
						break;
					case 3:
						type = "确认接单"
						break;
					case 4:
						type = "已完成"
						break;
					case 5:
						type = "已退单"
						break;
					case 99:
						type = "已关闭"
						break;
					default:
						type = "其它"
				}
				return type
			},
			toPay(item){
				uni.navigateTo({
					url: '/pages/order/payOrder/index?id=' + item.id
				})
			},
			timeFormatter(e) {
				let year = new Date(e).getFullYear() + '-'
				let month = (new Date(e).getMonth() + 1 < 10 ? '0' + (new Date(e).getMonth() + 1) : new Date(e).getMonth() + 1) + '-'
				let date = (new Date(e).getDate() < 10 ? '0' + new Date(e).getDate() : new Date(e).getDate()) + ' '
				let hour = (new Date(e).getHours() < 10 ? '0' + new Date(e).getHours() : new Date(e).getHours()) + ':'
				let minute = (new Date(e).getMinutes() < 10 ? '0' + new Date(e).getMinutes() : new Date(e).getMinutes())
				return year + month + date + hour + minute
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/order/detail/index?id=' + item.id
				})
			},
			toShopDetail(item) {
				uni.navigateTo({
					url: '/pages/shop/detail/index?id=' + item.shop_id
				})
			},
			cancelOrder(item){
				this.show = true
				this.id = item.id
			},
			confirm(){
				let data = {
					key: this.id
				}
				uni.showLoading({
					title: '加载中'
				})
				backOrder(data).then((res) => {
					this.show = false
					this.$refs.uToast.show({
						type: 'success',
						message: '成功取消订单',
					})
					uni.hideLoading()
				})
			},
			cancel(){
				this.show = false
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: #f5f5f5;
	}

	.order-list {
		padding: 0 12px;
	}

	.list {
		background: #fff;
		padding: 12px;
		margin-top: 12px;
		border-radius: 4px;
	}

	.list-header {
		justify-content: space-between;
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
		padding: 24px 0;
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
		margin-top: 3px;
	}

	.list-middle-shop-total {
		text-align: right;
		margin-top: 35px;
	}

	.list-footer-left {
		color: #666;
		font-size: 11px;
		height: 20px;
		line-height: 20px;
	}

	.list-footer {
		justify-content: space-between;
	}

	.list-footer-right {
		text-align: right;
	}

	.list-footer-del {
		font-size: 14px;
		color: #999;
		height: 20px;
		line-height: 20px;
		padding: 0 6px;
		border: 1px solid #999;
		border-radius: 4px;
	}

	.list-footer-again {
		font-size: 14px;
		color: #1a1a1a;
		height: 20px;
		line-height: 20px;
		padding: 0 6px;
		border: 1px solid #999;
		border-radius: 4px;
		margin-left: 6px;
	}

	.list-footer-cancel {
		font-size: 14px;
		color: #1a1a1a;
		height: 20px;
		line-height: 20px;
		padding: 0 6px;
		border: 1px solid #999;
		border-radius: 4px;
		margin-left: 6px;
	}

	.goods-show {
		position: relative;
		justify-content: space-between;
	}

	.goods-img-text {
		width: 45px;
		color: #999;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box; // 作为弹性伸缩盒子模型显示。
		-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp: 1; // 显示的行
		text-align: center;
	}

	.goods-text {
		font-size: 14px;
		color: #000;
		line-height: 45px;
		padding-right: 18px;
	}

	.goods-img-img {
		width: 45px;
		height: 45px;
		margin-right: 6px;
	}

	.goods-img {
		overflow: hidden;
	}

	.total_num {
		padding-left: 15px;
		margin-top: 15px;
	}

	.total_count {
		text-align: right;
		font-size: 12px;
		color: #999;
		margin-top: 3px;
	}
</style>

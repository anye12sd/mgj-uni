<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<!--
			<view class="detail">
				<view class="detail-time">
					2021年11月20日
				</view>
				<view class="detail-info flex">
					<view class="detail-info-left">
						<view class="detail-title">账户充值</view>
						<view class="detail-dealed">交易后余额：200</view>
					</view>
					<view class="detail-info-right">
						<view class="detail-num">+100.00</view>
					</view>
				</view>
				<view class="detail-info flex">
					<view class="detail-info-left">
						<view class="detail-title">账户充值</view>
						<view class="detail-dealed">交易后余额：200</view>
					</view>
					<view class="detail-info-right">
						<view class="detail-num">+100.00</view>
					</view>
				</view>
			</view>
			<view class="detail">
				<view class="detail-time">
					2021年11月20日
				</view>
				<view class="detail-info flex">
					<view class="detail-info-left">
						<view class="detail-title">账户充值</view>
						<view class="detail-dealed">交易后余额：200</view>
					</view>
					<view class="detail-info-right">
						<view class="detail-num">+100.00</view>
					</view>
				</view>
				<view class="detail-info flex">
					<view class="detail-info-left">
						<view class="detail-title">账户充值</view>
						<view class="detail-dealed">交易后余额：200</view>
					</view>
					<view class="detail-info-right">
						<view class="detail-num">+100.00</view>
					</view>
				</view>
			</view>
		-->
		<view class="detail-info flex" v-for="(item, index) in list">
			<view class="detail-info-left">
				<view class="detail-title">{{item.info}}</view>
				<view class="detail-dealed">{{timeFormatter(item.create_time * 1000)}}</view>
				<view class="detail-dealed">交易后余额：{{item.last_balance}}</view>
			</view>
			<view class="detail-info-right">
				<view class="detail-num">{{item.type == 1 ? '+' + item.change : item.change}}</view>
			</view>
		</view>
		<view class="dixian" v-if="dixianShow">我也是有底线的</view>
	</view>
</template>

<script>
	import {getBalanceLog} from '../../../config/api.js'
	export default{
		data(){
			return {
				navbar:{
					title: '账户明细',
					custom: false,
				},
				list: [],
				page: 1,
				dixianShow: false
			}
		},
		onLoad() {
			this.fetch()
		},
		methods: {
			fetch(){
				let data = {
					page: this.page
				}
				uni.showLoading({
					title: '加载中'
				})
				getBalanceLog(data).then((res) => {
					if(res.total == 0){
						uni.hideLoading()
						return
					}
					console.log(res)
					this.list = res.data
					uni.hideLoading()
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
			timeFormatter(e) {
				let year = new Date(e).getFullYear() + '-'
				let month = (new Date(e).getMonth() + 1 < 10 ? '0' + (new Date(e).getMonth() + 1) : new Date(e)
					.getMonth() + 1) + '-'
				let date = (new Date(e).getDate() < 10 ? '0' + new Date(e).getDate() : new Date(e).getDate()) + ' '
				let hour = (new Date(e).getHours() < 10 ? '0' + new Date(e).getHours() : new Date(e).getHours()) + ':'
				let minute = (new Date(e).getMinutes() < 10 ? '0' + new Date(e).getMinutes() : new Date(e).getMinutes())
				return year + month + date + hour + minute
			},
		}
	}
</script>

<style scoped>
	.page{
		min-height: 100vh;
		background: #f5f5f5;
		padding: 0 12px
	}
	.detail-time{
		color: #1a1a1a;
		padding: 12px 0;
		font-size: 14px;
	}
	.detail-info{
		background: #fff;
		padding: 12px;
		border-radius: 4px;
		justify-content: space-between;
		margin-top: 6px;
	}
	.detail-title{
		font-size: 16px;
		color: #1a1a1a;
	}
	.detail-dealed{
		font-size: 12px;
		color: #999;
		margin-top: 6px;
	}
	.detail-num{
		margin-top: 10px;
		padding-right: 12px;
	}
	.detail-num:after{
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
		right: 25px;
		margin-top:6px
	}
</style>

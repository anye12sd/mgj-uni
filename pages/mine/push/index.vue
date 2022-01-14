<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="back-header"></view>
		<view class="push-header">
			<view class="push-header-title">100.00</view>
			<view class="push-explain push-header-explain" @click="showHint()">可提现余额</view>
			<view class="flex push-header-middle">
				<view class="push-header-middle-left flex-1">
					<view class="push-header-middle-num">100.00</view>
					<view class="push-explain push-header-middle-explain" @click="showHint()">总收益</view>
				</view>
				<view class="push-header-middle-right flex-1">
					<view class="push-header-middle-num">100.00</view>
					<view class="push-explain push-header-middle-explain" @click="showHint()">不可提现金额</view>
				</view>
			</view>
			<view class="push-header-btn" @click="toWithdraw()">提现</view>
		</view>
		<view class="recommend">
			<view class="recommend-header flex">
				<view class="recommend-header-title">我的推荐</view>
				<view class="recommend-header-btn" @click="toProfit()">收益明细</view>
			</view>
			<view class="flex info">
				<view class="info-left flex-1">
					<view>
						<text class="info-name">门店</text>
						<text class="info-text"><text class="info-num">1</text>家</text>
					</view>
					<view style="margin-top: 13px;">
						<text class="info-right-name">累计收益</text>
						<text class="info-text"><text class="info-num">+10.00</text></text>
					</view>
				</view>
				<view class="info-right flex-1">
					<view>
						<text class="info-name">代理商</text>
						<text class="info-text"><text class="info-num">1</text>家</text>
					</view>
					<view style="margin-top: 13px;">
						<text class="info-right-name">累计收益</text>
						<text class="info-text"><text class="info-num">+10.00</text></text>
					</view>
				</view>
			</view>
		</view>
		<view class="hint">
			<u-popup :show="serviceSelectShow" @close="close" mode="bottom">
				<view class="hint-box">
					<view class="hint-title" @click="close()">收益说明</view>
					<view class="hint-content">
						<view class="hint-content-title">可提现余额</view>
						<view class="hint-content-text">用户订单已完成15天后已经划分至账户的提成金额，该金额可进行提现操作。</view>
					</view>
					<view class="hint-content">
						<view class="hint-content-title">不可体现金额</view>
						<view class="hint-content-text">用户订单已完成，但需要15天后才会划分至账户的订单提成，该金额处于冻结状态暂不可提现。</view>
					</view>
					<view class="hint-content">
						<view class="hint-content-title">总收益</view>
						<view class="hint-content-text">您注册麻管家至今为止的所有收益总计。</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				navbar:{
					title: '我的推送',
					custom: false
				},
				serviceSelectShow: false
			}
		},
		methods: {
			showHint(){
				this.serviceSelectShow = true
			},
			close(){
				this.serviceSelectShow = false
			},
			toProfit(){
				uni.navigateTo({
					url: '/pages/mine/profit/index'
				})
			},
			toWithdraw(){
				uni.navigateTo({
					url: '/pages/mine/withdraw/index'
				})
			},
		}
	}
</script>

<style scoped>
	.page{
		min-height: calc(100vh - 44px);
		background: #f5f5f5;
	}
	.back-header{
		height: 60px;
		width: 100%;
		background: linear-gradient(270deg, #FF8C4E 0%, #FC6767 100%);;
	}
	.push-header{
		padding: 30px 0 50px 0;
		margin: 0 12px;
		background: #fff;
		margin-top: -60px;
		border-radius: 4px;
		text-align: center;
	}
	.push-header-title{
		font-weight: bold;
		font-size: 31px;
		color: #1a1a1a;
	}
	.push-explain{
		font-size: 12px;
		color: #999;
		margin-top: 8px;
		background: url(../../../static/img/answer-mark.png) no-repeat right;
		background-size: 12px;
		display: inline-block;
		padding-right: 16px;
	}
	.push-header-middle{
		justify-content: space-between;
		margin-top: 30px;
	}
	.push-header-middle-num{
		font-size: 14px;
		color: #1a1a1a;
	}
	.push-header-middle-right{
		position: relative;
		border-left: 1px solid #e6e6e6;
	}
	.push-header-btn{
		width: 140px;
		height: 30px;
		line-height: 30px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		border-radius: 30px;
		color: #fff;
		font-size: 16px;
		text-align: center;
		margin: 0 auto;
			margin-top: 40px;
	}
	.recommend{
		margin-top: 12px;
		margin: 12px 0;
		padding: 0 12px;
	}
	.recommend-header{
		background: #fff;
		padding: 12px;
		justify-content: space-between;
		border-radius: 4px 4px 0 0;
		border-bottom: 1px solid #e6e6e6;
	}
	.recommend-header-title{
		color: #1a1a1a;
		font-size: 14px;
		font-weight: bold;
	}
	.recommend-header-btn{
		font-size: 12px;
		color: #1a1a1a;
		position: relative;
		padding-right: 12px;
	}
	.recommend-header-btn:after{
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
		right: 0px;
		margin-top: 4px;
	}
	.info{
		padding: 18px 12px;
		background: #fff;
	}
	.info-name{
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
	}
	.info-text{
		font-size: 12px;
		color: #666;
		margin-left: 12px;
	}
	.info-num{
		color: #ff0000;
	}
	.info-right-name{
		font-size: 11px;
		color: #999;
	}
	.hint{
		position: fixed;
		bottom: 100px;
		left: 0;
		right: 0;
		background: #fff;
	}
	.hint-box{
		padding: 0 12px;
			padding-bottom: 20px;
	}
	.hint-title{
		padding: 12px 0;
		text-align: center;
		color: #000;
		font-size: 16px;
		font-weight: bold;
		background: url(../../../static/img/close-square@2x.png) no-repeat right;
		background-size: 18px;
	}
	.hint-content{
		padding: 12px 0;
		border-bottom: 1px solid #e6e6e6;
	}
	.hint-box .hint-content:nth-last-child(1){
		border-bottom: 0;
	}
	.hint-content-title{
		font-size: 14px;
		color: #000;
	}
	.hint-content-text{
		font-size: 12px;
		color: #666;
		margin-top: 3px;
	}
</style>

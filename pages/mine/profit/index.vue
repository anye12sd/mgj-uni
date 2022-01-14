<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
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
	</view>
</template>

<script>
	export default{
		data(){
			return {
				navbar:{
					title: '收益明细',
					custom: false
				},
			}
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
		justify-content: space-between
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

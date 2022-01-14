<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="box">
			<view class="content">
				<view class="content-title-num">-100.00</view>
				<view class="content-title-name">余额支付</view>
			</view>
			<view class="info">
				<view class="flex">
					<view class="info-left">交易详情</view>
					<view class="info-right">支出</view>
				</view>
				<view class="flex">
					<view class="info-left">订单说明</view>
					<view class="info-right">施太洗护商品订单支付</view>
				</view>
				<view class="flex">
					<view class="info-left">订单编号</view>
					<view class="info-right">231651321651561</view>
				</view>
				<view class="flex">
					<view class="info-left">支付时间</view>
					<view class="info-right">2021-11-21 11:11:11</view>
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
					title: '交易详情',
					custom: false
				},
			}
		}
	}
</script>

<style scoped>
	.page{
		min-height: calc(100vh - 68px);
		background: #f5f5f5;
		padding: 12px
	}
	.box{
		background: #fff;
		border-radius: 4px;
		margin-top: 20px;
	}
	.content{
		padding: 0 12px;
		text-align: center;
		position: relative;
	}
	.content:before{
		content: "";
		position: absolute;
		background: url(../../../static/img/order-detail@2x.png) no-repeat center;
		background-size: 40px;
		width: 40px;
		height: 40px;
		top: -16px;
		left: calc(50vw - 32px)
	}
	.content-title-num{
		font-size: 24px;
		font-weight: bold;
		color: #1a1a1a;
		padding-top: 38px;
	}
	.content-title-name{
		font-size: 12px;
		color: #1a1a1a;
		margin-top: 6px;
		padding-bottom: 12px;
		border-bottom: 1px solid #e6e6e6;
	}
	.info{
		padding: 0 12px;
		padding-bottom: 30px;
	}
	.info .flex{
		margin-top: 12px;
		justify-content: space-between;
	}
	.info-left{
		font-size: 12px;
		color: #999;
	}
	.info-right{
		font-size: 12px;
		color: #1a1a1a;
	}
</style>

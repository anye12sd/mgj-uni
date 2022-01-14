<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="header">
			<view class="title">
				账户可提现金额：1220.00元
			</view>
			<view class="flex header-content">
				<input type="digit" placeholder="请输入提现金额" class="flex-1" confirm-type="done">
				<view class="header-content-all">全部</view>
			</view>
		</view>
		<view class="withdraw-content">
			<view class="to-wechat radio" :class="{'active': current == 0}" @click="toSelect(0)">
				提现至微信
			</view>
		</view>
		<view class="withdraw-content">
			<view class="to-bank radio" :class="{'active': current == 1}" @click="toSelect(1)">
				提现至银行卡
			</view>
			<view class="card-select">
				交通银行 139**********1616
			</view>
		</view>
		<view class="confirm">确认提现</view>
	</view>
</template>

<script>
	import {getBalance} from '../../../config/api.js'
	export default{
		data(){
			return {
				navbar:{
					title: '余额提现',
					custom: false
				},
				current: 0,
				balance: 0
			}
		},
		onLoad(){
			this.fetch()
		},
		methods: {
			toSelect(id){
				if(id == this.current){
					return
				}
				this.current = id
			},
			fetch(){
				uni.showLoading({
					title: '加载中'
				})
				getBalance().then((res) => {
					console.log(res)
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
	.page{
		background: #f5f5f5;
		min-height: calc(100vh - 12px);
		padding: 12px;
		padding-top: 0;
	}
	.header{
		padding: 12px;
		background: #fff;
		border-radius: 4px;
		padding-bottom: 0;
	}
	.title{
		padding-bottom: 12px;
		border-bottom: 1px solid #f5f5f5;
		font-size: 12px;
		color: #1a1a1a;
	}
	.header-content{
		padding: 18px 0;
		position: relative;
	}
	.header-content .flex-1{
		font-size: 16px;
		color: #666;
		padding-left: 14px;
	}
	.header-content:before{
		content: '￥';
		font-size: 16px;
		color: #1a1a1a;
	}
	.header-content-all{
		color: #FF8C4E;
		font-size: 14px;
		line-height: 1.5;
	}
	.withdraw-content{
		padding:0 12px;
		background: #fff;
		margin-top: 12px;
		border-radius: 4px;
	}
	.to-wechat{
		height: 44px;
		line-height: 44px;
		font-size: 14px;
		color: #1a1a1a;
		position: relative;
		padding-left: 30px;
	}
	.to-wechat::before{
		content: "";
		background: url(../../../static/img/wechat.png) no-repeat center;
		background-size: 22px;
		display: inline-block;
		width: 22px;
		height: 22px;
		position: absolute;
		margin-top: 10px;
		left: 0;
	}
	.to-bank{
		height: 44px;
		line-height: 44px;
		font-size: 14px;
		color: #1a1a1a;
		position: relative;
		padding-left: 30px;
	}
	.to-bank::before{
		content: "";
		background: url(../../../static/img/bank-card.png) no-repeat center;
		background-size: 22px;
		display: inline-block;
		width: 22px;
		height: 22px;
		position: absolute;
		margin-top: 10px;
		left: 0;
	}
	.radio::after{
		content: "";
		display: inline-block;
		background: url(../../../static/img/checkbox.png) no-repeat center;
		background-size: 20px;
		width: 20px;
		height: 20px;
		position: absolute;
		margin-top: 12px;
		right: 0;
	}
	.radio.active::after{
		content: "";
		display: inline-block;
		background: url(../../../static/img/checkbox-active.png) no-repeat center;
		background-size: 20px;
		width: 20px;
		height: 20px;
		position: absolute;
		margin-top: 12px;
		right: 0;
	}
	.card-select{
		height: 40px;
		line-height: 40px;
		font-size: 12px;
		color: #1a1a1a;
		padding-left: 30px;
		border-top: 1px solid #f5f5f5;
		position: relative;
	}
	.card-select:after {
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
		right: 8px;
		top: 16px
	}
	.confirm{
		height: 50px;
		line-height: 50px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		font-size: 16px;
		color: #fff;
		text-align: center;
		border-radius: 50px;
		margin-top: 50px;
	}
</style>

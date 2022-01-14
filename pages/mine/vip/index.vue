<template>
	<view class="page" v-if="info.right">
		<headerNav :value="navbar"></headerNav>
		<view class="head-back"></view>
		<view class="header">
			<view class="header-info flex">
				<view class="header-avatar">
					<image mode="widthFix" :src="info.userInfo.avatar"></image>
				</view>
				<view class="header-name">
					<view class="header-nickname" :class="{'vip-active': isVip == 1}">{{info.userInfo.nickname}}</view>
					<view class="header-time" v-if="info.isVip">{{info.userInfo.vip_end_time}}到期</view>
				</view>
				<view class="showCode-btn flex-1" v-if="info.isVip">
					<image mode="widthFix" src="../../../static/img/vip-code-btn.png" @click="showCode()"></image>
				</view>
			</view>
			<view class="header-text" v-if="!isVip">
				预计可省<text>1000.00</text>元
			</view>
			<view v-else>
				
			</view>
		</view>
		<view class="push-box">
			<view class="push-title">我的推广</view>
			<view class="push-profit">0.00</view>
			<view class="push-text">推广总收益</view>
		</view>
		<view class="receive flex">
			<view class="receive-text">我的领取</view>
			<view class="receive-num">0<text>次</text></view>
		</view>
		<view class="rights">
			<view class="rights-title">会员权益</view>
			<view class="rights-box flex">
				<view class="rights-list" v-for="(item, index) in info.right" :key="index">
					<image class="rights-img" mode="widthFix" :src="item.img"></image>
					<view class="rights-text">{{item.name}}</view>
				</view>
			</view>
		</view>
		<view class="openVip" @click="openVip()">开通会员</view>
		<view class="vip-purchase">
			<u-popup :show="vipPurchaseShow" @close="close" mode="bottom">
				<view class="vip-purchase-box">
					<view class="vip-purchase-title" @click="close">
						开通会员
					</view>
					<view class="vip-purchase-content">
						<view class="vip-purchase-content-title">包年服务<text>（线上线下同享）</text></view>
						<view class="vip-purchase-content-num">￥<text>{{info.vip_price.split(".")[0]}}</text>.{{info.vip_price.split(".")[1]}}</view>
						<view class="vip-purchase-content-average">平均￥{{info.vipPrice * 0.125}}元/月</view>
					</view>
					<view class="purchase" @click="sureOpen()">确认开通</view>
					<view class="checkbox-box flex">
						<u-checkbox-group>
							<!-- <u-checkbox v-model="checked" activeColor="#FF8C4E" shape="circle" :label="'开通前阅读《麻管家会员服务协议》及《隐私协议》及《开票须知》'" labelSize="12" labelColor="#999"></u-checkbox> -->
							<u-checkbox v-model="checked" activeColor="#FF8C4E" shape="circle" @change="checkboxChange"></u-checkbox>
						</u-checkbox-group>
						<view class="checkbox-box-text flex-1">开通前阅读《麻管家会员服务协议》及《隐私协议》及《开票须知》</view>
					</view>
				</view>
			</u-popup>
		</view>
		<u-transition :show="vipCodeShow">
		        <view class="vip-code-box">
					<view class="vip-code-header">
						<image mode="widthFix" src="../../../static/img/vip-header@2x.png"></image>
					</view>
					<view class="tiaoxingma">
						<image mode="widthFix" src="../../../static/img/tiaoxingma@2x.png"></image>
						<view class="tiaoxingma-text">出示领取礼品</view>
					</view>
					<view class="xiaochengxuma">
						<image mode="widthFix" src="../../../static/img/taiyangma@2x.png"></image>
						<view class="tiaoxingma-text">长按保存到相册</view>
					</view>
				</view>
				<view class="vip-code-box-close" @click="vipCodeShow = false">
					<image mode="widthFix" src="../../../static/img/close@2x.png"></image>
				</view>
				<view class="vip-code-box-shadow" @click="vipCodeShow = false"></view>
		    </u-transition>
			<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		getVipCenter,
		openVip
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar:{
					title: '会员中心',
					custom: false
				},
				isVip: 1,
				info: {},
				vipPurchaseShow: false,
				checked: false,
				vipCodeShow: false
			}
		},
		onLoad() {
			this.fetch()
		},
		methods: {
			fetch() {
				uni.showLoading({
					title: '加载中'
				})
				getVipCenter().then((res) => {
					console.log(res)
					this.info = res
					this.info.vip_price = res.vipPrice + ""
					uni.hideLoading()
				})
			},
			openVip() {
				this.vipPurchaseShow = true
			},
			close(){
				this.vipPurchaseShow = false
			},
			showCode(){
				this.vipCodeShow = true
			},
			checkboxChange(){
				this.checked = !this.checked
			},
			sureOpen(){
				if(!this.checked){ 
					this.$refs.uToast.show({
						type: 'error',
						message: '请先同意协议',
					})
					return
				}
				uni.showLoading({
					title: '加载中'
				})
				openVip().then((res) => {
					console.log(res)
					uni.hideLoading()
				}).catch((err) => {
					this.$refs.uToast.show({
						type: 'error',
						message: err.data.msg,
					})
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
	.transition{
		width: 30px;
		height: 30px;
		background-color: #000;
	}
	.page {
		min-height: calc(100vh - 80px);
		background: #f5f5f5;
		padding-bottom: 80px;
	}

	.head-back {
		height: 40px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
	}

	.header {
		border-radius: 4px;
		background: #fff;
		padding: 12px;
		margin: 0 12px;
		margin-top: -40px;
	}

	.header-avatar {
		width: 41px;
		height: 41px;
	}

	.header-avatar image {
		border-radius: 50%;
		width: 100%;
	}

	.header-name {
		margin-left: 12px;
	}

	.header-nickname {
		font-size: 16px;
		color: #1a1a1a;
	}
	.header-nickname.vip-active{
		background: url(../../../static/img/SVIP@2x.png) no-repeat right;
		background-size: 55px;
		padding-right: 65px;
	}
	.showCode-btn{
		text-align: right;
	}
	.showCode-btn image{
		width: 30px;
		height: 30px;
		margin-top: 7px;
	}
	.header-time {
		font-size: 12px;
		color: #999;
		margin-top: 2px;
	}

	.header-text {
		margin-top: 40px;
		font-size: 12px;
		color: #1a1a1a;
	}

	.header-text text {
		padding: 0 5px;
		font-size: 22px;
	}

	.push-box {
		border-radius: 4px;
		padding: 12px;
		margin: 0 12px;
		margin-top: 6px;
		background: #fff;
	}

	.push-title {
		font-size: 16px;
		color: #1a1a1a;
		position: relative;
	}

	.push-title::after {
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
		right: 0;
		margin-top: 5px;
	}

	.push-profit {
		font-size: 31px;
		color: #1a1a1a;
		font-weight: bold;
		text-align: center;
		margin-top: 10px;
	}

	.push-text {
		font-size: 12px;
		color: #999;
		margin-top: 6px;
		text-align: center;
	}

	.receive {
		margin: 0 12px;
		background: #fff;
		border-radius: 4px;
		padding: 12px;
		margin-top: 6px;
		line-height: 27px;
		justify-content: space-between;
		position: relative;
	}

	.receive::after {
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
		right: 12px;
		margin-top: 10px;
	}

	.receive-text {
		font-size: 16px;
		color: #1a1a1a;
	}

	.receive-num {
		font-size: 21px;
		color: #1a1a1a;
		padding-right: 15px;
	}

	.receive-num text {
		font-size: 12px;
		color: #999;
		margin-left: 4px;
	}

	.rights {
		padding: 12px;
		background: #fff;
		border-radius: 4px;
		margin: 0 12px;
		margin-top: 6px;
	}

	.rights-title {
		font-size: 16px;
		color: #1a1a1a;
		padding-bottom: 7px;
	}

	.rights-list {
		margin-top: 7px;
		text-align: center;
	}

	.rights-box {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.rights-img {
		width: 35px;
		height: 35px;
		background: #ccc;
	}

	.rights-text {
		font-size: 12px;
		color: #1a1a1a;
	}

	.openVip {
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		height: 50px;
		line-height: 50px;
		color: #fff;
		font-size: 16px;
		text-align: center;
		border-radius: 50px;
		position: fixed;
		bottom: 15px;
		left: 12px;
		right: 12px;
	}
	.vip-purchase-box{
		padding: 12px;
		background: #fff;
		
	}
	.vip-purchase-title{
		text-align: center;
		font-size: 16px;
		color: #1a1a1a;
		padding-bottom: 7px;
		background: url(../../../static/img/close-square@2x.png) no-repeat right 4px;
		background-size: 14px;
	}
	.vip-purchase-content{
		border: 1px solid #FF8C4E;
		background: rgba(255, 140, 78, 0.1);
		padding: 6px 10px;
		border-radius: 4px;
	}
	.vip-purchase-content-title{
		color: #FF8C4E;
		font-size: 15px;
		text-align: center;
	}
	.vip-purchase-content-title text{
		font-size: 12px;
	}
	.vip-purchase-content-num{
		font-weight: bold;
		color: #FF8C4E;
		font-size: 30px;
		text-align: center;
		padding: 6px 0;
	}
	.vip-purchase-content-num text{
		font-size: 45px;
	}
	.vip-purchase-content-average{
		color: #FF8C4E;
		font-size: 12px;
		text-align: right;
	}
	.purchase{
		height: 50px;
		line-height: 50px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		font-size: 16px;
		color: #fff;
		border-radius: 50px;
		text-align: center;
		margin: 10px 0;
	}
	.checkbox-box-text{
		font-size: 12px;
		color: #999;
	}
	.checkbox-box /deep/ .u-checkbox {
		align-items: inherit
	}
	.vip-code-box{
		position: fixed;
		width: 275px;
		margin: 0 auto;
		top: 13vh;
		left: 0;
		right: 0;
		background: #fff;
		padding-bottom: 12px;
		z-index: 10;
		border-radius: 13px;
	}
	.vip-code-box-shadow{
		content: "";
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 5;
	}
	.vip-code-header{
		width: 100%;
	}
	.vip-code-header image{
		width: 100%;
	}
	.tiaoxingma{
		margin: 0 12px;
		background: #fff;
		padding: 18px 28px 8px;
		margin-top: -18px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
		position: relative;
	}
	.tiaoxingma image{
		width: 100%;
	}
	.tiaoxingma-text{
		font-size: 12px;
		color: #999;
		text-align: center;
		margin-top: 8px;
	}
	.xiaochengxuma{
		margin: 0 12px;
		margin-top: 18px;
		background: #fff;
		padding: 18px 28px 8px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
		text-align: center;
	}
	.xiaochengxuma image{
		width: 196px;
	}
	.xiaochengxuma-text{
		margin-top: 18px;
		font-size: 12px;
		color: #999;
	}
	.vip-code-box-close{
		width: 30px;
		height: 30px;
		position: absolute;
		left: calc(50% - 15px);
		margin-top: 145px;
		z-index: 20;
	}
	.vip-code-box-close image{
		width: 100%;
	}
/* 	.vip-code-box::after{
		content: "";
		display: block;
		background: url(../../../static/img/close@2x.png) no-repeat center;
		background-size: 30px;
		width: 30px;
		height: 30px;
		position: absolute;
		left: calc(50% - 15px);
		margin-top: 30px;
	} */
</style>

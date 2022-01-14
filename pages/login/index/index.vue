<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="logo">
			<image class="login-box-img" mode="widthFix" src="../../../static/img/logo.e3d26679.png"></image>
		</view>
		<view class="login-box-out">
			<view class="login-box">
				<input v-model="phoneNum" type="number" placeholder="请输入手机号" class="login-box-input">
			</view>
			<view class="login-box">
				<input v-model="code" type="text" placeholder="请输入验证码" class="login-box-input login-box-verify">
				<view class="verify" @click="getVerifyCode">
					{{verifyText}}
				</view>
			</view>
		</view>
		<view class="login-btn" @click="login">登录</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {getCode, postLogin} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar:{
					title: '登录',
					custom: true,
					type: 'login'
				},
				verifyText: '获取验证码',
				totalTime: 60,
				canClick: true,
				phoneNum: "",
				code: "",
				loginClick: true,
				timer: null
			}
		},
		methods: {
			getVerifyCode() {
				if (!this.canClick) return
				let regExp = /^1[23456789]\d{9}$/
				if(!regExp.test(this.phoneNum)){
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入正确的手机号',
					})
					return
				}
				this.canClick = false
				let that = this
				getCode({phone: that.phoneNum, source: 'login'}).then((res) => {
					that.$refs.uToast.show({
						type: 'success',
						message: '验证码发送成功',
					})
					that.timer = setInterval(() => {
						that.totalTime--
						that.verifyText = that.totalTime + 's后重新发送'
						if (that.totalTime < 1) {
							clearInterval(that.timer)
							that.verifyText = '重新发送验证码'
							that.totalTime = 60
							that.canClick = true
						}
					}, 1000)
				}).catch((err) => {
					that.canClick = true
				})
			},
			login(){
				if(!this.loginClick){
					return
				}
				let regExp = /^1[23456789]\d{9}$/
				if(!regExp.test(this.phoneNum)){
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入正确的手机号',
					})
					return
				}
				if(!this.code){
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入验证码',
					})
					return
				}
				this.loginClick = false
				postLogin({phone: this.phoneNum, smsCode: this.code}).then((res) => {
					this.$refs.uToast.show({
						type: 'success',
						message: '登陆成功',
					})
					uni.setStorageSync("HJKJ-token", res.token)
					uni.setStorageSync("HJKJ-refreshtoken", res.refresh)
					if(this.timer) {
						clearInterval(this.timer);  
						this.timer = null;  
						this.verifyText = '获取验证码'
						this.totalTime = 60
					}  
					uni.navigateTo({
						url: '/pages/index/index'
					})
					this.loginClick = true
				}).catch((err) => {
					this.loginClick = true
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		background: #fff;
		min-height: calc(100vh - 44px);
		text-align: center;
	}

	.login-box-img {
		width: 200px;
		margin-top: 10vh;
	}

	.login-box-out {
		margin-top: 15vh;
	}

	.login-box {
		background: #fff;
		margin: 0 40px;
		margin-top: 16px;
		position: relative;
	}

	.login-box-input {
		padding-left: 36px;
		text-align: left;
		border-bottom: 1px solid #ccc;
		height: 35px;
		line-height: 35px;
		background: url(../../../static/img/phone.png) no-repeat left;
		font-size: 14px;
		background-size: 28px;
		color: #333;
	}

	.login-box-verify {
		background: url(../../../static/img/code.png) no-repeat left;
		background-size: 28px;
	}

	.login-btn {
		border-radius: 30px;
		height: 40px;
		line-height: 40px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		text-align: center;
		color: #fff;
		font-size: 14px;
		margin: 0 40px;
		margin-top: 20vh;
	}

	.verify {
		position: absolute;
		right: 0;
		color: #FF8C4E;
		top: 8px
	}
</style>

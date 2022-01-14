<template>
	<view class="flex">
		<template v-for="(item, index) in count">
			<view class="star" :class="{'active': index + 1 <= value}" @click="changeValue(index + 1)"></view>
		</template>
	</view>
</template>

<script>
	export default{
		props: {
			count: {
				type: Number,
				default: function() {
					return 5
				}
			},
			value: {
				type: Number,
				default: function() {
					return 1
				}
			}
		},
		data(){
			return {
				
			}
		},
		methods: {
			changeValue(index){
				if(this.value == index){
					return
				}
				this.$emit('rateChange', index)
			}
		}
	}
</script>

<style scoped>
	.star{
		background: url(../static/img/rate-star@2x.png) no-repeat center;
		background-size: 14px;
		width: 14px;
		margin-left: 10px;
	}
	.star:nth-child(1){
		margin-left: 0;
	}
	.star.active{
		background: url(../static/img/rate-star-active@2x.png) no-repeat center;
		background-size: 14px;
		width: 14px;
	}
</style>

module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/scss/_variable.scss";` //引入全局变量   
			}
		}
	},
	transpileDependencies: ['luch-request']
}

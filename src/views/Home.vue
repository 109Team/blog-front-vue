<template>
	<div>
		<nav-bar :nav-list="navList"></nav-bar>
		<div class="content">
			<router-view/>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { NavBarItem } from "@/model/navbarItem";
import NavBar from "@/components/navbar.component.vue";

@Component({
	components: {
		NavBar
	}
})
export default class Home extends Vue {
	public navList: NavBarItem[] = [];

	private init() :void{
		this.navList = [
			{
				id: 1,
				label: "主页",
				route: '/'
			},
			{
				id: 2,
				label: "文章",
				route: '/post/123'
			},
			{
				id: 3,
				label: "分类",
				route: '/categrey'
			}
		]
	}

	private created() {
		this.init();
	}

	private mounted() { }
}
</script>

<style lang="scss" scoped>
@import "../assets/theme.scss";
.content{
	margin: 0 auto;
	background: #666;
	height: calc(100vh - #{$navH});
}
@media screen and (min-width: 1200px){
	.content{
		max-width: 66%;
	}
}
@media screen and (min-width: 960px) and (max-width: 1200px){
	.content{
		max-width: 76%;
	}
}
@media screen and (max-width: 960px){
	.content{
		max-width: 100%;
	}
}
</style>


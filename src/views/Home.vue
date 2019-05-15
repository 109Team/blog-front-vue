<template>
	<div>
		<nav-bar :nav-list="navList" class="nav"></nav-bar>
			<div class="content">
		<transition name="fade">
				<router-view/>
		</transition>
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
@import "@/assets/theme.scss";
.nav{
	background: linear-gradient(0deg, #e4e4e4, #f7f7f7);
}
.content{
	margin: 0 auto;
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


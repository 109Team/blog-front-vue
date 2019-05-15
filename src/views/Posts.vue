<template>
    <section class="post-list-wapper">
        <ul class="post-list-content">
            <li class="list-item" 
                v-for="item in postList" 
                v-bind:key="item._id"
                @click="showPostDetail(item._id)">{{item.title}}</li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Post } from '@/model/post';
@Component
export default class Posts extends Vue{
    public postList: Post[] = [];
    
    private created() {
		this.initData();
    }
    
    // 初始化数据
    private initData(){
        this.$API.getAllPosts().then((data: any) => {
            this.postList = data.data || [];
        });
    }

    // 路由到详情
    public showPostDetail(postId: string): void{
        this.$router.push(`/post/${postId}`);
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/theme.scss";
.post-list-wapper{
    width: 100%;
    min-height: 100%;
    & .post-list-content{
        padding: 0;
        & .list-item{
            list-style: none;
            padding: 10px;
            margin: 10px;
            text-align: left;
            border: 1px solid rgba(0,0,0,.15);
        }
    }
}
</style>



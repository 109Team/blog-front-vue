<template>
    <section>
        <article>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nostrum minima totam explicabo temporibus perferendis atque eaque debitis quidem quia ipsa nemo sint ad, voluptatibus consequuntur voluptatem corrupti cupiditate ut.
        </article>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Post as PostModel } from '@/model/post';

@Component
export default class Post extends Vue{

    public post!: PostModel;
    private created(){
        this.initData();
    }

    private initData(){
        this.$API.getPost(this.$route.params.postId).then((data: any) => {
            this.post = data.data;
        })
    }
}
</script>


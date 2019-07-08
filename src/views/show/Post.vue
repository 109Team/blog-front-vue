<template>
	<section class="post-warpper">
		<article class="post-area" v-if="post.title">
			<h1 class="post-title">{{post.title}}</h1>
			<div class="post-info">
				<span>{{post.meta_data.views}}</span>
				<span>{{post.meta_data.likes}}</span>
				<span>{{post.words_count}}</span>
			</div>
			<div class="post-content" v-html="content"></div>
		</article>
	</section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import marked, { Renderer } from "marked";
import * as hljs from "highlight.js";
import mermaid from "mermaid";

import { Post as PostModel } from "@/model/post";
import { escape } from "@/common/util";

// 初始化mermaid
mermaid.initialize({theme: "dark"});

// 重写marked.js renderer的codefang 方法，实现代码高亮，甘特图展示
function overridRendererCode(langPrefix: string = "language-"): Renderer {
    // 初始化甘特图mermaid
    let _renderer = new marked.Renderer();
	_renderer.code = function(
		code: string,
		language: string,
		isEscaped: boolean
	): string {
		let lang = ((language || "").match(/\S*/) as Array<string>)[0];
        // 如果是甘特图，则使用mermaid渲染；
        if (lang.toLowerCase() === 'mermaid') {
            return  `<div class="mermaid">${code}</div>`;
        }
		if (hljs) {
			let out;
			if (lang && hljs.getLanguage(lang)) {
				try {
					out = hljs.highlight(lang, code).value;
				} catch (err) {
					console.error(`convert error with: ${err}`);
				}
			}
			try {
				out = hljs.highlightAuto(code).value;
			} catch (err) {
				console.error(`convert error with: ${err}`);
			}
			if (out != null && out !== code) {
				isEscaped = true;
				code = out;
			}
		}

		if (!lang) {
			return (
				'<pre><code class="hljs">' +
				(isEscaped ? code : escape(code, true)) +
				"</code></pre>"
			);
		}

		return (
			'<pre><code class="hljs ' +
			langPrefix +
			escape(lang, true) +
			'">' +
			(isEscaped ? code : escape(code, true)) +
			"</code></pre>\n"
		);
	};
	return _renderer;
}

// 将markdown文本转为html
function convertMarkdown(content: string = ""): string{
    marked.setOptions({
        renderer: overridRendererCode(),
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: true
    });
    return marked(content);
}

@Component
export default class Post extends Vue {
	public post: PostModel = <PostModel>{};
	public content: string = <string>"";
	private beforeCreate(): void {
		this.$API.getPost(this.$route.params.postId).then((data: any) => {
            this.post = data.data;
            this.content = convertMarkdown(this.post.content);
            setTimeout(() => {
                mermaid.init('.mermaid');
            }, 0)
		});
	}

	private mounted(): void {
	}
}
</script>

<style src="highlight.js/styles/qtcreator_dark.css"></style>
<style lang="scss">
@import "@/assets/scss/theme.scss";
.post-warpper {
	width: 100%;
	min-height: calc(100vh - #{$navH});
	position: relative;
	background-color: $Color-3-rgba;
	overflow: hidden;
	overflow-y: scroll;
	padding: 16px;
	.post-area {
		width: 100%;
		.post-content {
			margin-top: 16px;
		}
	}
}
</style>


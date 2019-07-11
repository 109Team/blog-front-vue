<template>
	<div class="edit-warpper">
		<div class="edit-header">
			<a-button type="primary" @click="onSave">保存</a-button>
			<a-button type="danger" @click="onPublish">发布</a-button>
			<a-button type="danger" v-show="isShowPreBtn" @click="beforePreview">预览</a-button>
		</div>
		<div class="edit-area">
			<a-input
				type="textarea"
				name="edit"
				addonBefore="100%"
				v-model="content"
				@input="onInput"
				@focus="onFocus"
			></a-input>
			<transition name="fade">
				<div class="preview-area" v-show="isShowPre" v-html="previewContent"></div>
			</transition>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import { Button, Popconfirm, Input, message, Modal } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import { Post } from "../../model/post";

import marked, { Renderer } from "marked";
import * as hljs from "highlight.js";
import mermaid from "mermaid";
import "highlight.js/styles/qtcreator_dark.css";

import { Post as PostModel } from "@/model/post";
import { escape, debounce } from "@/common/util";

// 初始化mermaid
mermaid.initialize({ theme: "dark" });

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
		if (lang.toLowerCase() === "mermaid") {
			marked.prototype.hasMermaid = true;
			return `<div class="mermaid">${code}</div>`;
		}
		if (lang === "postInfo") {
			marked.prototype.postInfoString = code;
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

// 初始化marked
function initMarked(): void {
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
}

initMarked();

// 注册三方组件
function registerComponent(components: Array<any>): void {
	components.forEach(item => Vue.use(item));
}
registerComponent([Button, Popconfirm, Input]);

const POSTINFOREG = /```\s*?postInfo\n+(.|\n)*?\s+```\n/;

@Component
export default class Edit extends Vue {
	public id: string = "";
	public content: string = "";
	public previewContent: string = "";
	public post: Post = <Post>{};
	public isShowPre: boolean = false;
	public isShowPreBtn: boolean = false;
	public isBigScreen: boolean = false;
	private debounce: Function = new Function();
	private mermaidTimer: any = null;
    private hasSaved: boolean = true;
    private readyPublish: boolean = false;

	private created(): void {
		this.getClientWidth();
		this.debounce = debounce(this.preview, 500);
        this.id = this.$route.params.postId;
		if (this.id) {
            this.getPost(this.id);
		} else {
            this.content = this.initPostInfo({});
            this.preview();
        }
	}

	private getClientWidth(): void {
		let _w = document.body.clientWidth;
		if (_w > 960) this.isBigScreen = true;
		this.isShowPre = this.isBigScreen;
		this.isShowPreBtn = !this.isBigScreen;
		window.onresize = () => {
			_w = document.body.clientWidth;
			this.isBigScreen = _w > 960 ? true : false;
			this.isShowPre = this.isBigScreen;
			this.isShowPreBtn = !this.isBigScreen;
		};
	}

	private getPost(id: string): void {
		this.$API.getPost(id).then(res => {
			if (res.code == 200) {
                this.post = res.data;
                this.readyPublish = this.post.status === 0 ? true : false;
				this.content = this.initPostInfo(this.post) + this.post.content;
				this.preview();
			} else {
                this.catchHttpError(res);
            }
		});
	}

	private initPostInfo(post: any): string{
        let _postInfo: any = {title: "",author: "",desc: "",img_url: "",type: 0,origin: 0,tags: [],categrey: [],keywards: []};
        for(let _key in _postInfo){
            if(post.hasOwnProperty(_key)){
                _postInfo[_key] = post[_key]
            }
        }
        return `\`\`\` postInfo\n${JSON.stringify(_postInfo, null, 4)}\n\`\`\`\n`;
    }

	public beforePreview(): void {
		this.isShowPre = true;
		this.preview();
	}

	public preview(): void {
		// 每次render前设置hasMermaid为false
		marked.prototype.hasMermaid = false;
		// 转化为markdown格式
		this.previewContent = marked(this.content);
		// 如果转换后的marked原型中hasMermaid为true， 则渲染甘特图
		if (marked.prototype.hasMermaid) {
			clearTimeout(this.mermaidTimer);
			this.mermaidTimer = setTimeout(() => {
				try {
					mermaid.init(".mermaid");
				} catch (e) {
					message.error("mermaid 格式错误");
				}
			}, 0);
		}
	}

	public onFocus(): void {
		if (!this.isBigScreen) this.isShowPre = false;
	}

	public onInput(): void {
		this.debounce();
		this.hasSaved = false;
	}

	public updateData(post: Post): void {
        let _status = post.status;
		if (this.id) {
			this.$API.updatePost(this.id, post).then(res => {
                if (res.code == 200) {
                    this.hasSaved = true;
                    this.readyPublish = _status == 0 ? true : false;
                    message.success(_status == 0 ? "保存成功！": "发布成功");
                } else {
                    this.catchHttpError(res);
                }
			});
		} else {
			this.$API.createAPost(post).then(res => {
                if (res.code == 200) {
                    this.hasSaved = true;
                    this.readyPublish = _status == 0 ? true : false;
                    message.success(_status == 0 ? "创建成功！": "发布成功");
                } else {
                    this.catchHttpError(res);
                }
			});
		}
    }

	public onSave(): void {
        let _data = this.dealPostdata(false);
        if (_data)
		    this.updateData(_data);
	}

	public onPublish(): void {
        let _data = this.dealPostdata(true);
        if (_data)
		    this.updateData(_data);
    }
    
    private dealPostdata(publish: boolean): any{
        if (this.hasSaved && !this.readyPublish) {
            message.warning("没有需要保存或者发布的信息！");
            return null;
        };
        let _postInfo;
        try{
            _postInfo = JSON.parse(marked.prototype.postInfoString);
        }catch(e){
            message.error("postInfo信息应为正确的json格式");
            return null;
        }
        _postInfo.content = this.content.replace(POSTINFOREG, "");
        _postInfo.status = publish ? 1 : 0;
        return _postInfo;
    }

    private catchHttpError(res: any): void{
        message.error(res.msg);
    }

	public beforeRouteLeave(to: Route, from: Route, next: any) {
		if (this.hasSaved) {
			next();
		} else {
			Modal.confirm({
				title: "您有未保存的数据，确认离开？",
				content: "点击取消按钮以保存数据， 确认离开请点击确认按钮",
				okText: "确认",
				cancelText: "取消",
				onOk() {
					next();
				},
				onCancel() {
					next(false);
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.edit-warpper {
	box-sizing: border-box;
	padding: 8px 16px;
	height: 100%;
	.edit-header {
		text-align: right;
		height: 60px;
		line-height: 60px;
		button {
			margin: 8px 16px;
		}
	}
	.edit-area {
		height: calc(100% - 70px);
		display: flex;
		textarea {
			width: 50%;
			height: 100%;
			color: $Color-2-hex;
			background: $Color-1-hex;
		}
		.preview-area {
			width: 50%;
			height: 100%;
			padding: 8px;
			background: $Color-3-hex;
			border: 1px solid #d9d9d9;
			border-radius: 4px;
			text-align: left;
			overflow: scroll;
			transition: all 0.3s ease-in;
		}
		.preview-area:hover {
			border-color: #40a9ff;
			border-right-width: 1px !important;
		}
	}
}

@media screen and (max-width: 960px) {
	textarea {
		width: 100% !important;
	}
	.preview-area {
		width: 90% !important;
		height: calc(100% - #{$navH} - 86px) !important;
		position: fixed;
		right: 0;
	}
}
</style>



import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/show/Home.vue';
import Posts from '@/views/show/Posts.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          name: 'posts',
          component: Posts,
        },
        {
          path: 'post/:postId',
          name: 'post',
          component: () => import(/* webpackChunkName: "post" */ './views/show/Post.vue'),
        },
        {
          path: 'categrey',
          name: 'categrey',
          component: () => import(/* webpackChunkName: "categrey" */ './views/show/Categrey.vue'),
        }
      ]
    },
    {
      path: '/admin',
      component: () => import(/* webpackChunkName: "categrey" */ './views/edit/Admin.vue'),
      children: [
        {
          path: '',
          name: 'postlist',
          component: () => import(/* webpackChunkName: "categrey" */ './views/edit/PostList.vue'),
        }
      ]
    },
    {
      path: '/',
      redirect:'/home'
    },
    {
      path: '/*',
      redirect: '/home'
    }
  ],
});

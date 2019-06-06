import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Posts from '@/views/Posts.vue';

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
          component: () => import(/* webpackChunkName: "post" */ './views/Post.vue'),
        },
        {
          path: 'categrey',
          name: 'categrey',
          component: () => import(/* webpackChunkName: "categrey" */ './views/Categrey.vue'),
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/',
      redirect:'/home'
    }
  ],
});

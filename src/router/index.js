import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded pages
const LoginPage = () => import('../contexts/iam/ui/pages/LoginPage.vue')
const UserDashboardPage = () => import('../contexts/user-profile/ui/pages/UserDashboardPage.vue')
const PostsIAPage = () => import('../contexts/social/ui/pages/PostsIAPage.vue')

export const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage, meta: { layout: 'auth' } },
  { path: '/dashboard', name: 'dashboard', component: UserDashboardPage },
  { path: '/posts-ia', name: 'posts-ia', component: PostsIAPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

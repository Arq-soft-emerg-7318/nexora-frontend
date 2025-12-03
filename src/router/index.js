import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded pages
const LoginPage = () => import('../contexts/iam/ui/pages/LoginPage.vue')
const UserDashboardPage = () => import('../contexts/user-profile/ui/pages/UserDashboardPage.vue')
const PostsIAPage = () => import('../contexts/social/ui/pages/PostsIAPage.vue')
const SignupPage = () => import('../contexts/iam/ui/pages/SignupPage.vue')
const CreateProfilePage = () => import('../contexts/user-profile/ui/pages/CreateProfilePage.vue')
const AdminDashboard = () => import('../contexts/admin/ui/pages/AdminDashboard.vue')
const AdminUsers = () => import('../contexts/admin/ui/pages/AdminUsers.vue')
const AdminPosts = () => import('../contexts/admin/ui/pages/AdminPosts.vue')

export const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage, meta: { layout: 'auth' } },
  { path: '/signup', name: 'signup', component: SignupPage, meta: { layout: 'auth' } },
  { path: '/create-profile', name: 'create-profile', component: CreateProfilePage, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: UserDashboardPage, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/users', name: 'admin-users', component: AdminUsers, meta: { requiresAuth: true } },
  { path: '/admin/posts', name: 'admin-posts', component: AdminPosts, meta: { requiresAuth: true } },
  { path: '/profile/:id', name: 'profile-view', component: () => import('../contexts/user-profile/ui/pages/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/posts-ia', name: 'posts-ia', component: PostsIAPage, meta: { requiresAuth: true } }
]

// Community route for posts by community
routes.push({ path: '/community/:id', name: 'community-view', component: () => import('../contexts/user-profile/ui/pages/CommunityView.vue'), meta: { requiresAuth: true } })

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global sencillo: si la ruta requiere auth y no hay token, redirige a login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const profileCreated = localStorage.getItem('profileCreated') === '1'

  // Si la ruta requiere auth pero no hay token -> login
  if (to.meta?.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  // Nota: eliminada la redirección forzada a `create-profile`.
  // El usuario podrá navegar al dashboard tras el login sin completar el perfil.

  next()
})

export default router

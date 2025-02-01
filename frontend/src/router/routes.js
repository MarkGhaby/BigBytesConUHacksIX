const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },  // ✅ Home Page
      { path: 'settings', component: () => import('pages/SettingsPage.vue') } // ✅ Settings Page
    ]
  },

  // Always leave this as the last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;

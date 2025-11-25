import { 
    createRootRoute, 
    createRoute, 
    createRouter, 
    RouterProvider, 
    Outlet
  } from '@tanstack/react-router';
  import { useAuth } from './contexts/AuthContext.jsx';
  import QuestJournal from './components/Quest/QuestJournal.jsx';
  import Inventory from './components/Inventory/Inventory.jsx';
  import Login from './components/Auth/Login.jsx';
  import Register from './components/Auth/Register.jsx';
  import Navbar from './components/Layout/Navbar.jsx';
  import React from 'react';
  
  // Gestion des erreurs globales
  window.addEventListener('error', (event) => {
    console.error('ERREUR CAPTURÉE:', event.error);
  });
  
  // Layout racine
  function RootLayout() {
    const { player } = useAuth();
    
    return (
      <div className="app">
        {player && <Navbar />}
        <Outlet />
      </div>
    );
  }
  
  // Route racine
  const rootRoute = createRootRoute({
    component: RootLayout,
  });
  
  // Route de connexion
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
  });
  
  // Route d'inscription
  const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: Register,
  });
  
  // Route des quêtes - CORRIGÉE
  const questRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/quests',
    component: QuestJournal,
    
    // Loader avec gestion d'erreur améliorée
    loader: async () => {
      try {
        console.log('🔄 Chargement des quêtes disponibles...');
        const res = await fetch('http://localhost:3000/api/quests/available');
        
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('✅ Quêtes chargées:', data);
        return data;
        
      } catch (error) {
        console.error('❌ Erreur loader:', error);
        // Retourner un objet avec une structure cohérente même en cas d'erreur
        return { 
          success: false,
          data: [],
          error: error.message 
        };
      }
    },
    
    // Éviter les recharges trop fréquents
    staleTime: 10000, // 10 secondes
  });
  
  // Route de l'inventaire
  const inventoryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/inventory',
    component: Inventory,
  });
  
  // Arbre des routes
  const routeTree = rootRoute.addChildren([
    loginRoute,
    registerRoute,
    questRoute,
    inventoryRoute,
  ]);
  
  // Configuration du router
  export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultContext: {
      auth: undefined,
    },
  });
  
  // Provider du router
  export function AppRouter() {
    const auth = useAuth();
    return <RouterProvider router={router} context={{ auth }} />;
  }
  

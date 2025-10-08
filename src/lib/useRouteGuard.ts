"use client"
import { useRouter } from 'next/compat/router'
import { useEffect, useState } from 'react';
import { allRoutes, hasPermission } from './roleRoutes';

export function useRouteGuard(user: any) {
const router = useRouter()
  const [accessState, setAccessState] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
   
    if (router && !router.isReady) {
      return;
    }

    const checkAccess = () => {
      if (router && !user) {
        router.push('/login');
        return;
      }
       if(router){
      const currentPath = router.pathname;
      const route = allRoutes.find(r => r.href === currentPath);


            if (!route) {
        setAccessState('allowed');
        return;
      }

      if (route.roles && route.roles.length > 0 && !route.roles.includes(user.role_tag)) {
        setAccessState('denied');
        return;
      }

      if (route.permission && route.permission !== "" && !hasPermission(user, route.permission)) {
        setAccessState('denied');
        return;
      }
       }
      


      setAccessState('allowed');
    };

    checkAccess();
  }, [user, router]); 

  return accessState;
}
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
    isAuthenticated?: boolean;
    allowedRoles: string[];
    userRole?: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAuthenticated: propIsAuthenticated,
    allowedRoles = [],
    userRole: propUserRole,
    children,
}) => {
    // Get user data from Zustand store as fallback
    const { user } = useUserStore();
    
    // Use props if provided, otherwise use Zustand store
    const isAuthenticated = propIsAuthenticated ?? !!user;
    const userRole = propUserRole ?? user?.role ?? '';
    
   /* console.log('ProtectedRoute rendered with:', {
        isAuthenticated,
        allowedRoles,
        userRole,
        userRoleType: typeof userRole,
        fromStore: !propIsAuthenticated && !!user
    });*/
    
    const redirectPath = '/login'; // Define your redirect path here

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to access this page.', { id: 'auth-error' });
        }
    }, [isAuthenticated]);

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // If roles are specified, check if user has permission
    // But only check if userRole is not empty (to avoid timing issues)
    if (allowedRoles.length > 0) {
        /*console.log('ProtectedRoute - Role Check:');
        console.log('- allowedRoles:', allowedRoles);
        console.log('- userRole:', userRole);
        console.log('- userRole type:', typeof userRole);
        console.log('- userRole length:', userRole?.length);*/
        
        // If userRole is still empty/loading, show loading or wait
        if (!userRole || userRole === '') {
          //  console.log('UserRole is empty, still loading auth state...');
            return <div>Loading...</div>; // Show loading while auth state is being determined
        }
        
        //console.log('- includes check result:', allowedRoles.includes(userRole));
        
        if (!allowedRoles.includes(userRole)) {
           // console.log('Access denied - redirecting to /unauthorized');
            return <Navigate to="/unauthorized" replace />;
        } else {
           // console.log('Access granted - role matches');
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;

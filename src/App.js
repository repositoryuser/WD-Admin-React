import { Loading } from '@shopify/polaris';
import { useEffect, useState ,useContext} from 'react'
import AuthRoutes from './AppNavigation/AuthRoutes';

import AppRoutes from "./AppNavigation/MainRoutes";
import { AuthContext } from './ContextApi/AuthContext';


export default function App() {
    const { isAppLoading, authToken ,isTokenActive } = useContext(AuthContext)
    const ctd_admin_token = (localStorage.getItem('wd-admin-token'))
    if(isAppLoading){
        return <Loading/>
     }
    return (
        <>
            {authToken != null || ctd_admin_token ? <AppRoutes /> : <AuthRoutes />}       
        </>
    );
}

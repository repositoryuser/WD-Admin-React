import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'
import jwt_decode from "jwt-decode";
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAppLoading, setIsAppLoading] = useState(false)
    const [authToken, setAuthToken] = useState(null)
    const [isTokenActive, setIsTokenActive] = useState(false)
    const [editSeller, setEditSeller] = useState({})
    const [shopAssetDetail, setShopAssetDetail] = useState({})
    const [shopThemeDetails, setShopThemeDetails] = useState({})
    const [isStore, setIsStore] = useState(false);
    // update render in App.js for logout
    const handleStorageChange = () => {
        getAuthToken();
    };

    useEffect(() => {
        // Listen for changes in localStorage
        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    // 
    //seller Details
    const [sellerDetails, setSellerDetails] = useState({});
    const login = ({ token, result }) => {
        setIsAppLoading(true)
        try {
            if (result) {
                localStorage.setItem("wd-admin-token", token);
                setAuthToken(token)
                setIsAppLoading(false);
            }
        } catch (e) {
            console.log(`login error ${e}`);
            setIsAppLoading(false);
            setAuthToken(null)
        }
    }

    const getAuthToken = () => {
        setIsAppLoading(true)
        try {
            setIsAppLoading(true)
            const token = localStorage.getItem('wd-admin-token');
            var decodedToken = jwt_decode(token);
            let currentDate = new Date();
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                setIsTokenActive(false)
                setIsAppLoading(false)
                console.log("Token expired.");
                 localStorage.removeItem('wd-admin-token');
            } else {
                setIsTokenActive(true)
                setIsAppLoading(false)
                setAuthToken(token)
                // console.log("Valid token");
            }
        } catch (error) {
            console.log("error: ", error);
            setAuthToken(null)
            setIsAppLoading(false)
        }
    }

    useEffect(() => {
        getAuthToken()
    }, []);

    return <AuthContext.Provider value={{ isAppLoading, login, authToken, setEditSeller, editSeller, setShopAssetDetail, shopAssetDetail, setShopThemeDetails, shopThemeDetails ,isTokenActive ,setSellerDetails , sellerDetails,isStore,setIsStore}}>{children}</AuthContext.Provider>;
};

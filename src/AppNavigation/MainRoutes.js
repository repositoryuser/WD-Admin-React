import React,{useState,useCallback,useRef,useContext} from 'react'
import Dashboard from "../components/Dashboard/Dashboard";
import {AuthContext} from "../ContextApi/AuthContext"
import ListingPage from "../components/listingPage/LIstingPage"
import DetailsPage from "../components/sellerStoreDetailsPage/DetailsPage";
import CreateQuantityRule from "../components/sellerStoreDetailsPage/CustomerCRUD/Subtotal Quantity/CreateQuantityRule";
import CreateRule from "../components/sellerStoreDetailsPage/CustomerCRUD/Subtotal Discount Rule/CreateRule";
import AssetThemeList from "../components/AssetComponent/ThemeList";
import AssetExtensionCode from "../components/AssetComponent/ThemeExtensionCode";
import EditAssetThemeExtensionPage from "../components/AssetComponent/EditAssetThemeExtensionPage.js";
import Setting from "../components/sellerStoreDetailsPage/Setting Page/Setting";
import DisplaySetting from "../components/sellerStoreDetailsPage/Setting Page/DisplaySetting";
import CustomPlan from '../components/CustomPlan/CustomPlan.js';
import { Routes, Route, useNavigate ,useLocation } from "react-router-dom";
import { HomeMajor, CustomersMajor, ExitMajor, SettingsMajor,DiscountsMajor,TeamMajor ,PlanMajor} from "@shopify/polaris-icons";
import { Frame, Modal, Navigation, TopBar,FormLayout,TextField} from "@shopify/polaris";
import companyLogo from "../components/loginPage/CSS/rocket.webp"

function MainRoutes() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userMenuActive, setUserMenuActive] = useState(false);
    const { isStore, setIsStore, sellerDetails } = useContext(AuthContext);
    const { MyShopifyDomain } = sellerDetails;
    const defaultState = useRef({
        emailFieldValue: "contact@apptiv.in",
        nameFieldValue: "Apptiv",
    });
    const [storeName, setStoreName] = useState(defaultState.current.nameFieldValue);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
    const [supportSubject, setSupportSubject] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const handleSubjectChange = useCallback((value) => setSupportSubject(value), []);
    const handleMessageChange = useCallback((value) => setSupportMessage(value), []);;
    const [modalActive, setModalActive] = useState(false);

    const toggleModalActive = useCallback(() => setModalActive((modalActive) => !modalActive), []);

    const LogoutUser = () => {
        localStorage.removeItem("wd-admin-token");
        alert("Logged out successfully");
        window.location.reload(false);
        window.location = "/";
        // window.location = "/login";
    };

    
    const showTab = tabContentID => {
        switch (tabContentID) {
          case 'CreateQuantityRule':
            return navigate(`/CreateQuantityRule/${MyShopifyDomain}`);
          case 'CreateSubTotalRule':
            return navigate(`/CreateRule/${MyShopifyDomain}`);
          case 'Setting':
            return  navigate(`/Setting/${MyShopifyDomain}`);
          case 'CustomPlan':
            return  navigate(`/CustomPlan`);
          default:
            return  navigate("/");
        }
      };

    const toggleUserMenuActive = useCallback(() => setUserMenuActive((userMenuActive) => !userMenuActive), []);
    const toggleMobileNavigationActive = useCallback(() => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive), []);
    const userMenuMarkup = <TopBar.UserMenu name="AT-Wholesale" detail={storeName} initials="A" open={userMenuActive} onToggle={toggleUserMenuActive} />;
    const topBarMarkup = <TopBar showNavigationToggle userMenu={userMenuMarkup} onNavigationToggle={toggleMobileNavigationActive} />;
    const navigationMarkup = (
        <Navigation location={location.pathname}>
            <Navigation.Section
                items={[
                    {
                        label: "Dashboard",
                        icon: HomeMajor,
                        onClick: () => {const { MyShopifyDomain } = sellerDetails;
                            navigate("/");
                        },
                        selected: "/" === location.pathname,
                    },
                    {
                        label: "Seller",
                        icon: CustomersMajor,
                        onClick: () => {
                            navigate("/ListingPage");
                        },
                        selected: "/ListingPage" === location.pathname,
                    },
                    {
                        label: "Create Quantity Discount",
                        disabled: !isStore,
                        icon: DiscountsMajor,
                        onClick :   ()=>{showTab('CreateQuantityRule')},
                        selected: `/CreateQuantityRule/${MyShopifyDomain}` === location.pathname,
                    },
                    {
                        label: "Create Subtotal Discount",
                        disabled: !isStore,
                        icon: DiscountsMajor,
                        onClick :  ()=>{showTab('CreateSubTotalRule')},
                        selected: `/CreateRule/${MyShopifyDomain}` === location.pathname,
                    },

                    {
                        label: "Setting",
                        icon: SettingsMajor,
                        disabled: !isStore,
                        onClick : ()=>{showTab('Setting')},
                        selected: (`/Setting/${MyShopifyDomain}` === location.pathname || location.pathname===`/DisplaySetting/${MyShopifyDomain}`),
                    },
                    {
                        label: "Custom Plan",
                        icon: PlanMajor,
                        onClick: () => showTab('CustomPlan')
                    },
                    {
                        label: "Logout",
                        icon: ExitMajor,
                        onClick: () => LogoutUser(),
                    }
                ]}
                rollup={{
                    after: 3,
                    view: "view",
                    hide: "hide",
                    activePath: "#",
                }}
            />
        </Navigation>
    );

    const logo = {
        width: 40,
        topBarSource: companyLogo,
        contextualSaveBarSource: companyLogo,
        url: "#",
        accessibilityLabel: "AT-Wholesale",
    };
    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="Contact support"
            primaryAction={{ content: "Send", onAction: toggleModalActive }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField label="Subject" value={supportSubject} onChange={handleSubjectChange} autoComplete="off" />
                    <TextField label="Message" value={supportMessage} onChange={handleMessageChange} autoComplete="off" multiline />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

  return (
  <>
   <Frame logo={logo} topBar={topBarMarkup} navigation={navigationMarkup} showMobileNavigation={mobileNavigationActive} onNavigationDismiss={toggleMobileNavigationActive}>
        <Routes>
          <Route path="*" element={<Dashboard />} />
          <Route path="ListingPage" element={<ListingPage />} />
          <Route path="DetailsPage" element={<DetailsPage />} />
          <Route path="CreateQuantityRule/:myShopifyDomain" element={<CreateQuantityRule />} />
          <Route path="CreateRule/:myShopifyDomain" element={<CreateRule />} />
          <Route path="AssetThemeExtesntion" element={<AssetThemeList />} />
          <Route path="AssetThemeExtesntionFiles" element={<AssetExtensionCode />} />
          <Route path="EditAssetThemeExtensionPage" element={<EditAssetThemeExtensionPage />} />
          <Route path="Setting/:myShopifyDomain" element={<Setting />} />
          <Route path="DisplaySetting/:myShopifyDomain" element={<DisplaySetting />} />
          <Route path="CustomPlan" element={<CustomPlan/>} />
        </Routes>
        {modalMarkup}
    </Frame>
  </>
  )
}

export default MainRoutes
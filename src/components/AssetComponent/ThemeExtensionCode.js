/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Page, DataTable, Badge, Button, Text, Loading, Modal, VerticalStack, Box, RadioButton, HorizontalGrid ,Toast, Layout} from "@shopify/polaris";
import { useNavigate,useLocation } from "react-router-dom";
import DateAndTimeHook from "../../Hooks/DateAndTimeHook";
import config from "../../config.json";
import { AuthContext } from "../../ContextApi/AuthContext";
import { useCallback } from "react";
import { POST_DATA } from "../../Hooks/FatchAPIHook";
const AssetExtensionCode = (props) => {
    const navigate = useNavigate();
    const { shopAssetDetail ,shopThemeDetails} = React.useContext(AuthContext);
    const { _id, MyShopifyDomain, InstallStatus, shopDetails, ThemeId } = shopAssetDetail;
    const [sellerThemeList, setSellerThemeList] = useState([1,2,3,4]);
    const [sellerThemeFile, setSellerThemeFile] = useState(['wd-tiered-qty-cart.js','wd-tiered-qty-product.js','wd-tiered-sub-cart.js','wd-tiered-sub-product.js']);
    const [sellerThemeFilePath, setSellerThemeFilePath] = useState(['clientStoreCart','clientStoreProduct','clientStoreSubtotal','clientStoreSubtotalPdPage']);
    const [isLoading, setIsLoading] = useState(false);

    //success
    const [successTost, setSuccessTost] = useState(false);
    const [successTostContent, setSuccessTostContent] = useState("");
    const toggleSuccessActive = useCallback(() => setSuccessTost((successTost) => !successTost), []);
    const successToastMarkup = successTost ? <Toast content={successTostContent} onDismiss={toggleSuccessActive} /> : null;
    //error 
    const [errorTost, setErrorTost] = useState(false);
    const toggleErrorTost = useCallback(() => setErrorTost((errorTost) => !errorTost), []);
    const [errorContent, setErrorContent] = useState("Saving error")
    const errorTostMarkup = errorTost ? <Toast content={errorContent} error onDismiss={toggleErrorTost} /> : null;

    //Theme install
    const [modalActive, setModalActive] = useState(false);
    const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);
    const [selected, setSelected] = useState("--SELECT THEME--");
    const [selectedId, setsSelectedID] = useState(null);
    const [installFile, setInstallFile] = useState("defaultCode");
    const handleInstallCodeFile = useCallback((_, value) => setInstallFile(value), []);
    const [btnLoading ,setBtnLOading] = useState(false)

   // Theme Uninsatll codes 
   const [uninstallactiveModal, setUninstallactiveModal] = useState(false);
   const [array, setarray] = useState([]);
   const [activeToggle, setActiveToggle] = useState(false); 
   const [toggleMesssage, setToggleMesssage] = useState("");
   const [uninsallselectedId, setUninsallSelectedId] = useState();
   const [uninsallsubmitButtonText, setsubmitUninsallButtonText] = useState("Reset codes");
   const [uninsallselected, setUninsallSelected] = useState("--SELECT THEME--");
   const [uninsallbtext, setUninsallbtext] = useState("");
   const [uninsallatext, setUninsallatext] = useState("");
   const [Uninsalltext, setUninsalltext] = useState("No Theme selected");
   const [successToggleMesssage, setSuccessToggleMesssage] = useState("");
   const [active_, setActive_] = useState(false);
   const uninsatlloptions = [
    <option
      key="1234567890"
      value="--SELECT THEME--"
      label="--SELECT THEME--"
    ></option>,
    array.map((item) => {
      if (item.isThemeInstalled == true ) {
        return (
          <>
          <option key={item.id} value={item.id + '^' + item.name}>
             {item.name} {item.role == 'main' ? '(Live)' : ''}
          </option>
        </>
        );
      } 
    }),
  ];

   const handleModalUninsatllChange = async () =>{
    let Themeinstall = array.map((item)=>{
      if (item.isThemeInstalled === true ) {
        return 'true';
      }else{
        return 'false';
      }
    });
  if(Themeinstall.includes('true')){
   setUninstallactiveModal(!uninstallactiveModal);
  }else{
    setActiveToggle(true);
    setToggleMesssage("No theme installed.")
  }
}


const UninstallhandleSelectChange = useCallback((e) => {
    var Id_Name = e.target.value;
    var Id = Id_Name.substring(0,Id_Name.indexOf('^'));
    // console.log(Id)
    var ThemeName = Id_Name.substring(Id_Name.indexOf('^')+1);
    setUninsallSelectedId(Id);
    setUninsallSelected(ThemeName);
    // console.log('e.target')
    // console.log(ThemeName)
    if (e.target.value != "--SELECT THEME--" && e.target.value != null) {
      setUninsallbtext('Safely remove Tiered Discount by AnnCode app codes from "');
      setUninsalltext(ThemeName);
      setUninsallatext('" Theme');
    } else {
      setUninsallbtext("");
      setUninsalltext("No Theme selected");
      setUninsallatext("");
    }
  }, []);

const UninsallSubmit = () =>{

    //Theme Installation
     
    if (uninsallselectedId !== undefined) {
     setsubmitUninsallButtonText("Resetting...");
     array.forEach((Theme) => {
       if (Theme.id == uninsallselectedId) {
         const apiUrl =
           config.APIURL  + "/installCode/Uninstallthemecode";
         const data = {
           ThemeId: Theme.id,
           ThemeName: Theme.name,
           ThemeStoreId: Theme.theme_store_id,
           Shop: MyShopifyDomain,
         };
         let token = localStorage.getItem("wd-admin-token");
         POST_DATA(`${apiUrl}`, data, token)
         .then(async(data) => {
            if (data) {
                setsubmitUninsallButtonText("Reset codes");
                // setthemeName(Theme.name);
                // setthemeId(Theme.id);
                
                setUninstallactiveModal(false);
                // GetData();
                setUninsallbtext('');
                setUninsalltext("");
                setUninsallatext('');
                setUninsallSelected("--SELECT THEME--")
                if(data.status == "success"){

                    
                   setSuccessTostContent(data.message)
                   setSuccessTost(true);
                //    getThemeList();
                //   setSuccessToggleMesssage(data.data.message);
                //   setActive_(true);
                }
              }
         })
         .catch((err) => {
             console.log(`ADD_PRODUCT_TO_CART_PRO ${err}`);
             setErrorTost(true)
             setErrorContent(err.message)
             setBtnLOading(false)
         });

       }
     });
   } else {
     setsubmitUninsallButtonText("Reset codes");
   }
   }

    // useEffect(() => {
        // getThemeList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props]);

    const getThemeList = async () => {
        setIsLoading(true);
        let token = localStorage.getItem("wd-admin-token");
        fetch(`${config.APIURL}/details/getThemeList?_id=${_id}`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "your-rapidapi-key",
                "X-RapidAPI-Host": "famous-quotes4.p.rapidapi.com",
                auth_token: token,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.status == "success") {
                    setarray(response.sellerThemes);
                    setSellerThemeList(response.sellerThemes);
                    setIsLoading(false);
                } else if (response.status == "error") {
                    setSellerThemeList(null);
                    setIsLoading(false);
                } else if (response.status == "session expired") {
                    alert("session expired");
                    window.location.reload(false);
                    window.location = "/";
                }
            })
            .catch((err) => console.error(err));
    };



    const handleSelectChange = useCallback((e) => {
        var Id_Name = e.target.value;
        var Id = Id_Name.substring(0, Id_Name.indexOf("^"));
        var ThemeName = Id_Name.substring(Id_Name.indexOf("^") + 1);
        setsSelectedID(Id);
        setSelected(ThemeName);
    }, []);

    const options = [
        <option key="1234567890" value="--SELECT THEME--" label="--SELECT THEME--"></option>,
        sellerThemeList.map((item) => {
            if (item.role != "main") {
                return (
                    <option key={item.id} value={item.id + "^" + item.name}>
                        {item.name} {item.role == "main" ? "(Live)" : ""} {item.isThemeInstalled == true ? "(Installed)" : ""}
                    </option>
                );
            } else {
                return (
                    <option key={item.id} value={item.id + "^" + item.name}>
                        {item.name} (Live) {item.isThemeInstalled == true ? "(Installed)" : ""}
                    </option>
                );
            }
        }),
    ];

    const ThemeSubmit = () => {
        setBtnLOading(true)
        let token = localStorage.getItem("wd-admin-token");
        if (selectedId !== undefined || selectedId !== null) {
            console.log("selectedId: ", selectedId);
            sellerThemeList.forEach((Theme) => {
                if (Theme.id == selectedId) {
                    const apiUrl = config.APIURL + `/installCode/SaveThemeSettings?_id=${_id}`;
                    const data = {
                        ThemeId: Theme.id,
                        ThemeName: Theme.name,
                        ThemeStoreId: Theme.theme_store_id,
                        InstallCode: installFile,
                    };
                    POST_DATA(`${apiUrl}`, data, token)
                        .then((data) => {
                            if (data.status === "success") {
                                setSuccessTost(true)
                                setSuccessTostContent(data.message)
                                setBtnLOading(false)
                            }
                            else if (data.status === 'error') {
                                setErrorTost(true)
                                setErrorContent(data.message)
                                setBtnLOading(false)
                            }
                            else {
                                setErrorTost(true)
                                setErrorContent("something went wrong")
                                setBtnLOading(false)
                            }
                        })
                        .catch((err) => {
                            console.log(`ADD_PRODUCT_TO_CART_PRO ${err}`);
                            setErrorTost(true)
                            setErrorContent(err.message)
                            setBtnLOading(false)
                        });
                }
            });
        }
        else {
            setErrorTost(true)
            setErrorContent("select theme first")
        }
    };

    const _ThemeInstallModal = (
        <Modal
            open={modalActive}
            onClose={handleModalChange}
            title="Install Code in seller Theme"
            primaryAction={{
                content: "Install Code",
                onAction: ThemeSubmit,
                loading:btnLoading
            }}
            secondaryActions={[
                {
                    content: "Cancel",
                    onAction: handleModalChange,
                },
            ]}
        >
            <Modal.Section>
                <VerticalStack gap="5">
                    <Text fontWeight="bold" variant="headingSm">
                        Choose which code you want to install
                    </Text>
                    <Box>
                        <HorizontalGrid gap="4" columns={2}>
                            <RadioButton label="Default code" checked={installFile === "defaultCode"} id="defaultCode" name="accounts" onChange={handleInstallCodeFile} />
                            <RadioButton label="SubTotal code" id="DiscountOnSubtotal" name="accounts" checked={installFile === "DiscountOnSubtotal"} onChange={handleInstallCodeFile} />
                        </HorizontalGrid>
                    </Box>
                    <Text fontWeight="bold">Select theme</Text>
                    <Box>
                        <div className="">
                            <div className="Polaris-Select" value={selected}>
                                <select onChange={handleSelectChange} id="PolarisSelect1" className="Polaris-Select__Input" aria-invalid="false" defaultValue={selected}>
                                    {options}
                                </select>
                                <div className="Polaris-Select__Content" aria-hidden="true">
                                    <span className="Polaris-Select__SelectedOption">{selected}</span>
                                    <span className="Polaris-Select__Icon">
                                        <span className="Polaris-Icon">
                                            <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                <path d="M13 8l-3-3-3 3h6zm-.1 4L10 14.9 7.1 12h5.8z" fillRule="evenodd"></path>
                                            </svg>
                                        </span>
                                    </span>
                                </div>
                                <div className="Polaris-Select__Backdrop"></div>
                            </div>
                        </div>
                    </Box>
                </VerticalStack>
            </Modal.Section>
        </Modal>
    );
   
    const themeUninstallCode = (<Modal
        // activator={activatorModal}
        open={uninstallactiveModal}
        onClose={handleModalUninsatllChange}
        title="Select theme to remove our app's code"
        footer={
     
          // <Stack alignment="trailing" distribution="trailing">
          //   <Stack.Item>
          //   <Button onClick={handleModalUninsatllChange}>Cancel</Button>
          //   </Stack.Item>
          //   <Stack.Item>
          //   <Button destructive onClick={UninsallSubmit}>{uninsallsubmitButtonText}</Button>
          //   </Stack.Item>
          // </Stack>
   

<div className="Custome_Stack">
<div className="Custome_Stack_Item"> 
<Button destructive onClick={UninsallSubmit}>{uninsallsubmitButtonText}</Button>
&nbsp;&nbsp;&nbsp; <Button onClick={handleModalUninsatllChange}>Cancel</Button></div>

{/* <div className="Custome_Stack_Item"> 

</div> */}
</div>

        }
      >
        <Modal.Section>
         
            {/* Dropdown to list theme names   */}
            <div className="">
              <div className="Polaris-Select" value={uninsallselected}>
                <select
                  onChange={UninstallhandleSelectChange}
                  id="PolarisSelect1"
                  className="Polaris-Select__Input"
                  aria-invalid="false"
                  defaultValue={uninsallselected}
                >
                  {uninsatlloptions}
                </select>
                <div
                  className="Polaris-Select__Content"
                  aria-hidden="true"
                >
                  <span className="Polaris-Select__SelectedOption">
                    {uninsallselected}
                  </span>
                  <span className="Polaris-Select__Icon">
                    <span className="Polaris-Icon">
                      <svg
                        viewBox="0 0 20 20"
                        className="Polaris-Icon__Svg"
                        focusable="false"
                        aria-hidden="true"
                      >
                        <path
                          d="M13 8l-3-3-3 3h6zm-.1 4L10 14.9 7.1 12h5.8z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </span>
                </div>
                <div className="Polaris-Select__Backdrop"></div>
              </div>
            </div>
            <Layout.Section>
              <div className="submit-btn" style={{ marginLeft: "-20px" }}>
              {uninsallbtext}
                <b>{Uninsalltext}</b>
                {uninsallatext}
              </div>
            </Layout.Section>
    
        </Modal.Section>
      </Modal>)
      
    const handleEditTheme = (fileEdit,filePath) => {
        let tempFileObj = {};
        tempFileObj.shopDetails = shopThemeDetails.shopDetails;
        tempFileObj.themeId = shopThemeDetails.ThemeId;
        tempFileObj.fileEdit = fileEdit;
        tempFileObj.filePath = filePath;
        navigate("/EditAssetThemeExtensionPage", { state: tempFileObj });
    };

    const rows = sellerThemeList?.map((item, index) => {
        return [
            <Text>{index + 1}</Text>,
            <Text>{sellerThemeFile[index]}</Text>,
            <Text>
                <DateAndTimeHook FullDate={new Date()} />
            </Text>,
            <Text>
                <DateAndTimeHook FullDate={new Date()} />
            </Text>,
            <Text>
                Extesntion Files
            </Text>,
            <Button size="slim" onClick={() => handleEditTheme(sellerThemeFile[index],sellerThemeFilePath[index])}>
                <Text fontWeight="medium">Edit</Text>
            </Button>,
        ];
    });

    return (
        <React.Fragment>
            {isLoading ? (
                <Loading />
            ) : (
                <Page
                    breadcrumbs={[
                        {
                            content: "ListingPage",
                            onAction: () => {
                                navigate("/AssetThemeExtesntion");
                            },
                        },
                    ]}
                    fullWidth
                    title={shopDetails?.shop_owner ?? "no shop owner"}
                    compactTitle
                    subtitle={MyShopifyDomain} 
                >
                    <DataTable
                        columnContentTypes={["text", "text", "text", "text", "text"]}
                        headings={[
                            <Text variant="bodyLg" fontWeight="bold">
                                No.
                            </Text>,
                            <Text variant="bodyLg" fontWeight="bold">
                                Name
                            </Text>,
                            <Text variant="bodyLg" fontWeight="bold">
                                Created At
                            </Text>,
                            <Text variant="bodyLg" fontWeight="bold">
                                Updated At
                            </Text>,
                            <Text variant="bodyLg" fontWeight="bold">
                                Role
                            </Text>,
                            <Text variant="bodyLg" fontWeight="bold">
                                Actions
                            </Text>,
                        ]}
                        rows={rows}
                        footerContent={`Showing ${rows.length} of ${rows.length} results`}
                    />
                    {themeUninstallCode}
                    {_ThemeInstallModal}
                    {successToastMarkup}
                    {errorTostMarkup}
                </Page>
            )}
        </React.Fragment>
    );
};

export default AssetExtensionCode;

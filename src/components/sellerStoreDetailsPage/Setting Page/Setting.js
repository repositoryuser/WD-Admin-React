import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Page, Icon, ColorPicker, AlphaCard, Modal, FooterHelp, Toast, Select, Layout, LegacyCard, VerticalStack, Spinner, Divider, Text, LegacyStack, Link, RadioButton, Button, TextField, FormLayout } from '@shopify/polaris';
import { ClipboardMinor } from '@shopify/polaris-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { AuthContext } from '../../../ContextApi/AuthContext';
import config from '../../../config.json'
import './Setting.css'

const Setting = () => {

    const navigate = useNavigate();
    const { isStore } = useContext(AuthContext);
    const { myShopifyDomain } = useParams();

    const [colorPicked, setColorPicked] = useState({
        hue: 120,
        brightness: 1,
        saturation: 1,
    });


    const [value, setValue] = useState();
    const [color, setColor] = useState();
    const [show, setShow] = useState(false);
    const [fontSize, setFontSize] = useState();
    const [fontWeight, setFontWeight] = useState();
    const [messageText, setMessageText] = useState();
    const [isTable, setIsTable] = useState();
    const [isApp, setIsApp] = useState();
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState();
    const [showToken, setShowToken] = useState(false);
    const [generatedToken, setGeneratedToken] = useState();
    const [themeOptions, setThemeOptions] = useState([]);
    const [themeArr, setThemeArr] = useState([]);

    // Spinners
    const [modalSpinner, setModalSpinner] = useState(false);
    const [btnIsAppLoader, setBtnIsAppLoader] = useState(false);
    const [btnIsTableLoader, setBtnIsTableLoader] = useState(false);
    const [btnDiscountTypeLoader, setBtnDiscountypeLoader] = useState(false)
    const [uninstallThemeLoader, setUninstallThemeLoader] = useState(false)
    const [updateThemeLoader, setUpdateThemeLoader] = useState(false);
    const [generateTokenLoader, setGenerateTokenLoader] = useState(false);

    // toast variables
    const [successActive, setSuccessActive] = useState(false);
    const [errorActive, setErrorActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();

    const toggleSuccessActive = useCallback(() => setSuccessActive((active) => !active), []);
    const toastSuccessMarkup = successActive ? (
        <Toast content={successMessage} onDismiss={toggleSuccessActive} />
    ) : null;

    const toggleErrorActive = useCallback(() => setErrorActive((active) => !active), []);
    const toastErrorMarkup = errorActive ? (
        <Toast content={errorMessage} error onDismiss={toggleErrorActive} />
    ) : null;


    useEffect(() => {
        if (!isStore) {
            navigate('/ListingPage');
        } else {
            getAllData();
        }
    }, []);

    const getAllData = async () => {
        try {
            const response = await fetch(config.APIURL + '/FrontEndSettings/GetFrontEndSettings?Shop=' + myShopifyDomain, {
                method: 'GET', headers: new Headers({ "ngrok-skip-browser-warning": "69420", })
            });

            const isAppResponse = await fetch(config.APIURL + '/AppEnableDisableRoute/GetEnableDisable?Shop=' + myShopifyDomain, {
                method: 'GET', headers: new Headers({ "ngrok-skip-browser-warning": "69420", })
            });

            const discountTypeResponse = await fetch(config.APIURL + '/ChangeStoreType/getDiscountType?Shop=' + myShopifyDomain, {
                method: 'GET', headers: new Headers({ "ngrok-skip-browser-warning": "69420", })
            });
            let discountType = await discountTypeResponse.json();
            if(discountType.status=="success"){
                setValue(discountType.discountType === "DiscountOnSubtotal" ? 'one' : 'two');
            }
            else{
                setErrorMessage(discountType.message);
                toggleErrorActive();
            }

            let appBool = await isAppResponse.json();
            setIsApp(appBool.message);
            let result = await response.json();
            if (result.status === "success") {
                let data = result.message;
                setFontWeight(data.FontWeight);
                setFontSize(data.textFontSize);
                setColor(data.bodyTextColor);
                setMessageText(data.messageStyleBox)
            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
            }
        } catch (err) {
            setErrorMessage("Something went wrong");
            toggleErrorActive();
        }
    }

    const getAllTheme = async () => {
        setModalSpinner(true);
        try {
            const response = await fetch(config.APIURL + '/SelectThemeRoute/GetThemeList?Shop=' + myShopifyDomain, {
                method: 'GET', headers: new Headers({ "ngrok-skip-browser-warning": "69420" })
            });
            let result = await response.json();
            if (result.status === "success") {
                let data = result.message;
                let arr = [];
                let arr2 = [];
                for (let i = 0; i < data.length; i++) {
                    arr.push(data[i]);
                    arr2.push({ label: data[i].name, value: data[i].name });
                }
                setThemeArr(arr);
                setThemeOptions(arr2);
                setModalSpinner(false);
            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
                setModalSpinner(false);
            }
        } catch (err) {
            setErrorMessage("Something went wrong");
            toggleErrorActive();
            setModalSpinner(false);
        }
    }

    const updateThemeSetting = async () => {
        setUpdateThemeLoader(true);
        try {
            const response = await fetch(config.APIURL + '/FrontEndSettings/UpdateFrontEndSettings', {
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(
                    {
                        NotificationStatus: true,
                        bodyTextColor: color,
                        textAlign: "center",
                        FontWeight: fontWeight,
                        textFontSize: fontSize,
                        messageStyleBox: messageText,
                        Shop: myShopifyDomain
                    }
                )
            });
            let result = await response.json();
            if (result.status === "success") {
                setSuccessMessage(result.message);
                toggleSuccessActive();
                setUpdateThemeLoader(false);
            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
                setUpdateThemeLoader(false);
            }
        } catch (err) {
            setErrorMessage("Something went wrong");
            toggleErrorActive();
            setUpdateThemeLoader(false);
        }
    }

    const uninstallTheme = async () => {
        setUninstallThemeLoader(true);
        const theme = themeArr.filter((e) => {
            return e.name === selected;
        })
        try {
            const response = await fetch(config.APIURL + '/SelectThemeRoute/Uninstallthemecode', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    ThemeId: theme[0].id,
                    ThemeName: theme[0].name,
                    ThemeStoreId: theme[0].theme_store_id,
                    Shop: myShopifyDomain
                })
            });
            let result = await response.json();
            if (result.status === "success") {
                setSuccessMessage(result.message);
                toggleSuccessActive()
                setUninstallThemeLoader(false);

            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
                setUninstallThemeLoader(false);
            }
        } catch (err) {
            setErrorMessage("Soemthing went wrong");
            toggleErrorActive();
            setUninstallThemeLoader(false);

        }
        handleChange();
    }

    const changeDiscountType = async () => {
        setBtnDiscountypeLoader(true);
        try {
            const response = await fetch(config.APIURL + '/ChangeStoreType/updateDiscountType', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    Shop: myShopifyDomain,
                    discountType: value === 'one' ? "DiscountOnSubtotal" : "DiscountOnQuantity"
                })
            });
            let result = await response.json();
            if (result.status === "success") {
                setSuccessMessage(result.message);
                toggleSuccessActive()
                setBtnDiscountypeLoader(false);
            }
            else {
                console.log(response.message);
                setBtnDiscountypeLoader(false);
            }
        } catch (err) {
            console.log("err", err);
            setBtnDiscountypeLoader(false);
        }
    }

    const changeTableStatus = async () => {
        setBtnIsTableLoader(true)
        try {
            const response = await fetch(config.APIURL + '/AppEnableDisableRoute/appenabletable', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    Shop: myShopifyDomain,
                    IsTable: !isTable
                })
            });
            let result = await response.json();
            if (result.status === "success") {
                setSuccessMessage(result.message);
                toggleSuccessActive()
                setIsTable(!isTable);
                setBtnIsTableLoader(false)
            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
                setBtnIsTableLoader(false)
            }
        } catch (err) {
            setErrorMessage("Soemthing went wrong");
            toggleErrorActive();
            setBtnIsTableLoader(false)
        }
    }

    const changeAppStatus = async () => {
        setBtnIsAppLoader(true)
        try {
            const response = await fetch(config.APIURL + '/AppEnableDisableRoute/UpdateEnableDisable', {
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    Shop: myShopifyDomain,
                    IsAppEnable: !isApp
                })
            });
            let result = await response.json();
            if (result.status === "success") {
                setSuccessMessage(result.message);
                toggleSuccessActive()
                setIsApp(!isApp);
                setBtnIsAppLoader(false)
            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
                setBtnIsAppLoader(false)
            }
        } catch (err) {
            setErrorMessage("Soemthing went wrong");
            toggleErrorActive();
            setBtnIsAppLoader(false)
        }
    }

    const checkAppStatus = () => {
        setErrorMessage("Please Enable The App")
        toggleErrorActive();
    }

    const handleSelectChange = useCallback(
        (value) => setFontWeight(value),
        [],
    );

    const options = [
        { label: 'Bold', value: 'bold' },
        { label: 'Normal', value: 'normal' },
    ];

    const changeColor = (e) => setColor(e);

    const handleFontSizeChange = (newValue) => setFontSize(newValue);

    const handleMessageTextChange = (newValue) => setMessageText(newValue);

    const handleChangePos = (_checked, newValue) => setValue(newValue);

    const handleChange = () => {
        if (!active) {
            getAllTheme();
        }
        setActive(!active);
    };

    const handleThemeChange = (value) => setSelected(value);

    const copyToken = (valuetext) => {
        navigator.clipboard.writeText(valuetext);
        setShowToken(true);
    }

    const createToken = () => {
        setGeneratedToken("token");
        setShowToken(true);
    }

   

    const handleNavigate = () => {
        navigate(`/DisplaySetting/${myShopifyDomain}`);
    }

    const back_redirect = () => {
        navigate(`/DetailsPage`);
    }

    const titleWithBackButton = <div style={{ display: "flex" }}>
        <div style={{ height: "35px", width: "35px", cursor: "pointer" }} onClick={back_redirect}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ padding: "5px", border: "1px solid lightgray" }}>
                <path d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z" fill="#5C5F62" />
            </svg>
        </div>
        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
            Setting
        </span></div>;

    return (
        <div onClick={() => { if (show === true) setShow(false) }}>
            <Page title={titleWithBackButton} divider >
                <Layout>
                    <Layout.AnnotatedSection title="Change App Type">

                        <AlphaCard>
                            <LegacyStack distribution='fill'>
                                <RadioButton
                                    label="Discount on Subtotal"
                                    id="one"
                                    name="accounts"
                                    checked={value === 'one'}
                                    onChange={handleChangePos}
                                />
                                <RadioButton
                                    label="Discount on Quantity"
                                    id="two"
                                    name="accounts"
                                    checked={value === 'two'}
                                    onChange={handleChangePos}
                                />
                            </LegacyStack>
                            <FormLayout.Group>
                                <Button onClick={changeDiscountType} loading={btnDiscountTypeLoader} primary alignment='center' size='slim'>Save</Button>
                            </FormLayout.Group>
                        </AlphaCard>
                    </Layout.AnnotatedSection>

                    <Divider borderColor="border" />

                    <Divider borderColor="border" />

                    <Layout.AnnotatedSection title="Discount Display Settings"
                        description="Select a Layout to display the discount details on the product details page. You can also customize the look
                        and the feel of the discount layout and make it compatible to your store theme.">

                        <AlphaCard>
                            <FormLayout.Group>
                                <LegacyStack>
                                    <LegacyStack.Item fill>

                                        <Text variant="headingMd" alignment="justify" as="h5">
                                            The App is {!isApp ? "Enabled" : "Disabled"}
                                        </Text>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item>

                                        <Button loading={btnIsAppLoader} onClick={changeAppStatus} primary={!isApp}>
                                            <Text fontWeight='bold'>{!isApp ? "Disable" : "Enable"}</Text>
                                        </Button>
                                    </LegacyStack.Item>

                                </LegacyStack>
                            </FormLayout.Group>
                            <FormLayout.Group>

                                <LegacyStack>
                                    <LegacyStack.Item fill>
                                        <Text variant="headingMd" alignment="justify" as="h5">
                                            Manage Discount Layout
                                        </Text>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item>
                                        <Button onClick={handleNavigate} primary>
                                            <Text fontWeight='bold'>Customize Layout</Text>
                                        </Button>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </FormLayout.Group>

                        </AlphaCard>
                    </Layout.AnnotatedSection>

                    <Divider borderColor="border" />

                    <Layout.AnnotatedSection title="Product Page Table Setting">
                        <AlphaCard>
                            <LegacyStack>
                                <LegacyStack.Item fill>
                                    <Text variant="headingMd" alignment="justify" as="h5">
                                        The Table is {isTable ? "Enabled" : "Disabled"}
                                    </Text>
                                </LegacyStack.Item>
                                <LegacyStack.Item>
                                    <Button loading={btnIsTableLoader} onClick={!isApp ? changeTableStatus : checkAppStatus} primary={isTable}>
                                        <Text fontWeight='bold'>{isTable ? "Disable" : "Enable"}</Text>
                                    </Button>
                                </LegacyStack.Item>
                            </LegacyStack>
                        </AlphaCard>
                    </Layout.AnnotatedSection>

                    <Divider borderColor="border" />

                    <Layout.AnnotatedSection title=" Savings Message Settings"
                        description=" Customize savings message to display on the cart page.">

                        <LegacyCard title="Cart Page Savings Message" sectioned>

                            <FormLayout>
                                <FormLayout.Group>
                                    <TextField
                                        label="Message Text:"
                                        type="text"
                                        value={messageText}
                                        onChange={handleMessageTextChange}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="Text Font Size:"
                                        type="number"
                                        value={fontSize}
                                        onChange={handleFontSizeChange}
                                        autoComplete="off"
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Select
                                        label="Text Font Weight"
                                        options={options}

                                        onChange={handleSelectChange}
                                        value={fontWeight}
                                    />
                                    <div style={{ position: "absolute", zIndex: "2" }}>

                                        <TextField
                                            suffix={<div className="circle" onClick={() => { setShow(true) }} style={{ backgroundColor: `${color}`, padding: "2px" }}  >

                                            </div>}

                                            label="Text Font Color:"
                                            value={color}
                                            onChange={(e) => changeColor(e)}
                                            autoComplete="off"
                                        />
                                        {
                                            show && <ChromePicker
                                                styles={{ position: "absolute", zIndex: "2" }}
                                                color={color}
                                                onChange={(color) => { setColor(color.hex); }}
                                            />
                                        } </div>
                                </FormLayout.Group>
                                <LegacyStack>
                                    <LegacyStack.Item fill>
                                        <Button loading={updateThemeLoader} onClick={updateThemeSetting} primary >Save</Button>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item>
                                        <Button onClick={getAllData} primary>Default</Button>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </FormLayout>
                        </LegacyCard>
                    </Layout.AnnotatedSection>

                    <Divider borderColor="border" />

                    <Layout.AnnotatedSection title="Token"
                        description={<p>If you have a Shopify integration on other platforms like Mobile app. You can fetch our tiered discounts by our APIs. <a target="_blank" href="https://ctdapi.anncode.com/api-doc/#">Click here</a> for more info.</p>}>                <AlphaCard>
                            <FormLayout.Group>
                                <LegacyStack>
                                    <LegacyStack.Item fill>
                                        <Text variant="headingMd" alignment="justify" as="h5">
                                            Generate Token for APIs
                                        </Text>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item>
                                        <Button onClick={createToken} loading={generateTokenLoader} primary>
                                            <Text fontWeight='bold'>Generate Token</Text>
                                        </Button>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </FormLayout.Group>
                            <FormLayout.Group>
                                {showToken && <TextField
                                    value="generated token "
                                    readOnly
                                    suffix={
                                        <span style={{ cursor: "pointer" }}>
                                            <Icon
                                                onClick={copyToken}
                                                source={ClipboardMinor}
                                                tone="base"
                                            />
                                        </span>
                                    }
                                />
                                }
                            </FormLayout.Group>
                        </AlphaCard>
                    </Layout.AnnotatedSection>

                    {/* <Divider borderColor="border" />
                    <FormLayout>
                        <FormLayout.Group>
                            <FormLayout.Group>
                                <Text variant="headingLg" as="h5">
                                    Change Font Style
                                </Text>
                            </FormLayout.Group>
                            <AlphaCard>
                                <LegacyStack>
                                    <LegacyStack.Item fill>
                                        <Text variant="headingMd" alignment="justify" as="h5">
                                            Font Style
                                        </Text>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item>
                                        <Button primary>
                                            <Text fontWeight='bold'>Enable</Text>
                                        </Button>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </AlphaCard>
                        </FormLayout.Group>
                    </FormLayout> */}

                </Layout>

                <FooterHelp>
                    <center>
                        <div>Learn more about{' '}
                            <a href="https://apps.shopify.com/custom-tiered-discount" target="_blank">Tiered Discount by AnnCode App</a>
                        </div>
                        <div>
                            More apps from{' '}
                            <a href="https://apps.shopify.com/partners/anncode-solutions" target="_blank">Anncode Solutions</a>
                        </div>
                    </center>
                </FooterHelp>

                {toastSuccessMarkup}
                {toastErrorMarkup}
            </Page>

        </div>
    )
}
export default Setting;
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Page, Modal, FooterHelp, AlphaCard, Toast, Select, LegacyCard, Layout, Divider, Text, LegacyStack, Button, TextField, FormLayout } from '@shopify/polaris';
import { useNavigate, useParams } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { SketchPicker } from 'react-color';
import { AuthContext } from '../../../ContextApi/AuthContext';
import config from '../../../config.json'
import './Setting.css'
import one from './Default.png'
import two from './Quantity_Range.png'
import three from './Detailed.png'
import four from './Simple_message.png'
import DemoImage from './Example_image.png'
// import { Layout } from 'antd';

const DisplaySetting = () => {

    const navigate = useNavigate();
    const { isStore } = useContext(AuthContext);
    const { myShopifyDomain } = useParams();

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [selected, setSelected] = useState('Default');
    const [selectedImage, setSelectedImage] = useState(one);
    const [activeModal, setActiveModal] = useState(false);
    const [updateBtnCssLoader, setUpdateCssLoader] = useState(false);

    //  CSS setting variable
    const [thMinQty, seTthMinQty] = useState();
    const [thBuyText, seTthBuyText] = useState();
    const [thMaxQty, setThMaxQty] = useState();
    const [thDiscountText, setThDiscountText] = useState();
    const [thBgColor, setThBgColor] = useState();
    const [tbBgcolor, setTbBgcolor] = useState();
    const [thTextFontColor, setThTextFontColor] = useState();
    const [tbTextFontColor, setTbTextFontColor] = useState();
    const [tOutlineColor, setTOutlineColor] = useState();
    const [thFontSize, setThFontSize] = useState();
    const [tbFontSize, setTbFontSize] = useState();
    const [thFontWeight, setThFontWeight] = useState();
    const [thTextTransform, setThTextTransform] = useState();
    const [tbFontWeight, setTbFontWeight] = useState();
    const [textAlign, setTextAlign] = useState();
    const [bodyMessage, setBodyMessage] = useState();

    // toast variables
    const [successActive, setSuccessActive] = useState(false);
    const [errorActive, setErrorActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();

    const options = [
        { label: 'Default', value: 'Default' },
        { label: 'Quantity Range Grid', value: 'Quantity Range Grid' },
        { label: 'Detailed Grid', value: 'Detailed Grid' },
        { label: 'Simple Message', value: 'Simple Message' },
    ];

    const textAlignOptions = [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
    ]

    const thFontWeightOptions = [
        { label: 'Normal', value: 'normal' },
        { label: 'Bold', value: 'bold' },
    ]

    const tbFontWeightOptions = [
        { label: 'Normal', value: 'normal' },
        { label: 'Bold', value: 'bold' },
    ]

    const thTextTransformOptions = [
        { label: 'Initials', value: 'initial' },
        { label: 'Lowercase', value: 'lowercase' },
        { label: 'Uppercase', value: 'uppercase' },
    ]

    const toggleSuccessActive = useCallback(() => setSuccessActive((active) => !active), []);
    const toastSuccessMarkup = successActive ? (
        <Toast content={successMessage} onDismiss={toggleSuccessActive} />
    ) : null;

    const toggleErrorActive = useCallback(() => setErrorActive((active) => !active), []);
    const toastErrorMarkup = errorActive ? (
        <Toast content={errorMessage} error onDismiss={toggleErrorActive} />
    ) : null;

    const handleTextAlignChange = (value) => setTextAlign(value);
    const handleThFontWeightChange = (value) => setThFontWeight(value);
    const handleTbFontWeightChange = (value) => setTbFontWeight(value);
    const handleTextTransFormChange = (value) => setThTextTransform(value);
    const handleMinQtyChange = (val) => seTthMinQty(val);
    const handleBuyChange = (val) => seTthBuyText(val);
    const handleDiscountChange = (val) => setThDiscountText(val);
    const handlethbgColorChange = (val) => setThBgColor(val);
    const handletbFontColorChange = (val) => setTbTextFontColor(val);
    const handlethFontsizeChange = (val) => setThFontSize(val);
    const handletbFontsizeChange = (val) => setTbFontSize(val);

    useEffect(() => {
        if (!isStore) {
            navigate(`/ListingPage/${myShopifyDomain}`);
        } else {

            getAllData();
        }
    }, []);

    const setDefaultData = () => {
        seTthMinQty("Minimum Quantity");
        seTthBuyText("Buy");
        setThMaxQty("");
        setThDiscountText("Discount");
        setThBgColor("#FFFFFF");
        setTbBgcolor("#FFFFFF");
        setThTextFontColor("#000000");
        setTbTextFontColor("#000000");
        setTOutlineColor("#000000");
        setThFontSize("14");
        setTbFontSize("14");
        setThFontWeight("normal");
        setThTextTransform("initial");
        setTbFontWeight("normal");
        setTextAlign("center");
        setBodyMessage("");
    }

    const getAllData = async () => {
        try {
            const response = await fetch(config.APIURL + '/CssSettingsRoute/GetCssSettings?Shop=' + 'custom-tiered-discount-demo.myshopify.com', {
                method: 'GET', headers: new Headers({ "ngrok-skip-browser-warning": "69420", })
            });
            let result = await response.json();
            if (result.status === "success") {
                let data = result.message;

                seTthMinQty(data.thMinQty);
                seTthBuyText(data.thBuyText);
                setThMaxQty(data.thMaxQty);
                setThDiscountText(data.thDiscountText);
                setThBgColor(data.thBgColor);
                setTbBgcolor(data.tbBgcolor);
                setThTextFontColor(data.thTextFontColor);
                setTbTextFontColor(data.tbTextFontColor);
                setTOutlineColor(data.tOutlineColor);
                setThFontSize(data.thFontSize);
                setTbFontSize(data.tbFontSize);
                setThFontWeight(data.thFontWeight);
                setThTextTransform(data.thTextTransform);
                setTbFontWeight(data.tbFontWeight);
                setTextAlign(data.textAlign);
                setBodyMessage(data.bodyMessage);
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

    const updateCssSetting = async () => {
        setUpdateCssLoader(true);
        try {
            const response = await fetch(config.APIURL + '/CssSettingsRoute/UpdateCssSettings', {
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(
                    {
                        table: "table1",
                        thMinQty: thMinQty,
                        thBuyText: thBuyText,
                        thMaxQty: "",
                        thDiscountText: thDiscountText,
                        thBgColor: thBgColor,
                        tbBgcolor: tbBgcolor,
                        thTextFontColor: thTextFontColor,
                        tbTextFontColor: tbTextFontColor,
                        tOutlineColor: tOutlineColor,
                        thFontSize: thFontSize,
                        tbFontSize: tbFontSize,
                        thFontWeight: thFontWeight,
                        thTextTransform: thTextTransform,
                        tbFontWeight: tbFontWeight,
                        textAlign: textAlign,
                        Shop: myShopifyDomain
                    }
                )
            });
            let result = await response.json();
            if (result.status === "success") {
                setSuccessMessage(result.message);
                toggleSuccessActive();
                setUpdateCssLoader(false);
            }
            else {
                setErrorMessage(result.message);
                toggleErrorActive();
                setUpdateCssLoader(false);
            }
        } catch (err) {
            setErrorMessage("Something went wrong");
            toggleErrorActive();
            setUpdateCssLoader(false);
        }
    }

    const handleModalChange = useCallback(async () => {
        setActiveModal(!activeModal);
    }, [activeModal]);

    const openModal = <Modal
        open={activeModal}
        onClose={handleModalChange}
        title="Your product detail page will look like this"
    >
        <Modal.Section>
            <img
                alt=""
                width="100%"
                height="100%"
                src={DemoImage}
            />
        </Modal.Section>
    </Modal>

    const handleSelectChange = (value) => {
        if (value == 'Default') {
            setSelectedImage(one);
        }
        else if (value == 'Quantity Range Grid') {
            setSelectedImage(two);
        }
        else if (value == 'Detailed Grid') {
            setSelectedImage(three);
        }
        else if (value == 'Simple Message') {
            setSelectedImage(four);
        }
        setSelected(value)
    }

    const back_redirect = () => {
        navigate(`/Setting/${myShopifyDomain}`);
    }

    const titleWithBackButton = <div style={{ display: "flex" }}>
        <div style={{ height: "35px", width: "35px", cursor: "pointer" }} onClick={back_redirect}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ padding: "5px", border: "1px solid lightgray" }}>
                <path d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z" fill="#5C5F62" />
            </svg>
        </div>
        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
            Display Setting
        </span></div>;

    return (
        <div onClick={() => { if (show || show2 === true) { setShow(false); setShow2(false) } }}>
            <Page title={titleWithBackButton} divider>
                <Layout>
                    <Layout.AnnotatedSection title="Select Discount Layout"
                        description="Select a Layout to display the discount details on the product detail page and customize the look and feel of the discount layout to make it compatible to your store theme.">

                        <LegacyCard title={<Text variant="headingSm" as="h4">Select Discount Layout</Text>} sectioned>
                            <Select
                                options={options}
                                onChange={handleSelectChange}
                                value={selected}
                            />
                            <br />
                            <img
                                alt=""
                                width="100%"
                                height="80px"
                                src={selectedImage}
                            />
                            <Button plain onClick={handleModalChange}>See how it looks to your customers</Button>
                        </LegacyCard>
                    </Layout.AnnotatedSection>

                    {openModal}

                    <Divider borderColor="border" />


                    <Layout.AnnotatedSection
                        title='Select Discount Layout'
                        description='Customize the discount layout according to the store theme.'>
                        <AlphaCard>
                            <FormLayout>
                                <FormLayout.Group>

                                    <TextField
                                        label="Minimum Quantity:"
                                        type="text"
                                        value={thMinQty}
                                        onChange={handleMinQtyChange}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="Buy:"
                                        type="text"
                                        value={thBuyText}
                                        onChange={handleBuyChange}
                                        autoComplete="off"
                                    />
                                </FormLayout.Group>


                                <FormLayout.Group>

                                    <TextField
                                        label="Discount:"
                                        type="text"
                                        value={thDiscountText}
                                        onChange={handleDiscountChange}
                                        autoComplete="off"
                                    />
                                    <div style={{ position: "absolute", zIndex: "9999" }}>

                                        <TextField
                                            label="Header backgound color:"
                                            type="text"
                                            suffix={<div className="circle" onClick={() => { setShow2(true) }} style={{ backgroundColor: `${thBgColor}` }}  >

                                            </div>}
                                            value={thBgColor}
                                            onChange={handlethbgColorChange}
                                            autoComplete="off"
                                        />
                                        {
                                            show2 && <ChromePicker
                                                color={thBgColor}
                                                onChange={(color) => { setThBgColor(color.hex); }}
                                            />
                                        }
                                    </div>
                                </FormLayout.Group>

                                <FormLayout.Group>
                                    <div style={{ position: "absolute", zIndex: "9999" }}>
                                        <TextField
                                            label="Body text font color:"
                                            type="text"
                                            value={tbTextFontColor}
                                            suffix={<div className="circle" onClick={() => { setShow(true) }} style={{ backgroundColor: `${tbTextFontColor}` }}  >

                                            </div>}
                                            onChange={handletbFontColorChange}
                                        />
                                        {
                                            show && <ChromePicker
                                                color={tbTextFontColor}
                                                onChange={(color) => { setTbTextFontColor(color.hex); }}
                                            />
                                        }
                                    </div>
                                    <TextField
                                        label="Header text font size:"
                                        type="number"
                                        value={thFontSize}
                                        onChange={handlethFontsizeChange}
                                        autoComplete="off"
                                    />
                                </FormLayout.Group>


                                <FormLayout.Group>

                                    <TextField
                                        label="Body text font size (in px):"
                                        type="number"
                                        value={tbFontSize}
                                        onChange={handletbFontsizeChange}
                                        autoComplete="off"
                                    />
                                    <Select
                                        label="Header text font weight (in px):"
                                        options={thFontWeightOptions}
                                        value={thFontWeight}
                                        onChange={handleThFontWeightChange}
                                    />
                                </FormLayout.Group>


                                <FormLayout.Group>
                                    <Select
                                        label="Text transform:"
                                        options={thTextTransformOptions}
                                        value={thTextTransform}
                                        onChange={handleTextTransFormChange}
                                    />
                                    <Select
                                        label="Body text font weight:"
                                        type="text"
                                        options={tbFontWeightOptions}
                                        value={tbFontWeight}
                                        onChange={handleTbFontWeightChange}
                                    />


                                    <Select
                                        label="Text align:"
                                        type="text"
                                        options={textAlignOptions}
                                        value={textAlign}
                                        onChange={handleTextAlignChange}
                                    />
                                </FormLayout.Group>

                            </FormLayout>
                            <FormLayout.Group>
                                <LegacyStack>
                                    <LegacyStack.Item fill>
                                        <Button loading={updateBtnCssLoader} onClick={updateCssSetting} primary >Save</Button>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item>
                                        <Button onClick={setDefaultData} primary>Default</Button>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </FormLayout.Group>
                        </AlphaCard>
                    </Layout.AnnotatedSection>
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
        </div >
    )
}

export default DisplaySetting
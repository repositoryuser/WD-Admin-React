import React, { useState, useCallback } from "react";
import { AlphaCard, HorizontalGrid, VerticalStack, Text, TextField, Button, Toast, ButtonGroup } from "@shopify/polaris";
import postData from "../../../Hooks/POSTAPI";
import config from "../../../config.json";
import Axios from "axios";
import { useMediaQuery } from "react-responsive";


const TagGroup = ({ MyShopifyDomain }) => {
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    //customer email
    const [customerEmail, setCustomerEmail] = useState(null);
    const handleCustomerEmail = useCallback((newValue) => setCustomerEmail(newValue), []);
    //customer tag
    const [customerTag, setCustomerTag] = useState(null);
    const handleCustomerTag = useCallback((newValue) => setCustomerTag(newValue), []);

    //success Toast
    const [successTost, setSuccessTost] = useState(false);
    const [successTostContent, setSuccessTostContent] = useState("");
    const toggleSuccessActive = useCallback(() => setSuccessTost((successTost) => !successTost), []);
    const successToastMarkup = successTost ? <Toast content={successTostContent} onDismiss={toggleSuccessActive} /> : null;
    //error Toast
    const [errorTost, setErrorTost] = useState(false);
    const toggleErrorTost = useCallback(() => setErrorTost((errorTost) => !errorTost), []);
    const [errorContent, setErrorContent] = useState("Saving error");
    const errorTostMarkup = errorTost ? <Toast content={errorContent} error onDismiss={toggleErrorTost} /> : null;

    //get all tag
    const [gatTagEmail, setGatTagEmail] = useState(null);
    const handleGatTagEmail = useCallback((newValue) => setGatTagEmail(newValue), []);
    const [allTags, setAllTags] = useState("");

    // delete loader

    const [btnDelLoading, setBtnDelLoading] = useState(false);

    const handelAddTag = async () => {
        if (customerEmail !== null && customerTag !== null) {
            setIsBtnLoading(true);
            postData(`${config.APIURL}/admin/AddTagToCustomer?shop=${MyShopifyDomain}`, {
            email: customerEmail,
            tag: customerTag,
            })
            .then((item) => {
            console.log("item:", item)
            if (item.status === "success") {
            toggleSuccessActive();
            setSuccessTostContent("Tag added");
            setIsBtnLoading(false);
            } else if (item.status === "error") {
            toggleErrorTost();
            setErrorContent(item.message);
            setIsBtnLoading(false);
            } else {
            console.log("if error :")
            toggleErrorTost();
            setErrorContent(item.message);
            setIsBtnLoading(false);
            }
            })
            .catch((error) => {
            console.log("error: ", error);
            toggleErrorTost();
            setErrorContent("Something went wrong");
            setIsBtnLoading(false);
            });
        }
    };

    const getAllTags = () => {
        setBtnLoading(true);
        postData(`${config.APIURL}/admin/GetAllCustomerTags?shop=${MyShopifyDomain}`, {
            email: gatTagEmail
        })
            .then((data) => {
                console.log("data: ", data);
                if (data.status === "success") {
                    setAllTags(data.message);
                    console.log(data.message)
                    toggleSuccessActive();
                    setSuccessTostContent(data.status);
                    setBtnLoading(false);
                } else if (data.status === "error") {
                    setBtnLoading(false);
                    toggleErrorTost();
                    setAllTags('');
                    setErrorContent(data.message);
                } else {
                    setBtnLoading(false);
                    toggleErrorTost();
                    setAllTags('');
                    setErrorContent(data.message);
                }
            })
            .catch((error) => {
                console.log("error: ", error);
                setBtnLoading(false);
                toggleErrorTost();
                setAllTags('');
                setErrorContent(error.message);
            });
    };


    const handleDeleteTag = () => {
        setBtnDelLoading(true);
        postData(`${config.APIURL}/admin/CustomerDeleteTags?shop=${MyShopifyDomain}`, {
            shop: MyShopifyDomain,
            email: customerEmail,
            customerTagstoRemove: customerTag
        })
            .then((data) => {
                console.log("data: ", data);
                if (data.status === "success") {
                    toggleSuccessActive();
                    setSuccessTostContent("Tag deleted successfully");
                    setBtnDelLoading(false);
                } else if (data.status === "error") {
                    setBtnDelLoading(false);
                    toggleErrorTost();
                    setErrorContent("Tag not found");

                } else {
                    setBtnDelLoading(false);
                    toggleErrorTost();
                    setErrorContent("Tag not found");

                }

            }).catch((error) => {
                console.log("error: ", error);
                setBtnDelLoading(false);
                toggleErrorTost();
            })
    };

    return (
        <React.Fragment>
            <HorizontalGrid gap="4" columns={isMobile ? 1 : 2}>
                <AlphaCard>
                    <VerticalStack gap="3" >
                        <Text variant="headingLg" as="h5">
                            Add Tags To Customer Account
                        </Text>
                        <TextField label="Email" type="email" placeholder="Please Enter  Email to Add Tag" value={customerEmail} onChange={handleCustomerEmail} autoComplete="email" />
                        <TextField label="Tag" placeholder="Please Enter Tag  Name" value={customerTag} onChange={handleCustomerTag} autoComplete="off" />
                        <ButtonGroup>
                            <Button  size="large" primary onClick={() => handelAddTag()} loading={isBtnLoading}>
                                <Text >Add Tag</Text>
                            </Button>
                            <Button size="large" destructive onClick={() => handleDeleteTag()} loading={btnDelLoading}>
                                <Text>Delete Tag</Text>
                            </Button>
                        </ButtonGroup>
                    </VerticalStack>
                </AlphaCard>
                <AlphaCard>
                    <VerticalStack gap="3">
                        <Text variant="headingLg" as="h5">
                            Get All Tags
                        </Text>
                        <TextField placeholder="Please Enter Email To find Tags" label="Email" type="email" value={gatTagEmail} onChange={handleGatTagEmail} autoComplete="email" />
                        <Text>{allTags}</Text>

                        <Button size="medium" primary onClick={() => getAllTags()} loading={btnLoading}>
                            <Text>Get All Tags</Text>
                        </Button>
                    </VerticalStack>
                </AlphaCard>
            </HorizontalGrid>
            {successToastMarkup}
            {errorTostMarkup}
        </React.Fragment>
    );
};

export default TagGroup;

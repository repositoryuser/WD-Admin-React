import { AlphaCard, Button, FormLayout, LegacyCard, MediaCard, ResourceItem, ResourceList, Scrollable, Text, TextField, Toast, VerticalStack } from '@shopify/polaris';
import React, { useState, useCallback, useEffect } from "react";
import config from '../../../config.json'

const ProductDetails = ({ MyShopifyDomain }) => {

    const [productId, setProductId] = useState();
    const [productCount, setProductCount] = useState();
    const [productLoader, setProductLoader] = useState(false);
    const [productCheck, setProductCheck] = useState(false);
    const [productTitle, setProductTitle] = useState();
    const [productPrice, setProductPrice] = useState();
    const [productUrl, setProductUrl] = useState();
    const [preview_url, setPreviewUrl] = useState('/');

    //success Toast
    const [successTost, setSuccessTost] = useState(false);
    const [successTostContent, setSuccessTostContent] = useState("");
    const toggleSuccessActive = useCallback(() => setSuccessTost((successTost) => !successTost), []);
    const successToastMarkup = successTost ? <Toast content={successTostContent} onDismiss={toggleSuccessActive} /> : null;
    //error Toast
    const [errorTost, setErrorTost] = useState(false);
    const toggleErrorTost = useCallback(() => setErrorTost((errorTost) => !errorTost), []);
    const [errorContent, setErrorContent] = useState("Saving error")
    const errorTostMarkup = errorTost ? <Toast content={errorContent} error onDismiss={toggleErrorTost} /> : null;
    const [productids, setProductids] = useState([]);
    const [customerproductids, setCustomerProductids] = useState([]);

    const changeProductId = (e) => {
        setProductId(e);
    }

    const getProductCount = async () => {
        if (MyShopifyDomain != undefined) {
            await fetch(config.APIURL + `/customer/ProductCount?Shop=${MyShopifyDomain}`, {
                method: 'GET',
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            }).then(async item => {
                let response = await item.json();
                if (response.status == "success") {
                    setProductCount(response.message);
                }
            })
        }
    }


    const getProductids = async () => {
        if (MyShopifyDomain != undefined) {
            await fetch(config.APIURL + `/admin/NormalTierallproductsIds?Shop=${MyShopifyDomain}`, {
                method: 'GET',
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            }).then(async item => {
                let response = await item.json();
                if (response.status == "success") {
                    setProductids(response.message);
                }
            })
        }
    }

    const getProductidsCustomer = async () => {
        if (MyShopifyDomain != undefined) {
            await fetch(config.APIURL + `/admin/CustomerallproductsIds?Shop=${MyShopifyDomain}`, {
                method: 'GET',
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            }).then(async item => {
                let response = await item.json();
                if (response.status == "success") {
                    setCustomerProductids(response.message);
                }
            })
        }
    }

    useEffect(() => {
        getProductCount();
        getProductids();
        getProductidsCustomer();
    }, [])
    const getProductDetail = () => {
        setProductLoader(true);
        debugger
        let data = {
            Shop: MyShopifyDomain,
            ProductId: productId
        }
        fetch(`${config.APIURL}/customer/ProductList`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async item => {
                let response = await item.json();
                if (response.status === "success") {
                    setProductTitle(response.message.title);
                    setProductUrl(response.message.src);
                    setProductPrice(response.message.price);
                    setPreviewUrl(response.message.preview_url);
                    setProductCheck(true);
                    setProductId('');
                    setProductLoader(false);
                }
                else {
                    setProductId('');
                    setErrorContent(response.message);
                    toggleErrorTost();
                    setProductLoader(false);
                    setProductCheck(false)
                }
            })
            .catch((error) => {
                console.log("error: ", error);
                setProductId('');
                setErrorContent("Product not found");
                toggleErrorTost();
                setProductLoader(false);
                setProductCheck(false)


            })
    }

    const preview = () => {
        window.open(preview_url);
    }

    return (
        <AlphaCard>
            <FormLayout.Group>
                <VerticalStack gap="3">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text variant="headingLg" as="h5" alignment='center'>
                            STORE PRODUCT DETAILS
                        </Text>
                        <p style={{ display: "flex" }}> Store Product Count <span style={{ fontWeight: "bold", marginLeft: "10px" }}>{productCount}</span></p>
                    </div>
                    <TextField label="Please Fill Product ID" value={productId} onChange={(e) => changeProductId(e)} placeholder='Product id' type="email" autoComplete="email" />
                    <Button size="large" primary onClick={getProductDetail} loading={productLoader}>
                        Get Product Detail
                    </Button>
                </VerticalStack>
            </FormLayout.Group>
            <FormLayout.Group>
                {productCheck ?
                    (
                        <>
                            <MediaCard
                                title={productTitle}
                                description={"Rs " + productPrice}
                                size='smal'
                                primaryAction={{
                                    content: 'Preview',
                                    onAction: preview,
                                }}
                            >
                                <img
                                    alt=""
                                    width="150px"
                                    height="100%"
                                    style={{
                                        objectPosition: 'center',
                                    }}
                                    src={productUrl}
                                />
                            </MediaCard>
                        </>
                    ) : null
                }
            </FormLayout.Group>
                <div style={{display:"flex",justifyContent:"space-evenly",  flexFlow: "row wrap"}}>
            {productids.length > 0 ?
                <FormLayout.Group>
                    <LegacyCard title="NormalTier Created products IDs">
                        <FormLayout.Group>
                            <Scrollable shadow style={{ height: '150px',width:"450px" }} focusable>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={productids}
                                    renderItem={(item) => {
                                        const { id } = item;
                                        return (
                                            <ResourceItem
                                                id={id}
                                                accessibilityLabel={`View details for ${id}`}
                                            >
                                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                    {id}
                                                </Text>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Scrollable>
                        </FormLayout.Group>
                    </LegacyCard>
                </FormLayout.Group> : null
            }

            {customerproductids.length > 0 ?
                <FormLayout.Group>
                    <LegacyCard title="CustomerTier Created products IDs">
                        <FormLayout.Group>
                            <Scrollable shadow style={{ height: '150px',width:"450px" }} focusable>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={customerproductids}
                                    renderItem={(item) => {
                                        const { id } = item;
                                        return (
                                            <ResourceItem
                                                id={id}
                                                accessibilityLabel={`View details for ${id}`}
                                            >
                                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                    {id}
                                                </Text>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Scrollable>
                        </FormLayout.Group>
                    </LegacyCard>
                </FormLayout.Group> : null
            }
             </div>
            {successToastMarkup}
            {errorTostMarkup}
        </AlphaCard>

    )
}

export default ProductDetails
import React, { useState } from 'react'
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../../config.json';
import {
    Page, Tag, Icon, AlphaCard, FormLayout, VerticalStack, ResourceList,
    Avatar, Scrollable, Loading, Spinner, Toast,
    ResourceItem, Text, TextField, Button, LegacyStack, Autocomplete
} from "@shopify/polaris";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
const UpdateAutomatic = () => {

    const navigate = useNavigate();
    const { myShopifyDomain, tag_name, id } = useParams();
    const [tag, setTag] = useState('');
    const [resourceList, setResourceList] = useState([]);
    const [loading, isLoading] = useState(false);
    const [cursor, setCursor] = useState('');
    const [successActive, setSuccessActive] = useState(false);
    const [errorActive, setErrorActive] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
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
        setTag(tag_name);
        GetCustomer();
    }, [])

    const GetCustomer = async () => {
        isLoading(true);
        let params = {
            Shop: myShopifyDomain,
            query: tag_name,
            cursor: "",
            groupType: "indivisual",
        }
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        const urlWithParams = `${config.APIURL}/Customer/AutoMaticGroupGet?${queryString}`;

        await fetch(urlWithParams, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        })
            .then(async (response) => {
                let result = await response.json();
                if (result.status == "success") {
                    let data = result.finalCustomer;
                    const deselectedOptions = [];
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        deselectedOptions.push({ value: element.node.displayName, label: element.node.email }); //tags html
                    }
                    setResourceList(deselectedOptions);
                    isLoading(false);
                }
                else {
                    setErrorMessage(result.message);
                    toggleErrorActive();
                    isLoading(false);
                }
            })
            .catch((err) => {
                setErrorMessage("Something went wrong")
                toggleErrorActive();
                isLoading(false);
            })
    }

    const back_redirect = () => {
        navigate(`/GroupList/${myShopifyDomain}`);
    };

    const deleteGroup = async () => {
        setBtnLoader(true);
        let data = {
            Shop: myShopifyDomain,
            groupName: tag,
            _id: id
        }
        await fetch(config.APIURL + `/Customer/DeleteCustomerGroup`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(async (response) => {
                let result = await response.json();
                if (result.status == "success") {
                    toggleSuccessActive();
                    setSuccessMessage(result.message);
                    setBtnLoader(false);
                    setTag('');
                    setTimeout(() => {
                        back_redirect();
                    }, 1000);
                }
                else {
                    setErrorMessage(result.message);
                    setBtnLoader(false);
                    toggleErrorActive();
                }
            }).catch((err) => {
                setErrorMessage("Something went wrong");
                setBtnLoader(false);
                toggleErrorActive();
                console.log(err);
            })
    }

    const titleWithBackButton = <div style={{ display: "flex" }}>
        <div style={{ height: "35px", width: "35px", cursor: "pointer" }} onClick={back_redirect}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ padding: "5px", border: "1px solid lightgray" }}>
                <path d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z" fill="#5C5F62" />
            </svg>
        </div>
        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
            Update
        </span>
    </div>;

    return (
        <div>
            <Page title={titleWithBackButton}>
                <AlphaCard >
                    <FormLayout.Group>
                        <Text variant="headingMd" as="h6"> Existing Customer Tag: </Text>
                    </FormLayout.Group>
                    <div className="Existing_Tagged_Customer">
                        <div className="Existing_Tagged_Customer_Item Existing_Input_Width">
                            <FormLayout.Group>
                                <TextField
                                    type="email"
                                    value={tag}
                                    disabled
                                />
                            </FormLayout.Group>
                            <FormLayout.Group>
                                {tag !== '' ? <>Tag: <Tag>{tag}</Tag> </> : null}
                            </FormLayout.Group>
                            <FormLayout.Group>
                                {
                                    loading ?
                                        <VerticalStack inlineAlign="center">
                                            <Spinner accessibilityLabel="Loading form field" hasFocusableParent={false} />{" "}
                                        </VerticalStack>
                                        :
                                        <>
                                            {
                                                resourceList.length > 0 &&
                                                <Scrollable shadow style={{ height: '100px' }} focusable>
                                                    <ResourceList
                                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                                        items={resourceList}
                                                        renderItem={(item) => {
                                                            const { value, label } = item;
                                                            const media = <Avatar customer size="medium" name={value} />;
                                                            return (
                                                                <ResourceItem
                                                                    media={media}
                                                                    accessibilityLabel={`View details for ${value}`}
                                                                >
                                                                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                                        {value}
                                                                    </Text>
                                                                    <div>{label}</div>
                                                                </ResourceItem>
                                                            );
                                                        }}
                                                    />
                                                </Scrollable>
                                            }
                                        </>
                                }
                            </FormLayout.Group>
                            <FormLayout.Group>
                                {resourceList.length > 0 ? (
                                    <span>Showing {resourceList.length} Customers </span>
                                ) : null}
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <Button onClick={deleteGroup} destructive loading={btnLoader}> Delete {tag_name}</Button>
                            </FormLayout.Group>
                        </div>
                    </div>
                </AlphaCard>
                {toastSuccessMarkup}
                {toastErrorMarkup}
            </Page>
        </div>
    )
}

export default UpdateAutomatic;


import React, { useState } from 'react'
import { useCallback, useMemo } from 'react';
import { SearchMinor } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import { Page, Tag, Icon, AlphaCard, FormLayout, VerticalStack, ResourceList, Avatar, Scrollable, Loading, Spinner, Toast, ResourceItem, Text, TextField, Button, RadioButton, LegacyStack, Autocomplete } from "@shopify/polaris";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../../../config.json';

const CreateAutomatic = () => {

    const navigate = useNavigate();
    const { myShopifyDomain } = useParams();
    const [allTags, setAllTags] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
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
        GetTags();
    }, [])

    const updateText = useCallback(
        (value) => {
            setTag(value);
            if (value === '') {
                setOptions(allTags);
                return;
            }
            const filterRegex = new RegExp(value, 'i');
            const resultOptions = allTags.filter((option) =>
                option.label.match(filterRegex),
            );
            setOptions(resultOptions);
        },
        [allTags],
    );

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            value={tag}
            prefix={<Icon source={SearchMinor} color="base" />}
            placeholder="Search"
            autoComplete="off"
        />
    );

    const GetTags = async () => {
        isLoading(true);
        await fetch(config.APIURL + `/Customer/SearchCustomerTags?shop=${myShopifyDomain}`, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        }).then(async (response) => {
                let result = await response.json();
                if (response.status == 200) {
                    const deselectedOptions = [];
                    for (let i = 0; i < result.data.length; i++) {
                        const element = result.data[i];
                        deselectedOptions.push({ value: element, label: element }); //tags html
                    }
                    setOptions(deselectedOptions);
                    setAllTags(deselectedOptions);
                    isLoading(false);
                }
            })
            .catch((err) => {
                setErrorMessage("Something went wrong");
                toggleErrorActive();
                isLoading(false);
            })
    }

    const updateSelection = async (selected) => {
        isLoading(true);
        setTag(selected[0]);
        let params = {
            Shop: myShopifyDomain,
            query: selected[0],
            cursor: cursor,
            limit: 50
        }
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const urlWithParams = `${config.APIURL}/Customer/AutoMaticGroup?${queryString}`;
        await fetch(urlWithParams, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        }).then(async (response) => {
            let result = await response.json();
            if (result.status == "success") {
                isLoading(false);
                let data = result.finalCustomer;
                const deselectedOptions = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    deselectedOptions.push({ value: element.node.displayName, label: element.node.email }); //tags html
                }
                setResourceList(deselectedOptions);
            }
            else {
                setErrorMessage("Something went wrong");
                isLoading(false);
                toggleErrorActive();
            }
        }).catch((err) => {
                setErrorMessage("Something went wrong");
                isLoading(false);
                toggleErrorActive();
            })
    }

    const searchTag = async () => {
        isLoading(true);
        console.log(tag)
        let params = {
            Shop: myShopifyDomain,
            query: tag,
            cursor: cursor,
            limit: 50
        }
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        const urlWithParams = `${config.APIURL}/Customer/AutoMaticGroup?${queryString}`;

        await fetch(urlWithParams, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        }).then(async (response) => {
            let result = await response.json();
            console.log(result);
            if (result.status == "success") {
                isLoading(false);
                let data = result.finalCustomer;
                console.log("response is", data);
                const deselectedOptions = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    deselectedOptions.push({ value: element.node.displayName, label: element.node.email }); //tags html
                }
                setResourceList(deselectedOptions);
                if (deselectedOptions.length == 0) {
                    setErrorMessage("Tag not found");
                    toggleErrorActive();
                }
            }
            else {
                setErrorMessage("Something went wrong");
                isLoading(false);
                toggleErrorActive();
            }
        }).catch((err) => {
            setErrorMessage("Something went wrong");
            isLoading(false);
            toggleErrorActive();
        })
    }

    const createGroup = async () => {
        setBtnLoader(true);
        let data = {
            Shop: myShopifyDomain,
            createType: "New",
            groupName: tag,
            customerList: []
        }
        await fetch(config.APIURL + `/Customer/AutoMaticGroupTags`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        }).then(async (response) => {
            let result = await response.json();
            if (result.status == "success") {
                toggleSuccessActive();
                setSuccessMessage(result.message);
                setBtnLoader(false);
                setTag('');
                setSelectedOptions([]);
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
            toggleErrorActive();
            setBtnLoader(false);
        })
    }

    const back_redirect = () => {
        navigate(`/GroupList/${myShopifyDomain}`);
    };

    const titleWithBackButton = <div style={{ display: "flex" }}>
        <div style={{ height: "35px", width: "35px", cursor: "pointer" }} onClick={back_redirect}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ padding: "5px", border: "1px solid lightgray" }}>
                <path d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z" fill="#5C5F62" />
            </svg>
        </div>
        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
            Create Customer Group
        </span>
    </div>;

    return (
        <div>
            <Page title={titleWithBackButton}>
                <AlphaCard >
                    <FormLayout.Group>
                        <Text variant="headingMd" as="h6"> Existing Customer Tag: </Text>
                    </FormLayout.Group>
                    <FormLayout.Group>
                        <div className="Existing_Tagged_Customer">
                            <div className="Existing_Tagged_Customer_Item Existing_Input_Width">
                                <div style={{ height: '70px', display: "flex", flexDirection: "row" }}>
                                    <div style={{ width: "100%" }}>
                                        <Autocomplete
                                            options={options}
                                            selected={selectedOptions}
                                            onSelect={updateSelection}
                                            textField={textField}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "20px" }}>
                                        {tag == "" ?
                                            <button className="Polaris-Button Polaris-Button--disabled" type="button" disabled={true}  >Show Tagged Customers</button>
                                            :
                                            <button className="Polaris-Button " type="button" onClick={searchTag} >Show Tagged Customers</button>
                                        }
                                    </div>
                                </div>
                                {
                                    tag !== '' ? <>Tag: <Tag >{tag}</Tag> </> : null
                                }

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
                                                <FormLayout.Group>
                                                    {resourceList.length > 0 ? (
                                                        <span>Showing {resourceList.length} Customers </span>
                                                    ) : null}
                                                </FormLayout.Group>
                                                <br />
                                            </>
                                    }
                                </FormLayout.Group>
                                <Button onClick={createGroup} primary loading={btnLoader}> Create Group</Button>
                            </div>
                        </div>
                    </FormLayout.Group>
                </AlphaCard>
                {toastSuccessMarkup}
                {toastErrorMarkup}
            </Page>
        </div>
    )
}

export default CreateAutomatic;


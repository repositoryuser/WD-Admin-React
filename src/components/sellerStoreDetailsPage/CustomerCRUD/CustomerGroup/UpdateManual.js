import React, { useEffect, useState } from 'react'
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import config from '../../../../config.json';
import {
    Page, Tag, Icon, AlphaCard, FormLayout, VerticalStack, ResourceList,
    Avatar, Scrollable, Icons, Spinner, Toast, ButtonGroup,
    ResourceItem, Text, TextField, Modal, TextContainer, Button, LegacyStack, Autocomplete
} from "@shopify/polaris";
import {
    CancelMinor
} from '@shopify/polaris-icons';

const UpdateManual = () => {

    const navigate = useNavigate();
    const { myShopifyDomain, id } = useParams();
    const [activeBrowseCustomer, setActiveBrowseCustomer] = useState(false);
    const [tag, setTag] = useState('');
    const [resourceList, setResourceList] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, isLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [successActive, setSuccessActive] = useState(false);
    const [errorActive, setErrorActive] = useState(false);
    const [search, setSearch] = useState();
    const [updateBtnLoader, setUpdateBtnLoader] = useState(false);
    const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [pageLoader, setPageLoader] = useState(false);

    const toggleSuccessActive = useCallback(() => setSuccessActive((active) => !active), []);
    const toastSuccessMarkup = successActive ? (
        <Toast content={successMessage} onDismiss={toggleSuccessActive} />
    ) : null;

    const toggleErrorActive = useCallback(() => setErrorActive((active) => !active), []);
    const toastErrorMarkup = errorActive ? (
        <Toast content={errorMessage} error onDismiss={toggleErrorActive} />
    ) : null;

    useEffect(() => {
        GetGroupCustomers();
    }, []);

    const handleSearchChange = (value) => {
        setSearch(value);
        if (value === '') {
            setResourceList(options)
            return;
        }
        const filterRegex = new RegExp(value, 'i');
        const resultOptions = options.filter((option) =>
            option.displayName.match(filterRegex),
        );
        setResourceList(resultOptions);
    }

    const updateSelection = (Id, value, label) => {
        let newTag = [...selectedTags];
        if (!newTag.includes(value)) {
            newTag.push(value);
            setSelectedTags(newTag);
            selectedOptions.push({ id: Id, displayName: value, email: label });
        }
    }

    const handleModal = () => {
        if (activeBrowseCustomer === false) {
            GetAllCustomers();
            setActiveBrowseCustomer(true);
        }
        else {
            setActiveBrowseCustomer(false);
        }
    }

    const removeTag = (tag) => () => {
        setSelectedTags((previousTags) =>
            previousTags.filter((previousTag) => previousTag !== tag)
        );
        setSelectedOptions((e) =>
            selectedOptions.filter((e) => e.displayName !== tag)
        );
    };

    const GetAllCustomers = async () => {
        isLoading(true);
        let params = {
            Shop: myShopifyDomain,
            query: '',
            cursor: '',
            groupType: 'Indivisual'
        }
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        const urlWithParams = `${config.APIURL}/Customer/AllcustomerGet?${queryString}`;
        await fetch(urlWithParams, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        }).then(async (response) => {
            let result = await response.json();
            if (response.status == 200) {
                let data = result.customer.data.customers.edges;
                const deselectedOptions = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].node;
                    let idString = element.id;
                    const parts = idString.split('/');
                    const Id = parts[parts.length - 1];
                    deselectedOptions.push({ id: Id, displayName: element.displayName, email: element.email }); //tags html
                }
                setResourceList(deselectedOptions);
                setOptions(deselectedOptions);
                isLoading(false);
            }
        })
            .catch((err) => {
                setErrorMessage("Something went wrong");
                toggleErrorActive();
            })
    }

    const GetGroupCustomers = async () => {
        setPageLoader(true);
        let params = {
            Shop: myShopifyDomain,
            id: id
        }
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        const urlWithParams = `${config.APIURL}/Customer/SingleCustomerGroupGet?${queryString}`;

        await fetch(urlWithParams, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        }).then(async (response) => {
            let result = await response.json();
            if (response.status == 200) {
                let data = result.singleCustomerGroup;
                setTag(data.group_name);
                const deselectedOptions = [];
                for (let i = 0; i < data.customerList.length; i++) {
                    const element = data.customerList[i];
                    selectedTags.push(element.displayName)
                    deselectedOptions.push({ id: element.id, displayName: element.displayName, email: element.email }); //tags html
                }
                setSelectedOptions(deselectedOptions);
                setPageLoader(false);
            }
            else{
                setErrorMessage("Something went wrong");
                toggleErrorActive();
                setPageLoader(false);
            }
        }).catch((err) => {
                setErrorMessage("Something went wrong");
                toggleErrorActive();
                setPageLoader(false);
            })
    }

    const updateGroup = async () => {
        setUpdateBtnLoader(true);
        let data = {
            Shop: myShopifyDomain,
            createType: "Existing",
            groupName: tag,
            customerList: selectedOptions,
            _id: id
        }
        await fetch(config.APIURL + `/Customer/Createcustomergroup`, {
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
                    setUpdateBtnLoader(false);
                    setTag('');
                    setSelectedOptions([]);
                    setSelectedTags([]);
                    setTimeout(() => {
                        back_redirect();
                    }, 1000);
                }
                else {
                    setErrorMessage(result.message);
                    setUpdateBtnLoader(false);
                    toggleErrorActive();
                }
            }).catch((err) => {
                setErrorMessage("Something went wrong");
                toggleErrorActive();
                setUpdateBtnLoader(false);
            })
    }

    const deleteGroup = async () => {
        setDeleteBtnLoader(true);
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
        }).then(async (response) => {
            let result = await response.json();
            if (result.status == "success") {
                toggleSuccessActive();
                setSuccessMessage(result.message);
                setDeleteBtnLoader(false);
                setTag('');
                setSelectedOptions([]);
                setSelectedTags([]);
                setTimeout(() => {
                    back_redirect();
                }, 1000);
            }
            else {
                setErrorMessage(result.message);
                setDeleteBtnLoader(false);
                toggleErrorActive();
            }
        }).catch((err) => {
                setErrorMessage("Something went wrong");
                toggleErrorActive();
                setDeleteBtnLoader(false);
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
            Update
        </span></div>;

    return (
        <div>
            <Page title={titleWithBackButton}>
                <AlphaCard >
                    <FormLayout.Group>
                        <Text variant="headingMd" as="h6"> Customer Group Name: </Text>
                    </FormLayout.Group>
                    <FormLayout.Group>

                        <div className="Existing_Tagged_Customer">
                            <div className="Existing_Tagged_Customer_Item Existing_Input_Width">
                                <div style={{ marginBottom: "10px" }}>
                                    <TextField
                                        type="email"
                                        value={tag}
                                        disabled
                                    />
                                </div>
                                {
                                    <FormLayout.Group>
                                        {tag !== '' ? <>Tag: <Tag>{tag}</Tag> </> : null}
                                    </FormLayout.Group>
                                }
                                <FormLayout.Group>
                                    <Text variant="headingMd" as="h2" fontWeight="semibold"> Select Customers: </Text>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    {
                                        pageLoader ?
                                            <VerticalStack inlineAlign="center">
                                                <Spinner accessibilityLabel="Loading form field" hasFocusableParent={false} />{" "}
                                            </VerticalStack>
                                            :
                                            <div style={{ marginTop: "10px" }}>
                                                <Scrollable shadow style={{ height: '100px' }} focusable>
                                                    <ResourceList
                                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                                        items={selectedOptions}
                                                        renderItem={(item) => {
                                                            const { displayName, email } = item;
                                                            const media = <Avatar customer size="medium" name={displayName} />;
                                                            return (
                                                                <ResourceItem
                                                                    media={media}
                                                                    accessibilityLabel={`View details for ${displayName}`}
                                                                >
                                                                    <Text variant="bodyMd" fontWeight="bold" as="h3" clearButton>
                                                                        {displayName}
                                                                    </Text>
                                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                        <span> {email}</span>
                                                                        <span onClick={removeTag(item.displayName)}>
                                                                            <Icon
                                                                                source={CancelMinor}
                                                                                tone="base"
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </ResourceItem>
                                                            );
                                                        }}
                                                    />
                                                </Scrollable>
                                            </div>
                                    }
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    {
                                        selectedOptions.length > 0 ?
                                            (
                                                <LegacyStack>
                                                    <span>Showing {selectedOptions.length} Customers </span>
                                                </LegacyStack>
                                            ) : null
                                    }
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Button id="step_2" onClick={handleModal}>
                                        <div style={{ display: "flex" }}>
                                            <span>Browse</span>{" "}
                                        </div>
                                    </Button>
                                </FormLayout.Group>
                                <Modal
                                    open={activeBrowseCustomer}
                                    onClose={handleModal}
                                    title="Search Customers"
                                    primaryAction={{
                                        content: 'Done',
                                        onAction: handleModal,
                                    }}
                                >
                                    <Modal.Section>
                                        <TextField value={search} onChange={handleSearchChange} placeholder="Search" />
                                        {
                                            loading ? <>
                                                <VerticalStack inlineAlign="center">
                                                    <Spinner accessibilityLabel="Loading form field" hasFocusableParent={false} />{" "}
                                                </VerticalStack>
                                            </>
                                                :
                                                <>
                                                    <LegacyStack spacing="tight">
                                                        {
                                                            selectedTags.map((option) => (
                                                                <Tag key={option} onRemove={removeTag(option)}>{option}</Tag>
                                                            ))
                                                        }
                                                    </LegacyStack>
                                                    <Scrollable style={{ height: '170px', marginTop: "10px" }} focusable>
                                                        <ResourceList
                                                            resourceName={{ singular: 'customer', plural: 'customers' }}
                                                            items={resourceList}
                                                            renderItem={(item) => {
                                                                const { id, displayName, email } = item;
                                                                const media = <Avatar customer size="md" name={displayName} />;
                                                                return (
                                                                    <ResourceItem
                                                                        onClick={() => { updateSelection(id, displayName, email) }}
                                                                        media={media}
                                                                        accessibilityLabel={`View details for ${displayName}`}
                                                                    >
                                                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                                            {displayName}
                                                                        </Text>
                                                                        <div>{email}</div>
                                                                    </ResourceItem>
                                                                );
                                                            }}
                                                        />
                                                    </Scrollable>
                                                </>
                                        }
                                    </Modal.Section>
                                </Modal>
                                <FormLayout.Group>
                                    <ButtonGroup>
                                        <Button primary onClick={updateGroup} loading={updateBtnLoader}> Update {tag}</Button>
                                        <Button destructive onClick={deleteGroup} loading={deleteBtnLoader}> Delete {tag}</Button>
                                    </ButtonGroup>
                                </FormLayout.Group>
                            </div>
                        </div>
                    </FormLayout.Group>
                </AlphaCard>
                {toastSuccessMarkup}
                {toastErrorMarkup}
            </Page>
        </div >
    )
}

export default UpdateManual;


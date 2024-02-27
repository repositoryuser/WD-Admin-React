import React, { useEffect,useCallback } from 'react'
import { useState } from 'react';
import { Page, ResourceItem, DataTable, Spinner,Toast, VerticalStack, ResourceList, Avatar, Modal, Text, Button, AlphaCard, LegacyStack } from '@shopify/polaris';
import welcome_logo from './welcome_logo.png'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import config from '../../../../config.json';
import { Link } from 'react-router-dom';

const GroupList = () => {
    const { myShopifyDomain } = useParams();
    const navigate = useNavigate();
    const [welcomePage, setWelcomePage] = useState(false);
    const [activeBrowseCustomer, setActiveBrowseCustomer] = useState(false);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [errorActive, setErrorActive] = useState(false);


    const toggleErrorActive = useCallback(() => setErrorActive((active) => !active), []);
    const toastErrorMarkup = errorActive ? (
        <Toast content={errorMessage} error onDismiss={toggleErrorActive} />
    ) : null;

    const getCustomerList = async () => {
        setIsLoading(true);
        await fetch(config.APIURL + `/Customer/Getcustomergrouplist?Shop=${myShopifyDomain}`, {
            method: "get",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
        }).then(async (response) => {
            let result = await response.json();
            // console.log(result.customerGroupList);
            if (response.status == 200) {
                // console.log("tag array is :", result.data);
                const deselectedOptions = [];
                for (let i = 0; i < result.customerGroupList.length; i++) {
                    const element = result.customerGroupList[i];
                    let id = element._id;
                    let tag_name = element.group_name;
                    deselectedOptions.push([element.group_name, element.group_name, element.group_type === "Group" ? "Manual" : "Automatic",
                    element.group_type == "AutomaticGroup" ? <Link to={`/UpdateAutomatic/${myShopifyDomain}/${id}/${tag_name}`}> Manage</Link> : <Link to={`/UpdateManual/${myShopifyDomain}/${id}`}>Manage</Link>]);
                }
                setRows(deselectedOptions);
                if (deselectedOptions.length == 0) {
                    setWelcomePage(true);
                }

                // setCurrentTag(deselectedOptions)
                // console.log("deselectedOptions Are Element", deselectedOptions);
                // setOptions(deselectedOptions);
                // setAllTags(deselectedOptions);
                // setautoFocusTextBox(true);

                setIsLoading(false);
            }
            else{
                setErrorMessage("Something went wrong");
                setIsLoading(false);
                toggleErrorActive();
            }
        }).catch((err) => {
            setErrorMessage("Something went wrong");
            setIsLoading(false);
            toggleErrorActive();
        })
    };

    useEffect(() => {
        getCustomerList();
    }, []);

    const handleModal = () => {
        if (activeBrowseCustomer === false) {
            setActiveBrowseCustomer(true);
        }
        else {
            setActiveBrowseCustomer(false);
        }
    }

    const redirect = (id) => {
        if (id == 1) {
            navigate(`/CreateManual/${myShopifyDomain}`);
        }
        else {
            navigate(`/CreateAutomatic/${myShopifyDomain}`);
        }
    }

    const back_redirect = () => {
        navigate("/DetailsPage");
    };

    const titleWithBackButton = <div style={{ display: "flex" }}>
        <div style={{ height: "35px", width: "35px", cursor: "pointer" }} onClick={back_redirect}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ padding: "5px", border: "1px solid lightgray" }}>
                <path d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z" fill="#5C5F62" />
            </svg>
        </div>
        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
            Customer Group List
        </span></div>;

    return (
        <div>
            <Page
                title={titleWithBackButton}
                primaryAction={
                    <Button
                        onClick={handleModal}
                        primary
                    >
                        Create Group
                    </Button>
                }

            >
                <Modal
                    open={activeBrowseCustomer}
                    title="Create Customer Group"
                    onClose={handleModal}
                >
                    <ResourceList
                        resourceName={{ singular: 'customer', plural: 'customers' }}
                        items={[
                            {
                                id: 1,
                                name: 'Manual',
                                location: 'Create customer group with new tag',
                            },
                            {
                                id: 2,
                                name: 'Automatic',
                                location: "Create customer group with your customer's existing tags",
                            },
                        ]}
                        renderItem={(item) => {
                            const { id, name, location } = item;
                            return (
                                <ResourceItem
                                    id={id}
                                    onClick={(id) => redirect(id)}
                                    // media={media}
                                    accessibilityLabel={`View details for ${name}`}
                                >
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ marginTop: '10px' }}>
                                            {id == 1
                                                ?
                                                <div style={{ width: '20px', marginRight: '15px' }}><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 11a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1zM12.363 5.22a4.22 4.22 0 11-8.439 0 4.22 4.22 0 018.439 0zM.67 14.469c1.385-1.09 4.141-2.853 7.474-2.853 3.332 0 6.089 1.764 7.474 2.853.618.486.81 1.308.567 2.056l-.333 1.02A2.11 2.11 0 0113.845 19H2.441a2.11 2.11 0 01-2.005-1.455l-.333-1.02c-.245-.748-.052-1.57.567-2.056z" fill="#5C5F62" /></svg></div>
                                                :
                                                <div style={{ width: '20px', marginRight: '15px' }}><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.03774 0.858582C8.10805 0.365936 8.52993 0 9.02749 0H11.2931C11.7907 0 12.2125 0.365936 12.2829 0.858582L12.6542 3.45728C13.3566 3.72517 14.0048 4.10292 14.5778 4.56953L17.0155 3.591C17.4774 3.40564 18.0053 3.58806 18.254 4.01904L19.3869 5.98094C19.6356 6.41193 19.5297 6.96028 19.1383 7.26755L17.0727 8.88898C17.1115 9.13266 17.1378 9.38052 17.1508 9.6319C17.1571 9.7538 17.1603 9.87653 17.1603 10C17.1603 10.3781 17.1303 10.7492 17.0727 11.111L19.1383 12.7324C19.5297 13.0397 19.6356 13.5881 19.3869 14.019L18.254 15.9809C18.0053 16.4119 17.4774 16.5943 17.0155 16.409L14.5778 15.4305C14.0048 15.8971 13.3566 16.2748 12.6542 16.5427L12.2829 19.1414C12.2125 19.6341 11.7907 20 11.2931 20H9.02749C8.52993 20 8.10805 19.6341 8.03774 19.1414L7.6664 16.5427C6.96401 16.2748 6.31582 15.897 5.74282 15.4304L3.30483 16.409C2.84292 16.5943 2.31509 16.4119 2.06631 15.9809L0.933738 14.019C0.684714 13.5881 0.790671 13.0397 1.18227 12.7324L3.24795 11.1109C3.19033 10.7491 3.1603 10.3781 3.1603 10C3.1603 9.62193 3.19033 9.25085 3.24795 8.88904L1.18227 7.26755C0.790671 6.96028 0.684714 6.41193 0.933738 5.98094L2.06631 4.01904C2.31509 3.58806 2.84292 3.40564 3.30483 3.591L5.74282 4.5696C6.31582 4.10295 6.96401 3.72517 7.6664 3.45728L8.03774 0.858582ZM8.77735 6.51823L13.376 9.58397C13.6728 9.78189 13.6728 10.2181 13.376 10.416L8.77735 13.4818C8.44507 13.7033 8 13.4651 8 13.0657V10V6.93426C8 6.53491 8.44507 6.29672 8.77735 6.51823Z" fill="#5C5F62" /></svg></div>
                                            }
                                        </div>
                                        <div>
                                            <h3>
                                                <Text variant="headingSm" as="h2" fontWeight="semibold"> {name} </Text>
                                            </h3>
                                            <div style={{ marginLeft: '0px' }}>{location}</div>
                                        </div>
                                    </div>
                                </ResourceItem>
                            );
                        }}
                    />
                </Modal>
                {
                    welcomePage ? <AlphaCard >
                        <div style={{ padding: "40px" }}>
                            <div style={{ textAlign: "center" }}>
                                <img src={welcome_logo} width="80px" height="80px" />
                                <h3
                                    style={{ fontSize: "1.4rem", padding: "20px", color: "gray" }}
                                >
                                    Welcome!
                                </h3>
                                <h1
                                    style={{
                                        fontSize: "1.5rem",
                                        padding: "20px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Get started with creating your first Customer Group
                                </h1>
                                <div style={{ padding: "20px" }}>
                                    <Button size="large" primary
                                        onClick={handleModal}>
                                        Create a Group
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </AlphaCard> :

                        <AlphaCard>
                            {
                                isLoading ? <>
                                    <br /> <VerticalStack inlineAlign="center">
                                        <Spinner accessibilityLabel="Loading form field" hasFocusableParent={false} />{" "}
                                    </VerticalStack>
                                </> :
                                    <DataTable
                                        columnContentTypes={[
                                            "text",
                                            "text",
                                            "text",
                                            "text"
                                        ]}
                                        headings={[<strong>Group Name</strong>, <strong>Group Tag</strong>, <strong>Group Type</strong>, <strong>  Action</strong>]}
                                        rows={rows}
                                        hideScrollIndicator={true}
                                    />
                            }
                        </AlphaCard>
                }
            </Page>
            {toastErrorMarkup}
        </div>
    )
}

export default GroupList
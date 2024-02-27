import postData from "../../../Hooks/POSTAPI";
import config from "../../../config.json";
import React, { useState } from 'react'
import { useCallback } from 'react';
import { AlphaCard, VerticalStack, Toast, Text, TextField, Button, LegacyTabs, LegacyCard, RadioButton, LegacyStack } from "@shopify/polaris";
const CustomerList = ({ MyShopifyDomain }) => {

    const [createFirstName, setCreateFirstName] = useState('');
    const [createLastName, setCreateLastName] = useState('');
    const [updateFirstName, setUpdateFirstName] = useState('');
    const [updateLastName, setUpdateLastName] = useState('');

    const [createEmail, setCreateEmail] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [deleteEmail, setDeleteEmail] = useState('');
    const [btnCreateLoading, setCreateLoading] = useState(false);
    const [btnUpdateLoading, setUpdateLoading] = useState(false);
    const [value, setValue] = useState('create');

    const handleCreateEmail = useCallback((newValue) => setCreateEmail(newValue), []);
    const handleUpdateEmail = useCallback((newValue) => setUpdateEmail(newValue), []);
    const handleDeleteEmail = useCallback((newValue) => setDeleteEmail(newValue), []);

    const handleCreateFirstName = useCallback((newValue) => setCreateFirstName(newValue), []);
    const handleCreateLastName = useCallback((newValue) => setCreateLastName(newValue), []);
    const handleUpdateFirstName = useCallback((newValue) => setUpdateFirstName(newValue), []);
    const handleUpdateLastName = useCallback((newValue) => setUpdateLastName(newValue), []);

    //success Toast
    const [successTost, setSuccessTost] = useState(false);
    const [successTostContent, setSuccessTostContent] = useState("");
    const toggleSuccessActive = useCallback(() => setSuccessTost((successTost) => !successTost), []);
    const successToastMarkup = successTost ? <Toast content={successTostContent} onDismiss={toggleSuccessActive} /> : null;
    //error Toast
    const [errorTost, setErrorTost] = useState(false);
    const toggleErrorTost = useCallback(() => setErrorTost((errorTost) => !errorTost), []);
    const [errorContent, setErrorContent] = useState("Something went wrong");
    const errorTostMarkup = errorTost ? <Toast content={errorContent} error onDismiss={toggleErrorTost} /> : null;

    const [btnDelLoading, setBtnDelLoading] = useState(false);


    const handelCreateCustomer = () => {

        setCreateLoading(true);
        postData(`${config.APIURL}/admin/NewCustomerCreate?shop=${MyShopifyDomain}`, {
            shop: MyShopifyDomain,
            FirstName: createFirstName,
            LastName: createLastName,
            email: createEmail,
        })
            .then((data) => {
                console.log("data: ", data);
                if (data.status === "success") {
                    toggleSuccessActive();
                    setSuccessTostContent(data.message);
                    setCreateEmail("");
                    setCreateFirstName("");
                    setCreateLastName("");
                    setCreateLoading(false);
                } else if (data.status === "error") {
                    setCreateLoading(false);
                    setErrorContent(data.message);
                    toggleErrorTost();

                } else {
                    setCreateLoading(false);
                    setErrorContent(data.message);
                    toggleErrorTost();

                }

            }).catch((error) => {
                console.log("error: ", error);
                setCreateLoading(false);
                toggleErrorTost();
            })


    }
    const handelUpdateCustomer = () => {
        setUpdateLoading(true);
        postData(`${config.APIURL}/admin/CustomerUpdate?shop=${MyShopifyDomain}`, {
            shop: MyShopifyDomain,
            FirstName: updateFirstName,
            LastName: updateLastName,
            email: updateEmail,
        })
            .then((data) => {
                console.log("data: ", data);
                // debugger
                if (data.status === "success") {
                    toggleSuccessActive();
                    setSuccessTostContent(data.message);
                    setUpdateEmail("");
                    setUpdateFirstName("");
                    setUpdateLastName("");
                    setUpdateLoading(false);
                } else if (data.status === "error") {
                    setUpdateLoading(false);
                    toggleErrorTost();
                    setErrorContent(data.message);

                } else {
                    setUpdateLoading(false);
                    toggleErrorTost();
                    setErrorContent(data.message);
                }

            }).catch((error) => {
                console.log("error: ", error);
                setUpdateLoading(false);
                toggleErrorTost();
            })
    };


    const handelDeleteCustomer = () => {
        setBtnDelLoading(true);
        postData(`${config.APIURL}/admin/CustomerDelete?shop=${MyShopifyDomain}`, {
            shop: MyShopifyDomain,
            email: deleteEmail,
        })
            .then((data) => {
                console.log("data: ", data);
                // debugger
                if (data.status === "success") {
                    toggleSuccessActive();
                    setSuccessTostContent(data.message);
                    setDeleteEmail("");
                    setBtnDelLoading(false);
                } else if (data.status === "error") {
                    setBtnDelLoading(false);
                    toggleErrorTost();
                    setErrorContent(data.message);

                } else {
                    setBtnDelLoading(false);
                    toggleErrorTost();
                    setErrorContent(data.message);

                }

            }).catch((error) => {
                console.log("error: ", error);
                setBtnDelLoading(false);
                toggleErrorTost();
            })
    };



    const createCustomer = <>
        <VerticalStack gap="3" >
            <Text variant="headingLg" as="h5">
                Create Customer
            </Text>
            <TextField placeholder="Please Enter Valid Email" label="Email" type="email" value={createEmail} onChange={handleCreateEmail} autoComplete="email" />
            <TextField placeholder="First Name" label="First Name" type="name" value={createFirstName} onChange={handleCreateFirstName} autoComplete="name" />
            <TextField placeholder="Last Name" label="Last Name" type="name" value={createLastName} onChange={handleCreateLastName} autoComplete="name" />
            {/* loading={isBtnLoading} */}
            <Button size="large" primary onClick={() => handelCreateCustomer()} loading={btnCreateLoading}>
                <Text variant="headingSm" as="h6">Create Customer</Text>
            </Button>
        </VerticalStack>
        {successToastMarkup}
        {errorTostMarkup}
    </>;

    const updateCustomer = <>
        <VerticalStack gap="3" >
            <Text variant="headingLg" as="h5">
                Update Customer
            </Text>
            <TextField placeholder="Please Enter Valid Email" label="Email" type="email" value={updateEmail} onChange={handleUpdateEmail} autoComplete="email" />
            <TextField placeholder="First Name" label="First Name" type="name" value={updateFirstName} onChange={handleUpdateFirstName} autoComplete="name" />
            <TextField placeholder="Last Name" label="Last Name" type="name" value={updateLastName} onChange={handleUpdateLastName} autoComplete="name" />
            {/* loading={isBtnLoading} */}
            <Button size="large" primary onClick={() => handelUpdateCustomer()} loading={btnUpdateLoading}>
                <Text variant="headingSm" as="h6">Update Customer</Text>
            </Button>
        </VerticalStack>
        {successToastMarkup}
        {errorTostMarkup}
    </>;
    const deleteCustomer = <>
        <VerticalStack gap="3" >
            <Text variant="headingLg" as="h5">
                Delete Customer
            </Text>
            <TextField placeholder="Please Enter Valid Email" label="Email" type="email" value={deleteEmail} onChange={handleDeleteEmail} autoComplete="email" />
            {/* loading={isBtnLoading} */}

            <Button size="large" destructive onClick={() => handelDeleteCustomer()} loading={btnDelLoading}>
                <Text variant="headingSm" as="h6">Delete Customer</Text>
            </Button>
        </VerticalStack>
        {successToastMarkup}
        {errorTostMarkup}
    </>;


    // const [action, setAction] = useState(1);

    // const handleChangePos = useCallback((_checked, newValue) => {
    //     setValue(newValue)
    //     if (newValue === 'create') {
    //         setAction(1);
    //     }
    //     if (newValue === 'update') {
    //         setAction(2);
    //     }
    //     if (newValue === 'delete') {
    //         setAction(3);
    //     }

    // }, [],);



    // legacy tab

    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [

        {
            id: 'accepts-marketing-1',
            content: <Text variant="headingMd" as="h6"> Create Customer</Text>,
            data: createCustomer,
            panelID: 'accepts-marketing-content-1',
        },
        {
            id: 'repeat-customers-1',
            content: <Text variant="headingMd" as="h6"> Update Customer</Text>,
            data: updateCustomer,
            panelID: 'repeat-customers-content-1',
        },
        {
            id: 'prospects-1',
            content: <Text variant="headingMd" as="h6">Delete Customer</Text>,
            data: deleteCustomer,
            panelID: 'prospects-content-1',
        },
    ];


    return (
        // <AlphaCard>
        //    <Text fontWeight="bold" alignment="center">Customer Create Section</Text>
        //      <LegacyStack distribution='equalSpacing'>
        //         <RadioButton
        //             label="Create Customer"
        //             id="create"
        //             checked={value === 'create'}
        //             name="accounts"
        //             onChange={handleChangePos}
        //         />

        //         <RadioButton
        //             label="Update Customer"
        //             id="update"
        //             name="accounts"
        //             checked={value === 'update'}
        //             onChange={handleChangePos}
        //         />

        //         <RadioButton
        //             label="Delete Customer"
        //             id="delete"
        //             name="accounts"
        //             checked={value === 'delete'}
        //             onChange={handleChangePos}
        //         />
        //     </LegacyStack>

        //     {
        //         action === 1 ? createCustomer : action === 2 ? updateCustomer : action === 3 ? deleteCustomer : null

        //     }



        // </AlphaCard>



        <LegacyCard>
            <LegacyTabs fitted tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <LegacyCard.Section>
                {tabs[selected].data}
                </LegacyCard.Section>
            </LegacyTabs>
        </LegacyCard>

    )
}

export default CustomerList
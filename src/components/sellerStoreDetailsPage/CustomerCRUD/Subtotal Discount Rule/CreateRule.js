import React, { useState, useEffect, useContext } from 'react'
import { useCallback } from 'react';
import '../../../../backup/css/productSearchHTML.css'
import '../../../../backup/css/customstyle.css'
import config from '../../../../config.json'
import { ClockMajor, SearchMinor, CalendarMajor } from '@shopify/polaris-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Page, Frame, Toast, Modal, AlphaCard, Icon, VerticalStack, Spinner, ResourceList, Avatar, ResourceItem, FormLayout, Text, TextField, Button, RadioButton, DatePicker } from "@shopify/polaris";
import { DisabledByDefault } from '@mui/icons-material';
import { AuthContext } from '../../../../ContextApi/AuthContext';

const CreateQuantityRule = () => {
    const navigate = useNavigate();
    const { sellerDetails } = useContext(AuthContext);
    const { MyShopifyDomain } = sellerDetails;
    const { myShopifyDomain } = useParams();
    const [cursor, setCursor] = useState('');
    const [items, setItems] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [specificcustomers, setSpecificcustomers] = useState([]);
    const [ruleTitle, setRuleTitle] = useState('');
    const [search, setSearch] = useState();
    const [loading, isLoading] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState();
    let [divValue, setDivValue] = useState([1]);
    const [radioPercentage, setradioPercentage] = useState(true);

    // toast variables
    const [successActive, setSuccessActive] = useState(false);
    const [errorActive, setErrorActive] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [isDateClicked, setisDateClicked] = useState(false);
    const [isTimerClicked, setisTimerClicked] = useState(false);
    const [isDateClicked2, setisDateClicked2] = useState(false);
    const [isTimerClicked2, setisTimerClicked2] = useState(false);
    const [sampleValue, setsampleValue] = useState();
    const [sampleDateValue, setsampleDateValue] = useState();
    const [sampleValue2, setsampleValue2] = useState();
    const [sampleDateValue2, setsampleDateValue2] = useState();
    const [finalSelectedStartDate, setfinalSelectedStartDate] = useState();
    const [finalSelectedStartDate2, setfinalSelectedStartDate2] = useState();
    const [isdatevalid2, setisdatevalid2] = useState(false);
    const [isdatevalid, setisdatevalid] = useState(false);
    const [activeBrowseCustomer, setActiveBrowseCustomer] = useState(false);
    const [activeToggle, setActiveToggle] = useState(false); //Error Toast Polaris
    const [toggleMesssage, setToggleMesssage] = useState("");

    //#region  Sucess Toast Message
    const toggleSuccessActive = useCallback(() => setSuccessActive((active) => !active), []);
    const toastSuccessMarkup = successActive ? (
        <Toast content={successMessage} onDismiss={toggleSuccessActive} />
    ) : null;

    const toggleErrorActive = useCallback(() => setErrorActive((active) => !active), []);
    const toastErrorMarkup = errorActive ? (
        <Toast content={errorMessage} error onDismiss={toggleErrorActive} />
    ) : null;
    //#endregion

    //#region  showing error variables
    const toggleMessageChange = useCallback(
        (value) => setToggleMesssage(value),
        []
    );
    const toggleActive = useCallback(
        () => setActiveToggle((activeToggle) => !activeToggle),
        []
    );
    //#endregion

    useEffect(() => {
        if (MyShopifyDomain === undefined) {
            navigate('/ListingPage');
        }

    }, [])


    const sampleHandleDateInput = (newValue) => {
        if (!Number(newValue)) {
            var regex = /[^0-9 \/\-]/g;
            newValue = newValue.replace(regex, "");
            setsampleDateValue(newValue);
        } else {
            setsampleDateValue(newValue);
        }
        let splitted__date = newValue.split("/");
        var date_regex = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-](?:(?:18|19|20|21)[0-9]{2})$/;
        if (newValue == "") {
            setisdatevalid(false)
            setsampleValue("")
        } else if (!date_regex.test(newValue)) {
            setisdatevalid(true)
            setsampleValue("")
            return
        } else {
            setisdatevalid(false)
        }
        let tempDate = finalSelectedStartDate;
        const d = new Date();
        d.setDate(splitted__date[0]);
        d.setMonth(Number(splitted__date[1]) - 1);
        d.setFullYear(splitted__date[2]);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setHours(0);
        setfinalSelectedStartDate(d);
    };

    const sampleHandleDateInput2 = (newValue) => {
        if (!Number(newValue)) {
            var regex = /[^0-9 \/\-]/g;
            newValue = newValue.replace(regex, "");
            setsampleDateValue2(newValue);
        } else {
            setsampleDateValue2(newValue);
        }

        let splitted__date = newValue.split("/");
        var date_regex = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-](?:(?:18|19|20|21)[0-9]{2})$/;
        if (newValue == "") {
            setisdatevalid2(false)
            setsampleValue2("")
        } else if (!date_regex.test(newValue)) {
            setisdatevalid2(true)
            setsampleValue2("")
            return
        } else {
            setisdatevalid2(false)
        }
        let tempDate = finalSelectedStartDate2;
        const d = new Date();
        d.setDate(splitted__date[0]);
        d.setMonth(Number(splitted__date[1]) - 1);
        d.setFullYear(splitted__date[2]);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setHours(0);
        setfinalSelectedStartDate2(d);
    };

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const sampleHandleInput = (value) => { // 00:15 am
        setsampleValue(value);
    };

    const changeRuleTitle = (e) => {
        setRuleTitle(e);
    }

    const handleSearchChange = (value) => {
        setSearch(value);

        if (CustomerEligibility.specific_customers) {
            getSpecificCustomers();

        }
        else if (CustomerEligibility.specific_customer_groups) {
            getSpecificGroupCustomers();
        }

    }

    let generateCurrentMonth2 = (currentDate) => {
        return currentDate.getMonth();
    }

    const generateCurrentYear2 = (currentDate) => {
        return currentDate.getFullYear();
    }

    const [{ month2, year2 }, setDate2] = useState({ month2: generateCurrentMonth2(new Date()), year2: generateCurrentYear2(new Date()) });

    const [selectedDates2] = useState({
        start: new Date(),
        end: new Date(),
    });

    const generateCurrentMonth = (currentDate) => {
        return currentDate.getMonth();
    }

    const generateCurrentYear = (currentDate) => {
        return currentDate.getFullYear();
    }

    const [{ month, year }, setDate] = useState({ month: generateCurrentMonth(new Date()), year: generateCurrentYear(new Date()) });

    const [selectedDates] = useState({
        start: new Date(),
        end: new Date(),
    });

    const setTimerValue = (value) => {
        try {
            let _time = value.split(" ")[0];
            let _am_pm = value.split(" ")[1],
                _hours = Number(_time.split(":")[0]),
                _minutes = Number(_time.split(":")[1]);

            if (_am_pm.toLowerCase() === "pm") {
                if (_hours !== 12) {
                    _hours = _hours + 12;
                }
            }
            setsampleValue(value);
            setisTimerClicked(false);
            let tempDate = finalSelectedStartDate;
            tempDate.setHours(_hours);
            tempDate.setMinutes(_minutes);
            setfinalSelectedStartDate(tempDate);
        }
        catch (e) { }
    };

    const handleDateChange = (_date) => {
        var temp = new Date(_date.start);
        setsampleDateValue(`${temp.getDate().toString()}/${(temp.getMonth() + 1).toString()}/${temp.getFullYear().toString()}`);
        setfinalSelectedStartDate(_date.start);
        setisdatevalid(false);
    };

    const handleMonthChange = (month_, year_) => {
        setDate({ month: month_, year: year_ });
        setTimeout(() => { setisDateClicked(true) }, 10);
    };

    const handleDateChange2 = (_date) => {
        var temp = new Date(_date.start);
        setsampleDateValue2(`${temp.getDate().toString()}/${(temp.getMonth() + 1).toString()}/${temp.getFullYear().toString()}`);
        setfinalSelectedStartDate2(_date.start);
    };

    const handleTimerInputBlur2 = () => {
        try {
            // timer input set
            let value = sampleValue2;
            let _time = value.split(" ")[0];
            let _am_pm = value.split(" ")[1],
                _hours = Number(_time.split(":")[0]),
                _minutes = Number(_time.split(":")[1]);
            if (_hours < 0 || _hours > 12) {
                _hours = "00";
            }
            if (_minutes < 0 || _minutes > 59) {
                _minutes = "00";
            }
            if (_am_pm.toLowerCase() !== "pm" && _am_pm.toLowerCase() !== "am") {
                _am_pm = "AM";
            }
            if (_am_pm.toLowerCase() === "pm") {
                _hours = _hours + 12;
            }
            setsampleValue2(_hours + ":" + _minutes + " " + _am_pm);
            setisTimerClicked2(false);
            let tempDate = finalSelectedStartDate2;
            // const d = new Date();
            tempDate.setHours(_hours);
            tempDate.setMinutes(_minutes);
            setfinalSelectedStartDate2(tempDate);
        }
        catch (e) {
            setsampleValue2("00:00 AM");
        }
    }

    const handleTimerInputBlur = () => {
        try {
            // timer input set
            let value = sampleValue;
            let _time = value.split(" ")[0];
            let _am_pm = value.split(" ")[1],
                _hours = Number(_time.split(":")[0]),
                _minutes = Number(_time.split(":")[1]);
            if (_hours < 0 || _hours > 12) {
                _hours = "00";
            }
            if (_minutes < 0 || _minutes > 59) {
                _minutes = "00";
            }
            if (_am_pm.toLowerCase() !== "pm" && _am_pm.toLowerCase() !== "am") {
                _am_pm = "AM";
            }
            if (_am_pm.toLowerCase() === "pm" && Number(_hours) !== 12) {
                _hours = Number(_hours) + 12;
            }
            if (Number(_hours) === 0 && Number(_minutes) === 0) {
                _hours = "00";
                _minutes = "00";
                setsampleValue(_hours + ":" + _minutes + " " + _am_pm);
            }
            if (_hours >= 0 && _hours <= 12) {
                setsampleValue(_hours + ":" + _minutes + " " + _am_pm);
            }
            if (Number(_hours) === 12 && _am_pm.toLowerCase() === "am") {
                _hours = 0;
            }
            setisTimerClicked(false);
            let tempDate = finalSelectedStartDate;
            // const d = new Date();
            tempDate.setHours(_hours);
            tempDate.setMinutes(_minutes);
            setfinalSelectedStartDate(tempDate);
        }
        catch (e) {
            setsampleValue("00:00 AM");
        }
    }

    const sampleHandleInput2 = (value) => { // 00:15 am
        setsampleValue2(value);
    };

    const handleTimerClicked2 = () => {
        setTimeout(() => {
            setisTimerClicked2(true);
        }, 100);
    };

    const handleShowCallander2 = () => {
        setTimeout(() => {
            setisDateClicked2(true)
        }, 100);
    }

    const handleMonthChange2 = (month_, year_) => {
        setDate2({ month2: month_, year2: year_ });
        setTimeout(() => { setisDateClicked2(true) }, 10);
    };

    const handleTimerClicked = () => {
        setTimeout(() => {
            setisTimerClicked(true);
        }, 100);
    };

    const handleShowCallander = () => {
        setTimeout(() => {
            setisDateClicked(true)
        }, 100);
    }

    const setTimerValue2 = (value) => {
        try {
            let _time = value.split(" ")[0];
            let _am_pm = value.split(" ")[1],
                _hours = Number(_time.split(":")[0]),
                _minutes = Number(_time.split(":")[1]);

            if (_am_pm.toLowerCase() === "pm") {
                if (_hours !== 12) {
                    _hours = _hours + 12;
                }
            }

            setsampleValue2(value);
            setisTimerClicked2(false);
            let tempDate = finalSelectedStartDate2;
            tempDate.setHours(_hours);
            tempDate.setMinutes(_minutes);
            setfinalSelectedStartDate2(tempDate);
        }
        catch (e) { }
    };

    const handleplus = () => {
        if (divValue.length >= 1) {
            setDivValue((oldArray) => [...oldArray, divValue]);
        }
    };

    const handleMinus = () => {
        if (divValue.length > 1) {
            setDivValue(divValue.pop());
        }
    };

    const handleProductCustomerListHide = () => {
        setisTimerClicked(false);
        setisDateClicked(false);
        setisTimerClicked2(false);
        setisDateClicked2(false);
    };

    const [objTempDiscountMin, setobjTempDiscountMin] = useState({});
    const [arrTempDiscountMin, setarrTempDiscountMin] = useState([]);

    const handleDiscountMinChange = (value, i) => {
        if (value != "") {
            if (value < 0 || value == -0) {
                value = value * -1;
                document.getElementById("txtRow" + i + "Col1").value = value;
                objTempDiscountMin[i] = value;
                setarrTempDiscountMin(objTempDiscountMin);
            } else {
                objTempDiscountMin[i] = value;
                setarrTempDiscountMin(objTempDiscountMin);
            }
        }

        if (divValue.length > 1) {
            var d = divValue.length;
            var newVal = [];
            for (var i = 0; i < d; i++) {
                newVal.push(divValue[i]);
            }
            setDivValue(newVal);
        }
    };

    // Max

    const [objTempDiscountMax, setobjTempDiscountMax] = useState({});
    const [arrTempDiscountMax, setarrTempDiscountMax] = useState([]);
    const handleDiscountMaxChange = (value, i) => {
        if (value != "") {

            if (value < 0 || value == -0) {
                value = value * -1;
                document.getElementById("txtRow" + i + "Col2").value = value;
                objTempDiscountMax[i] = value;
                setarrTempDiscountMax(objTempDiscountMax);
            } else {
                objTempDiscountMax[i] = value;
                setarrTempDiscountMax(objTempDiscountMax);
            }
        }

        if (divValue.length > 1) {
            var d = divValue.length;
            var newVal = [];
            for (var i = 0; i < d; i++) {
                newVal.push(divValue[i]);
            }
            setDivValue(newVal);
        }
    };

    // ----------Radio Button functionality without switch case start-------

    const [DiscountAppliedOn, setDiscountAppliedOn] = useState({
        point_of_sale: true,
        online_store: false,
        both: false,
    });


    const [DiscountType, setDiscountType] = useState({
        r_percentage: true,
        r_amount: false,
        r_discount: false,
    });

    const [DiscountBasedOn, setDiscountBasedOn] = useState({
        quantities: true,
        amount: false
    });

    const [CustomerEligibility, setCustomerEligibility] = useState({
        all_customers: false,
        specific_customers: true,
        specific_customer_groups: false,
    });


    const setDiscountAppliedOnFunc = (selectedOptions) => {
        setDiscountAppliedOn(selectedOptions);
    };

    const setDiscountTypeFunc = (selectedOptions) => {
        setDiscountType(selectedOptions);
    };

    const setDiscountBasedOnFunc = (selectedOptions) => {
        setDiscountBasedOn(selectedOptions);
    };

    const setCustomerEligibilityFunc = (selectedOptions) => {
        setSpecificcustomers([]);
        setCustomerEligibility(selectedOptions);
    };

    const radioGroups = [
        {
            name: "DiscountType",
            values: ["r_percentage", "r_amount", "r_discount"],
            stateSetter: setDiscountTypeFunc,
        },
        {
            name: "DiscountAppliedOn",
            values: ["point_of_sale", "online_store", "both"],
            stateSetter: setDiscountAppliedOnFunc,
        },
        {
            name: "DiscountBasedOn",
            values: ["quantities", "amount"],
            stateSetter: setDiscountBasedOnFunc,
        },
        {
            name: "CustomerEligibility",
            values: ["all_customers", "specific_customers", "specific_customer_groups"],
            stateSetter: setCustomerEligibilityFunc,
        }
        // Add more objects for other groups of radio buttons
    ];

    const handleRadio = useCallback((_checked, newValue) => {
        const clickedGroup = radioGroups.find(group => group.values.includes(newValue));
        if (clickedGroup) {
            const stateObject = clickedGroup.values.reduce((acc, value) => {
                acc[value] = value === newValue;
                return acc;
            }, {});
            clickedGroup.stateSetter(stateObject);
        }
    }, [radioGroups]);

    const toastValidationError = activeToggle ? (
        <Toast
            content={toggleMesssage}
            error
            onDismiss={toggleActive}
            duration={4500}
        />
    ) : null;

    const toastMarkup = errorActive.activate ? (
        <Frame>
            {" "}
            <Toast
                content={errorActive.errorMessage}
                onDismiss={() => setErrorActive({ activate: false, errorMessage: "" })}
            />
        </Frame>
    ) : null;

    // ------------- Radio Button functionality end ---------------

    const handleDiscountValuesChange = (value, i) => {
        // onchange for discount value
        if (value !== "") {
            if (value < 0 || value === -0) {
                value = value * -1;
                document.getElementById("txtRow" + i + "Col3").value = value
            }
            else if (radioPercentage && value > 100) {
                document.getElementById("txtRow" + i + "Col3").value = 100
            } else {
            }
        }

        if (divValue.length > 1) {
            var d = divValue.length;
            var newVal = [];
            for (let i = 0; i < d; i++) {
                newVal.push(divValue[i]);
            }
            setDivValue(newVal);
        }
    };

    const handleSearchBeforeBrowse = (value, id) => {

        if (CustomerEligibility.specific_customers) {
            getSpecificCustomers();
        }
        else if (CustomerEligibility.specific_customer_groups) {
            getSpecificGroupCustomers();
        }
        handleModal();
        setSearch(value);
    }

    const handleModal = () => {
        if (activeBrowseCustomer === false) {
            setSearch('');
            if (CustomerEligibility.specific_customers === true) {
                getSpecificCustomers();
            }
            else if (CustomerEligibility.specific_customer_groups === true) {
                getSpecificGroupCustomers();
            }
            setActiveBrowseCustomer(true);
        }
        else {
            setActiveBrowseCustomer(false);
        }
    }

    const updateSelection = (id, name, email) => {
        const customerData = [{ id, displayName: name, ...(email !== null && { email }) }];
        setSpecificcustomers(customerData);
        setActiveBrowseCustomer(false);
    }

    // Modal 

    const openModal = (<Modal
        open={activeBrowseCustomer}
        onClose={handleModal}
        title='Customer Search'
    >
        <Modal.Section>
            <TextField prefix={<Icon source={SearchMinor} />}
                value={search}
                focused={true}
                onChange={handleSearchChange}
                placeholder="Search" />
            <FormLayout.Group>
                {
                    loading ? <>
                        <br />
                        <VerticalStack inlineAlign="center">
                            <Spinner accessibilityLabel="Loading form field" hasFocusableParent={false} />{" "}
                        </VerticalStack>
                    </>
                        :
                        <ResourceList
                            resourceName={resourceName}
                            items={items}
                            renderItem={renderItem}
                            selectedItems={selectedItems}
                            onSelectionChange={setSelectedItems}
                            onClick={DisabledByDefault}
                        />
                }
            </FormLayout.Group>
        </Modal.Section>
    </Modal>);


    function renderItem(item) {
        const { id, displayName, email } = item;
        const media = <Avatar customer size="md" name={displayName} />;
        return (
            <ResourceItem
                media={media}
                onClick={() => { updateSelection(id, displayName, email) }}
                accessibilityLabel={`View details for ${displayName}`}
            >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {displayName}
                </Text>
                <div>{email}</div>
            </ResourceItem>
        );
    }

    const getSpecificCustomers = async () => {
        isLoading(true);
        let params = {
            Shop: myShopifyDomain,
            query: search==undefined ? '': search,
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
                setItems(deselectedOptions);
                setCustomerOptions(deselectedOptions);
                isLoading(false);
            }
        }).catch((err) => {
            setErrorMessage("Something went wrong");
            isLoading(false);
        })
    }

    const getSpecificGroupCustomers = async () => {
        isLoading(true);
        let params = {
            Shop: myShopifyDomain,
            query: search==undefined ? '': search,
            groupType: 'Group'
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
                let data = result.customer;
                const deselectedOptions = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    deselectedOptions.push({ id: element._id, displayName: element.group_name, email: null }); //tags html
                }
                setItems(deselectedOptions);
                setCustomerOptions(deselectedOptions);
                isLoading(false);
            }
        }).catch((err) => {
            setErrorMessage("Something went wrong");
            isLoading(false);
        })

    }

    const createRule = async () => {
        let createBool = true;
        setBtnLoader(true);
        var reqFields = [];
        var conditionMaxbyMinCheck = [],
            conditionMinbyAboveMaxCheck = [],
            conditionPercentageAmountCheck = [],
            conditionDiscountAmountCheck = [];
        var conditionLastMaxCheck = false;
        var conditionDate = true;
        var tier_value = ""; // tier value string
        var min = [];
        var max = [];
        var _values = [];
        for (var i = 0; i < divValue.length; i++) {
            var allMinValues = Number(
                document.getElementById("txtRow" + i + "Col1").value
            );
            var allMaxValues = Number(
                document.getElementById("txtRow" + i + "Col2").value
            );
            var allDiscountValues = Number(
                document.getElementById("txtRow" + i + "Col3").value
            );

            min.push(allMinValues);
            if (i == divValue.length - 1) {
                max.push("max");
            } else {
                max.push(allMaxValues);
            }

            _values.push(allDiscountValues);
            var allMaxValuesOfAboveRow = 0,
                allDiscountValuesOfAboveRow = 0;
            if (i == divValue.length - 1) {
                tier_value =
                    tier_value + allMinValues + "-" + "max" + "=" + allDiscountValues;
            } else {
                tier_value =
                    tier_value +
                    allMinValues +
                    "-" +
                    allMaxValues +
                    "=" +
                    allDiscountValues +
                    "|";
            }

            //FieldsInput
            if (i > 0) {
                var minus = i - 1;
                allMaxValuesOfAboveRow = Number(
                    document.getElementById("txtRow" + minus + "Col2").value
                );
                allDiscountValuesOfAboveRow = Number(
                    document.getElementById("txtRow" + minus + "Col3").value
                );
            }
            //FieldsRequiredValidationCheck
            if (
                allMinValues == null ||
                allMinValues == "" ||
                allDiscountValues == null ||
                allDiscountValues == "" ||
                (allMaxValues == null && i != divValue.length - 1) ||
                (allMaxValues == "" && i != divValue.length - 1)
            ) {
                reqFields.push(false);
            } else {
                reqFields.push(true);
            }
            //conditionMaxbyMinCheck
            if (i == divValue.length - 1 || allMaxValues >= allMinValues) {
                if (i == divValue.length - 1) {
                    if (allMaxValues == null || allMaxValues == "") {
                        conditionMaxbyMinCheck.push(true);
                    }
                    //  else {
                    //   conditionMaxbyMinCheck.push(false);
                    // }
                } else {
                    conditionMaxbyMinCheck.push(true);
                }
            } else {
                conditionMaxbyMinCheck.push(false);
            }
            //conditionDiscountAmountCheck
            if (i > 0) {
                if (DiscountType.r_discount) {
                    if (allDiscountValues <= allDiscountValuesOfAboveRow) {
                        conditionDiscountAmountCheck.push(true);
                    } else {
                        conditionDiscountAmountCheck.push(false);
                    }
                } else {
                    if (allDiscountValues >= allDiscountValuesOfAboveRow) {
                        conditionDiscountAmountCheck.push(true);
                    } else {
                        conditionDiscountAmountCheck.push(false);
                    }
                }
            }
            //ValidationMinToPreMaxValueCheck
            if (i > 0) {
                if (allMinValues > allMaxValuesOfAboveRow) {
                    conditionMinbyAboveMaxCheck.push(true);
                } else {
                    conditionMinbyAboveMaxCheck.push(false);
                }
            }
            //validateMaxTierEmptyCheck
            if (i == divValue.length - 1) {
                if (allMaxValues != null && allMaxValues != "") {
                    conditionLastMaxCheck = true;
                }
            }
        }

        if (reqFields.includes(false)) {
            createBool = false;
            toggleMessageChange("Discount Fields Required");
        } else if (conditionMaxbyMinCheck.includes(false)) {
            createBool = false;
            toggleMessageChange(
                "Maximum values should be greater or equal to Minimum values"
            );
        } else if (conditionMinbyAboveMaxCheck.includes(false)) {
            createBool = false;
            toggleMessageChange(
                "Minimum value should be greater than previous Maximum value"
            );
        } else if (DiscountType.r_discount || !DiscountType.r_discount) {
            if (DiscountType.r_discount) {

                if (conditionDiscountAmountCheck.includes(false)) {
                    createBool = false;

                    toggleMessageChange(
                        "Discount value should be less than or equal to previous Discount value"
                    );
                } else if (conditionLastMaxCheck) {
                    createBool = false;

                    toggleMessageChange(
                        "Leave maximum quantity field blank for the last quantity range."
                    );
                }
            } else {
                if (conditionDiscountAmountCheck.includes(false)) {
                    createBool = false;

                    toggleMessageChange(
                        "Discount value should be greater or equal to previous Discount value"
                    );
                    setActiveToggle(true);
                } else if (conditionLastMaxCheck) {
                    createBool = false;

                    toggleMessageChange(
                        "Leave maximum quantity field blank for the last quantity range."
                    );
                } else if (finalSelectedStartDate != null && finalSelectedStartDate2 != null) {
                    if (finalSelectedStartDate > finalSelectedStartDate2) {
                        createBool = false;
                        conditionDate = false;
                        toggleMessageChange(
                            "End Date should be greater than to Start Date"
                        );
                    }
                }
            }
        }

        if (ruleTitle === '') {
            createBool = false;
            toggleMessageChange("Discount Title required");
        }

        else if (specificcustomers.length < 1 && !CustomerEligibility.all_customers) {
            createBool = false;
            toggleMessageChange("Please select customers");
        }

        if (isdatevalid == true || isdatevalid2 == true) {
            createBool = false;
            toggleMessageChange("Please Enter Valid  Date");
        }

        let data = {
            group_type: CustomerEligibility.specific_customers ? "Individuals_Customer" : CustomerEligibility.all_customers ? "normal" : CustomerEligibility.specific_customer_groups ? "Customer_Group" : null,
            customerList: specificcustomers,
            discount_type: DiscountType.r_percentage ? "percentage" : DiscountType.r_amount ? "fixed" : null,
            tier_min: min,
            tier_max: max,
            tier_values: _values,
            referenceNote: ruleTitle,
            Shop: myShopifyDomain,
            startDate: finalSelectedStartDate,
            endDate: finalSelectedStartDate2,
            DiscountBasedOn: DiscountBasedOn.quantities ? "Range of Quantities" : "Range of Amount Spent",
            DiscountAppliedON: DiscountAppliedOn.point_of_sale ? "Point_of_sale" : DiscountAppliedOn.online_store ? "Online_Store" : DiscountAppliedOn.both ? "Both" : null,
            discountCodeCoupan: "",
        }

        if (createBool) {
            await fetch(config.APIURL + `/SubtotalCustomerAPIs/CreateTiers`, {
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
                    setTimeout(() => {
                        navigate("/DetailsPage");
                    }, 1000);
                }
                else {
                    toggleMessageChange(result.message);
                    setActiveToggle(true);
                    setBtnLoader(false);
                }
            }).catch((err) => {
                toggleMessageChange("Something went wrong");
                setActiveToggle(true);
                setBtnLoader(false);
            })
        }
        else {
            setActiveToggle(true);
            setBtnLoader(false);
            createBool = true;
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
            Create Discount Rule
        </span></div>;

    return (
        <div>
            <div onClick={handleProductCustomerListHide}>
                <Page
                    title={titleWithBackButton}
                    compactTitle
                >
                    <AlphaCard>
                        <AlphaCard>
                            <Text variant="headingSm" as="h6">Discount Rule Title</Text>
                            <TextField
                                value={ruleTitle}
                                onChange={changeRuleTitle}
                                autoComplete="off"
                                placeholder='Eg: BFCL sale'
                                helpText='Title will be displayed in the listing for your reference'
                            />

                        </AlphaCard>
                        {/* <FormLayout.Group> */}
                        <br />
                        <br />
                        <AlphaCard>
                            <Text variant="headingSm" as="h6">Discount Applied On</Text>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
                                <RadioButton
                                    label="Point of Sale"
                                    checked={DiscountAppliedOn.point_of_sale}
                                    id="point_of_sale"
                                    name="DiscountAppliedOn"
                                    onChange={handleRadio}
                                />
                                <RadioButton
                                    label="Online Store"
                                    checked={DiscountAppliedOn.online_store}
                                    id="online_store"
                                    name="DiscountAppliedOn"
                                    onChange={handleRadio}
                                />
                                <RadioButton
                                    label="Both"
                                    checked={DiscountAppliedOn.both}
                                    id="both"
                                    name="DiscountAppliedOn"
                                    onChange={handleRadio}
                                />
                            </div>
                        </AlphaCard>
                        <br />
                        <br />
                        <AlphaCard>

                            <Text variant="headingSm" as="h6">Discount Based On</Text>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
                                <RadioButton
                                    label="Range of Quantities"
                                    checked={DiscountBasedOn.quantities}
                                    id="quantities"
                                    name="DiscountBasedOn"
                                    onChange={handleRadio}
                                />
                                <RadioButton
                                    label="Range of Amount Spent"
                                    checked={DiscountBasedOn.amount}
                                    id="amount"
                                    name="DiscountBasedOn"
                                    onChange={handleRadio}
                                />

                            </div>
                        </AlphaCard>
                        <br />
                        <br />
                        {/* </FormLayout.Group> */}
                        <AlphaCard>
                            <Text variant="headingSm" as="h6">Discount Type</Text>
                            <div style={{ display: "flex", marginTop: "10px", flexDirection: "column" }}>
                                <RadioButton
                                    label="Percentage Off"
                                    checked={DiscountType.r_percentage}
                                    id="r_percentage"
                                    name="DiscountType"
                                    onChange={handleRadio}
                                />
                                <RadioButton
                                    label="Amount Off"
                                    checked={DiscountType.r_amount}
                                    id="r_amount"
                                    name="DiscountType"
                                    onChange={handleRadio}
                                />

                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <div id="step_4">
                                    <div>
                                        {divValue.length > 0 ? (
                                            <div className="">
                                                {divValue.length > 0
                                                    ? divValue.map((item, i) => (
                                                        <span id={item} key={i} className="">
                                                            <div className="Custom_Input_TextField">
                                                                <div className="Custom_Input_TextField_Item">
                                                                    <div className="Polaris-Connected">
                                                                        <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
                                                                            <div className="Polaris-TextField">
                                                                                <input
                                                                                    type="number"
                                                                                    id={"txtRow" + i + "Col1"}
                                                                                    className={
                                                                                        "Polaris-TextField__Input txtRow" +
                                                                                        i +
                                                                                        "Col1"
                                                                                    }
                                                                                    placeholder="Minimum Amount"
                                                                                    aria-labelledby="PolarisTextField5Label"
                                                                                    aria-invalid="false"
                                                                                    aria-multiline="false"
                                                                                    value={textFieldValue}
                                                                                    onChange={(e) => {
                                                                                        handleDiscountMinChange(
                                                                                            e.target.value,
                                                                                            i
                                                                                        );
                                                                                    }}
                                                                                ></input>
                                                                                <div className="Polaris-TextField__Backdrop"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {i === divValue.length - 1 ? (
                                                                    <div className="Custom_Input_TextField_Item_Width">
                                                                        <div className="Polaris-Connected">
                                                                            <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
                                                                                <div className="Polaris-TextField">
                                                                                    <input
                                                                                        type="number"
                                                                                        id={"txtRow" + i + "Col2"}
                                                                                        className={
                                                                                            "Polaris-TextField__Input txtRow" +
                                                                                            i +
                                                                                            "Col2"
                                                                                        }
                                                                                        readOnly
                                                                                        placeholder="Leave this field blank for max value"
                                                                                        aria-labelledby="PolarisTextField5Label"
                                                                                        aria-invalid="false"
                                                                                        aria-multiline="false"
                                                                                        value={textFieldValue}
                                                                                    ></input>
                                                                                    <div className="Polaris-TextField__Backdrop"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="Custom_Input_TextField_Item_Width">
                                                                        <div className="Polaris-Connected">
                                                                            <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
                                                                                <div className="Polaris-TextField">
                                                                                    <input
                                                                                        type="number"
                                                                                        id={"txtRow" + i + "Col2"}
                                                                                        className={
                                                                                            "Polaris-TextField__Input txtRow" +
                                                                                            i +
                                                                                            "Col2"
                                                                                        }
                                                                                        placeholder="Maximum Amount"
                                                                                        aria-labelledby="PolarisTextField5Label"
                                                                                        aria-invalid="false"
                                                                                        aria-multiline="false"
                                                                                        value={textFieldValue}
                                                                                        onChange={(e) => {
                                                                                            handleDiscountMaxChange(
                                                                                                e.target.value,
                                                                                                i
                                                                                            );
                                                                                        }}
                                                                                    ></input>
                                                                                    <div className="Polaris-TextField__Backdrop"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="Custom_Input_TextField_Item">
                                                                    <div className="">
                                                                        <div className="Polaris-Connected">
                                                                            <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
                                                                                <div className="Polaris-TextField">
                                                                                    <input
                                                                                        type="number"
                                                                                        id={"txtRow" + i + "Col3"}
                                                                                        className={
                                                                                            "Polaris-TextField__Input txtRow" +
                                                                                            i +
                                                                                            "Col3"
                                                                                        }
                                                                                        placeholder="Discount Off"
                                                                                        aria-labelledby="PolarisTextField5Label"
                                                                                        aria-invalid="false"
                                                                                        aria-multiline="false"
                                                                                        value={textFieldValue}
                                                                                        onChange={(e) => {
                                                                                            handleDiscountValuesChange(
                                                                                                e.target.value,
                                                                                                i
                                                                                            );
                                                                                        }}
                                                                                    ></input>
                                                                                    <div className="Polaris-TextField__Backdrop"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    ))
                                                    : null}
                                            </div>
                                        ) : null}
                                        <div id="plusMinusButtonDiv" className="Create_Plus_Minue_Top">
                                            <span id="plusDiv" onClick={handleplus}>
                                                <i className="fas fa-plus"></i>
                                            </span>
                                            <span id="minusDiv" onClick={handleMinus}>
                                                <i className="fas fa-minus"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AlphaCard>
                        <br />
                        <br />

                        <AlphaCard>
                            <Text variant="headingSm" as="h6">Customer Eligibility</Text>
                            <div style={{ display: "flex", marginTop: "10px", flexDirection: "column" }}>
                                <RadioButton
                                    label="All Customer"
                                    disabled
                                    checked={CustomerEligibility.all_customers}
                                    id="all_customers"
                                    name="CustomerEligibility"
                                    onChange={handleRadio}
                                />
                                <RadioButton
                                    label="Specific Customer"
                                    checked={CustomerEligibility.specific_customers}
                                    id="specific_customers"
                                    name="CustomerEligibility"
                                    onChange={handleRadio}
                                />
                                <RadioButton
                                    label="Specific Group of Customers"
                                    checked={CustomerEligibility.specific_customer_groups}
                                    id="specific_customer_groups"
                                    name="CustomerEligibility"
                                    onChange={handleRadio}
                                />
                            </div>
                            {
                                !CustomerEligibility.all_customers &&
                                <TextField
                                    connectedRight={<Button onClick={handleModal}>Browse</Button>}
                                    onChange={handleSearchBeforeBrowse}
                                    id='customers' autoComplete="off"
                                    placeholder={`${specificcustomers.length > 0 ? specificcustomers[0].displayName : CustomerEligibility.specific_customers ? "Search Customer" : "Search Customer Group"}`}
                                />
                            }

                            {openModal}

                        </AlphaCard>

                        <div className="mrg_top20">
                            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "var(--p-shadow-md)" }}>
                                <div className="Card_Section_padding">
                                    <Text variant="headingSm" as="h6">Active Dates</Text>
                                    <div id="step_7">
                                        {/* Start Date Time Picker Start */}
                                        <div className="custom-margin-bottom">
                                            <div className="samplePicker_Container">
                                                <h4>Starting from:</h4>
                                                <div className="dateTimePicker_Container">
                                                    <div className="dateTimePicker_Container_Item_One">
                                                        <TextField
                                                            value={sampleDateValue}
                                                            align="left"
                                                            type="text"
                                                            onChange={sampleHandleDateInput}
                                                        // onFocus={handleTimerClicked}
                                                        />
                                                        <Button icon={CalendarMajor} onClick={handleShowCallander}></Button>
                                                    </div>
                                                    <div className="dateTimePicker_Container_Item_Two">
                                                        <TextField
                                                            value={sampleValue}
                                                            align="left"
                                                            type="text"
                                                            onChange={sampleHandleInput}
                                                            // onFocus={handleTimerClicked}
                                                            onBlur={handleTimerInputBlur}
                                                        />
                                                        <Button icon={ClockMajor} onClick={handleTimerClicked}></Button>
                                                    </div>
                                                </div>
                                                {isTimerClicked ? (
                                                    <div className="samplePickerOptions_EditSubtotal">
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("00:00 AM")}>00:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("00:30 AM")}>00:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("01:00 AM")}>01:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("01:30 AM")}>01:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("02:00 AM")}>02:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("02:30 AM")}>02:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("03:00 AM")}>03:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("03:30 AM")}>03:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("04:00 AM")}>04:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("04:30 AM")}>04:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("05:00 AM")}>05:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("05:30 AM")}>05:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("06:00 AM")}>06:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("06:30 AM")}>06:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("07:00 AM")}>07:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("07:30 AM")}>07:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("08:00 AM")}>08:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("08:30 AM")}>08:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("09:00 AM")}>09:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("09:30 AM")}>09:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("10:00 AM")}>10:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("10:30 AM")}>10:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("11:00 AM")}>11:00 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("11:30 AM")}>11:30 AM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("12:00 PM")}>12:00 PM</div>

                                                        <div className="samplePickerOption" onClick={() => setTimerValue("12:30 PM")}>12:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("01:00 PM")}>01:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("01:30 PM")}>01:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("02:00 PM")}>02:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("02:30 PM")}>02:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("03:00 PM")}>03:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("03:30 PM")}>03:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("04:00 PM")}>04:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("04:30 PM")}>04:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("05:00 PM")}>05:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("05:30 PM")}>05:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("06:00 PM")}>06:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("06:30 PM")}>06:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("07:00 PM")}>07:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("07:30 PM")}>07:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("08:00 PM")}>08:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("08:30 PM")}>08:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("09:00 PM")}>09:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("09:30 PM")}>09:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("10:00 PM")}>10:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("10:30 PM")}>10:30 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("11:00 PM")}>11:00 PM</div>
                                                        <div className="samplePickerOption" onClick={() => setTimerValue("11:30 PM")}>11:30 PM</div>
                                                    </div>
                                                ) : null}
                                                {isDateClicked ?
                                                    <div className="DatePickerDiv">
                                                        <DatePicker
                                                            month={month}
                                                            year={year}
                                                            onChange={handleDateChange}
                                                            onMonthChange={handleMonthChange}
                                                            selected={selectedDates}
                                                        /></div> : null}
                                            </div>
                                        </div>
                                        {/* Start Date Time Picker End */}



                                        {/* End Date Time Picker Start */}
                                        <div className="samplePicker_Container">
                                            <h4>Ending at:</h4>
                                            <div className="dateTimePicker_Container">
                                                <div className="dateTimePicker_Container_Item_One">
                                                    <TextField
                                                        value={sampleDateValue2}
                                                        align="left"
                                                        type="text"
                                                        onChange={sampleHandleDateInput2}
                                                    // onFocus={handleTimerClicked}
                                                    />
                                                    <Button icon={CalendarMajor} onClick={handleShowCallander2}></Button>
                                                </div>
                                                <div className="dateTimePicker_Container_Item_Two">
                                                    <TextField
                                                        value={sampleValue2}
                                                        align="left"
                                                        type="text"
                                                        onChange={sampleHandleInput2}
                                                        // onFocus={handleTimerClicked}
                                                        onBlur={handleTimerInputBlur2}
                                                    />
                                                    <Button icon={ClockMajor} onClick={handleTimerClicked2}></Button>
                                                </div>
                                            </div>
                                            {isTimerClicked2 ? (
                                                <div className="samplePickerOptions_EditSubtotal">
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("00:00 AM")}>00:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("00:30 AM")}>00:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("01:00 AM")}>01:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("01:30 AM")}>01:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("02:00 AM")}>02:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("02:30 AM")}>02:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("03:00 AM")}>03:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("03:30 AM")}>03:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("04:00 AM")}>04:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("04:30 AM")}>04:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("05:00 AM")}>05:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("05:30 AM")}>05:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("06:00 AM")}>06:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("06:30 AM")}>06:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("07:00 AM")}>07:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("07:30 AM")}>07:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("08:00 AM")}>08:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("08:30 AM")}>08:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("09:00 AM")}>09:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("09:30 AM")}>09:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("10:00 AM")}>10:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("10:30 AM")}>10:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("11:00 AM")}>11:00 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("11:30 AM")}>11:30 AM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("12:00 PM")}>12:00 PM</div>

                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("12:30 PM")}>12:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("01:00 PM")}>01:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("01:30 PM")}>01:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("02:00 PM")}>02:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("02:30 PM")}>02:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("03:00 PM")}>03:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("03:30 PM")}>03:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("04:00 PM")}>04:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("04:30 PM")}>04:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("05:00 PM")}>05:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("05:30 PM")}>05:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("06:00 PM")}>06:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("06:30 PM")}>06:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("07:00 PM")}>07:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("07:30 PM")}>07:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("08:00 PM")}>08:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("08:30 PM")}>08:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("09:00 PM")}>09:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("09:30 PM")}>09:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("10:00 PM")}>10:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("10:30 PM")}>10:30 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("11:00 PM")}>11:00 PM</div>
                                                    <div className="samplePickerOption" onClick={() => setTimerValue2("11:30 PM")}>11:30 PM</div>
                                                </div>
                                            ) : null}
                                            {isDateClicked2 ?
                                                <div className="DatePickerDiv">
                                                    <DatePicker
                                                        month={month2}
                                                        year={year2}
                                                        onChange={handleDateChange2}
                                                        onMonthChange={handleMonthChange2}
                                                        selected={selectedDates2}
                                                    />
                                                </div>
                                                : null
                                            }
                                        </div>
                                        {/* End Date Time Picker End */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ margin: "20px 0", gap: "20px", display: "flex" }}>
                            <Button loading={btnLoader} primary size='medium' onClick={createRule} >
                                Create Rule
                            </Button>
                        </div>
                    </AlphaCard>
                    {toastSuccessMarkup}
                    {toastErrorMarkup}

                    {toastMarkup}
                    {toastValidationError}
                </Page>
            </div>
        </div>
    )
}

export default CreateQuantityRule;
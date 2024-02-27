import { Page, HorizontalGrid, AlphaCard, DataTable, VerticalStack, Text, Scrollable, useBreakpoints, Popover, Button, Box, Select, OptionList, HorizontalStack, TextField, Icon, DatePicker, ButtonGroup } from "@shopify/polaris";
import React, { useState, useEffect, useRef } from "react";
import DashboardCard from "./SubComponents/DashboardCard";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../ContextApi/AuthContext";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ArrowRightMinor, CalendarMinor } from "@shopify/polaris-icons";
import DashboardSkeleton from "./SubComponents/DashboardSkeleton";
import config from "../../config.json";
var currencyFormatter = require("currency-formatter");


const Dashboard = () => {
    const location = useLocation();
    const {setIsStore} = useContext(AuthContext);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [sellerInfo, setSellerInfo] = useState([]);
    const [planTable, setPlanTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Date Picker
    const { mdDown } = useBreakpoints();
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const yesterday = new Date(new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0));
    const ranges = [
        {
            title: "Today",
            alias: "today",
            period: {
                since: today,
                until: today,
            },
        },
        {
            title: "Yesterday",
            alias: "yesterday",
            period: {
                since: yesterday,
                until: yesterday,
            },
        },
        {
            title: "Last 7 days",
            alias: "last7days",
            period: {
                since: new Date(new Date(new Date().setDate(today.getDate() - 7)).setHours(0, 0, 0, 0)),
                until: today,
            },
        },
        {
            title: "Last 30 days",
            alias: "last30days",
            period: {
                since: new Date(new Date(new Date().setDate(today.getDate() - 30)).setHours(0, 0, 0, 0)),
                until: today,
            },
        },
    ];
    const [popoverActive, setPopoverActive] = useState(false);
    const [activeDateRange, setActiveDateRange] = useState(ranges[0]);
    const [inputValues, setInputValues] = useState({});
    const [{ month, year }, setDate] = useState({
        month: activeDateRange.period.since.getMonth(),
        year: activeDateRange.period.since.getFullYear(),
    });
    const datePickerRef = useRef(null);
    const VALID_YYYY_MM_DD_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}/;
    function isDate(date) {
        return !isNaN(new Date(date).getDate());
    }
    function isValidYearMonthDayDateString(date) {
        return VALID_YYYY_MM_DD_DATE_REGEX.test(date) && isDate(date);
    }
    function isValidDate(date) {
        return date.length === 10 && isValidYearMonthDayDateString(date);
    }
    function parseYearMonthDayDateString(input) {
        const [year, month, day] = input.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day));
    }
    function formatDateToYearMonthDayDateString(date) {
        const year = String(date.getFullYear());
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        if (month.length < 2) {
            month = String(month).padStart(2, "0");
        }
        if (day.length < 2) {
            day = String(day).padStart(2, "0");
        }
        return [year, month, day].join("-");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function formatDate(date) {
        return formatDateToYearMonthDayDateString(date);
    }
    function nodeContainsDescendant(rootNode, descendant) {
        if (rootNode === descendant) {
            return true;
        }
        let parent = descendant.parentNode;
        while (parent != null) {
            if (parent === rootNode) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }
    function isNodeWithinPopover(node) {
        return datePickerRef?.current ? nodeContainsDescendant(datePickerRef.current, node) : false;
    }
    function handleStartInputValueChange(value) {
        setInputValues((prevState) => {
            return { ...prevState, since: value };
        });
        if (isValidDate(value)) {
            const newSince = parseYearMonthDayDateString(value);
            setActiveDateRange((prevState) => {
                const newPeriod = prevState.period && newSince <= prevState.period.until ? { since: newSince, until: prevState.period.until } : { since: newSince, until: newSince };
                return {
                    ...prevState,
                    period: newPeriod,
                };
            });
        }
    }
    function handleEndInputValueChange(value) {
        setInputValues((prevState) => ({ ...prevState, until: value }));
        if (isValidDate(value)) {
            const newUntil = parseYearMonthDayDateString(value);
            setActiveDateRange((prevState) => {
                const newPeriod = prevState.period && newUntil >= prevState.period.since ? { since: prevState.period.since, until: newUntil } : { since: newUntil, until: newUntil };
                return {
                    ...prevState,
                    period: newPeriod,
                };
            });
        }
    }
    function handleInputBlur({ relatedTarget }) {
        const isRelatedTargetWithinPopover = relatedTarget != null && isNodeWithinPopover(relatedTarget);
        if (isRelatedTargetWithinPopover) {
            return;
        }
        setPopoverActive(false);
    }
    function handleMonthChange(month, year) {
        setDate({ month, year });
    }
    function handleCalendarChange({ start, end }) {
        const newDateRange = ranges.find((range) => {
            return range.period.since.valueOf() === start.valueOf() && range.period.until.valueOf() === end.valueOf();
        }) || {
            alias: "custom",
            title: "Custom",
            period: {
                since: start,
                until: end,
            },
        };
        setActiveDateRange(newDateRange);
    }

    function cancel() {
        setPopoverActive(false);
    }
    useEffect(() => {
        if(location.pathname=== "/"){
            setIsStore(false);
       }
        if (activeDateRange) {
            setInputValues({
                since: formatDate(activeDateRange.period.since),
                until: formatDate(activeDateRange.period.until),
            });
            function monthDiff(referenceDate, newDate) {
                return newDate.month - referenceDate.month + 12 * (referenceDate.year - newDate.year);
            }
            const monthDifference = monthDiff(
                { year, month },
                {
                    year: activeDateRange.period.until.getFullYear(),
                    month: activeDateRange.period.until.getMonth(),
                }
            );
            if (monthDifference > 1 || monthDifference < 0) {
                setDate({
                    month: activeDateRange.period.until.getMonth(),
                    year: activeDateRange.period.until.getFullYear(),
                });
            }
        }
    }, [activeDateRange]);
    const buttonValue = activeDateRange.title === "Custom" ? activeDateRange.period.since.toDateString() + " - " + activeDateRange.period.until.toDateString() : activeDateRange.title;
    //end datepicker

    function apply() {
        getConsumers();
        setPopoverActive(false);
    }

    const getConsumers = async () => {
        let startDate = new Date(activeDateRange.period.since);
        let startFormat = startDate.toISOString();
        let endDate = new Date(activeDateRange.period.until);

        setIsLoading(true);
        await axios
            .get(config.APIURL + `/admin/SellerCountApi?startDate=${startFormat}&endDate=${endDate.toISOString()}`)
            .then((item) => {
                let infoList = item.data;
                if (infoList.status === "success") {
                    setSellerInfo(infoList.info.SellerInfo);
                    setPlanTable(infoList.info.planInfo);
                    setIsLoading(false);
                } else {
                    alert("not data");
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getConsumers();
    }, []);

    const [amountTotal, activeTotal] = planTable.map(({ amount, totalActive }) => [amount, totalActive]).reduce(([amountAcc, totalAcc], [amount, total]) => [amountAcc + amount, totalAcc + total], [0, 0]);

    return (
        <React.Fragment>
            {isLoading ? (
                <DashboardSkeleton setActiveDateRange={setActiveDateRange} activeDateRange={activeDateRange} ranges={ranges} />
            ) : (
                <Page
                    title="DashBoard"
                    primaryAction={
                        <Popover
                            active={popoverActive}
                            autofocusTarget="none"
                            preferredAlignment="left"
                            preferredPosition="below"
                            fluidContent
                            sectioned={false}
                            fullHeight
                            activator={
                                <Button outline size="medium" icon={CalendarMinor} onClick={() => setPopoverActive(!popoverActive)}>
                                    {buttonValue}
                                </Button>
                            }
                            onClose={() => setPopoverActive(false)}
                        >
                            <Popover.Pane fixed>
                                <HorizontalGrid
                                    columns={{
                                        xs: "1fr",
                                        mdDown: "1fr",
                                        md: "max-content max-content",
                                    }}
                                    gap={0}
                                    ref={datePickerRef}
                                >
                                    <Box maxWidth={mdDown ? "516px" : "212px"} width={mdDown ? "100%" : "212px"} padding={{ xs: 5, md: 0 }} paddingBlockEnd={{ xs: 1, md: 0 }}>
                                        {mdDown ? (
                                            <Select
                                                label="dateRangeLabel"
                                                labelHidden
                                                onChange={(value) => {
                                                    const result = ranges.find(({ title, alias }) => title === value || alias === value);
                                                    setActiveDateRange(result);
                                                }}
                                                value={activeDateRange?.title || activeDateRange?.alias || ""}
                                                options={ranges.map(({ alias, title }) => title || alias)}
                                            />
                                        ) : (
                                            <Scrollable style={{ height: "334px" }}>
                                                <OptionList
                                                    options={ranges.map((range) => ({
                                                        value: range.alias,
                                                        label: range.title,
                                                    }))}
                                                    selected={activeDateRange.alias}
                                                    onChange={(value) => {
                                                        setActiveDateRange(ranges.find((range) => range.alias === value[0]));
                                                    }}
                                                />
                                            </Scrollable>
                                        )}
                                    </Box>
                                    <Box padding={{ xs: 5 }} maxWidth={mdDown ? "320px" : "516px"}>
                                        <VerticalStack gap="4">
                                            <HorizontalStack gap="2">
                                                <div style={{ flexGrow: 1 }}>
                                                    <TextField
                                                        role="combobox"
                                                        label={"Since"}
                                                        labelHidden
                                                        prefix={<Icon source={CalendarMinor} />}
                                                        value={inputValues.since}
                                                        onChange={handleStartInputValueChange}
                                                        onBlur={handleInputBlur}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <Icon source={ArrowRightMinor} />
                                                <div style={{ flexGrow: 1 }}>
                                                    <TextField
                                                        role="combobox"
                                                        label={"Until"}
                                                        labelHidden
                                                        prefix={<Icon source={CalendarMinor} />}
                                                        value={inputValues.until}
                                                        onChange={handleEndInputValueChange}
                                                        onBlur={handleInputBlur}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </HorizontalStack>
                                            <div>
                                                <DatePicker
                                                    month={month}
                                                    year={year}
                                                    selected={{
                                                        start: activeDateRange.period.since,
                                                        end: activeDateRange.period.until,
                                                    }}
                                                    onMonthChange={handleMonthChange}
                                                    onChange={handleCalendarChange}
                                                    allowRange
                                                />
                                            </div>
                                        </VerticalStack>
                                    </Box>
                                </HorizontalGrid>
                            </Popover.Pane>
                            <Popover.Pane fixed>
                                <Popover.Section>
                                    <HorizontalStack align="end">
                                        <ButtonGroup>
                                            <Button onClick={cancel}>Cancel</Button>
                                            <Button primary onClick={apply}>
                                                Apply
                                            </Button>
                                        </ButtonGroup>
                                    </HorizontalStack>
                                </Popover.Section>
                            </Popover.Pane>
                        </Popover>
                    }
                >
                    <Scrollable>
                        <VerticalStack gap="4">
                            <HorizontalGrid gap="4" columns={isMobile ? 2 : 3}>
                                {sellerInfo.map((item, index) => (
                                    <DashboardCard key={index} sx={{ height: "100%" }} title={item.title} value={item.total} status={item.status} Item={item} hostTitle={activeDateRange.title} />
                                ))}
                            </HorizontalGrid>
                            <AlphaCard>
                                <DataTable
                                    columnContentTypes={["text", "numeric", "numeric", "numeric", "numeric"]}
                                    headings={[
                                        <Text fontWeight="bold">CTD Plan's</Text>,
                                        <Text fontWeight="bold">Seller</Text>,
                                        <Text fontWeight="bold">Active Seller</Text>,
                                        <Text fontWeight="bold">Price</Text>,
                                        <Text fontWeight="bold">total</Text>,
                                    ]}
                                    rows={planTable.map((item) => [item.title, item.total, item.totalActive, currencyFormatter.format(item.price, { code: item.currency }), currencyFormatter.format(item.amount, { code: item.currency })])}
                                    totals={["", "", activeTotal, "", currencyFormatter.format(amountTotal, { code: "USD" })]}
                                    showTotalsInFooter
                                    totalsName={{
                                        singular: "Total",
                                        plural: "Total",
                                    }}
                                />
                            </AlphaCard>
                        </VerticalStack>
                    </Scrollable>
                </Page>
            )}
        </React.Fragment>
    );
};

export default Dashboard;

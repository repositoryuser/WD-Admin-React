import {
  AlphaCard,
  HorizontalGrid,
  VerticalStack,
  Link,
  Page,
  Text,
  Box,
  Badge,
  Tabs,
  Loading,
  FooterHelp,
  Toast,
  Layout,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import CustomerGroupObj from "./subComponent/CustomerGroup";
import NormalTier from "./subComponent/NormalTier";
import SpecificTier from "./subComponent/TierObject";
import config from "../../config.json";
import { AuthContext } from "../../ContextApi/AuthContext";
import DateAndTimeHook from "../../Hooks/DateAndTimeHook";
import SubtotalTier from "./subComponent/SubtotalTiers";
import TagGroup from "./CustomerComponents/TagGroup";
import CustomerList from "./CustomerCRUD/CustomerList";
import ProductDetailsPage from "./ProductDetails/productDetails";
import ChangeHostName from "./ChangeHostName";

const DetailsPage = () => {
  const navigate = useNavigate();
  const { setShopAssetDetail, sellerDetails, setIsStore } =
    React.useContext(AuthContext);
  const {
    _id,
    MyShopifyDomain,
    InstallStatus,
    Host,
    shopDetails,
    CustomerGroup,
    NormalTierObject,
    TierObject,
    IsAppEnable,
    installDate,
    plan,
    SubtotalTiers,
  } = sellerDetails;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [tabSelected, setTabSelected] = useState(0);
  const [storeEexist, setStoreEexist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productCheck, setProductCheck] = useState(false);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setTabSelected(selectedTabIndex),
    []
  );
  //success Toast
  const [successTost, setSuccessTost] = useState(false);
  const [successTostContent, setSuccessTostContent] = useState("");
  const toggleSuccessActive = useCallback(
    () => setSuccessTost((successTost) => !successTost),
    []
  );
  const successToastMarkup = successTost ? (
    <Toast content={successTostContent} onDismiss={toggleSuccessActive} />
  ) : null;
  //error Toast
  const [errorTost, setErrorTost] = useState(false);
  const toggleErrorTost = useCallback(
    () => setErrorTost((errorTost) => !errorTost),
    []
  );
  const [errorContent, setErrorContent] = useState("Saving error");
  const errorTostMarkup = errorTost ? (
    <Toast content={errorContent} error onDismiss={toggleErrorTost} />
  ) : null;

  console.log("Tier Object is ", TierObject);

  const tabs = [
    {
      id: "all-customers-1",
      content: (
        <span style={{ fontWeight: "bold" }}>
          Customer Specific Rules{" "}
          <Badge status="new">{TierObject?.length ?? 0}</Badge>
        </span>
      ),
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-1",
    },
    {
      id: "accepts-marketing-1",
      content: (
        <span style={{ fontWeight: "bold" }}>
          Discount Rule for all Customer{" "}
          <Badge status="new"> {NormalTierObject?.length ?? 0}</Badge>
        </span>
      ),
      panelID: "accepts-marketing-content-1",
    },
    {
      id: "repeat-customers-1",
      content: (
        <span style={{ fontWeight: "bold" }}>
          Costumer group{" "}
          <Badge status="new">{CustomerGroup?.length ?? 0}</Badge>
        </span>
      ),
      panelID: "repeat-customers-content-1",
    },
    {
      id: "repeat-customer-1",
      content: (
        <span style={{ fontWeight: "bold" }}>
          Subtotal Tiers{" "}
          <Badge status="new">{SubtotalTiers?.length ?? 0}</Badge>
        </span>
      ),
      panelID: "repeat-custome-content-1",
    },
  ];

  if (MyShopifyDomain === undefined) {
    navigate("/");
  }

  const handelNavigateThemeList = () => {
    setShopAssetDetail(sellerDetails);
    navigate(`/AssetThemeExtesntion`);
    // window.location = "/AssetThemeList/"+_id+MyShopifyDomain;
  };

  const handelCheckStore = async () => {
    if (_id !== undefined && _id !== null && _id !== "") {
      setIsLoading(true);
      let token = localStorage.getItem("wd-admin-token");
      fetch(`${config.APIURL}/admin/checkStoreActiveORnot?_id=${_id}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "your-rapidapi-key",
          "X-RapidAPI-Host": "famous-quotes4.p.rapidapi.com",
          auth_token: token,
        },
      })
        .then((response) => response.json())
        .then((item) => {
          // eslint-disable-next-line eqeqeq
          if (item?.status == "success" && sellerDetails.InstallStatus) {
            if (item.storeDetail?.length !== 0) {
              setStoreEexist(false);
            } else {
              setStoreEexist(true);
            }
            setIsLoading(false);
          }
          // eslint-disable-next-line eqeqeq
          else if (item?.status == "session expired") {
            alert("session expired login again");
            window.location.reload(false);
            window.location = "/";
          } else {
            setStoreEexist(true);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log("error: ", error);
          setStoreEexist(true);
          setIsLoading(false);
        });
    }
  };

  // const handleNavigateGroupList = () => {
  //   navigate(`/GroupList/${MyShopifyDomain}`);
  // }

  // const handleNavigateCreateRule = () => {
  //   navigate(`/CreateRule/${MyShopifyDomain}`);
  // }

  // const handleNavigateCreateQuantityRule = () => {
  //   navigate(`/CreateQuantityRule/${MyShopifyDomain}`);
  // }

  // const handleNavigateSetting = () => {
  //   navigate(`/Setting/${MyShopifyDomain}`);
  // }

  useEffect(() => {
    handelCheckStore();
    !storeEexist && setIsStore(true);
  }, []);

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <Page
          breadcrumbs={[
            {
              content: "ListingPage",
              onAction: () => {
                navigate("/ListingPage");
              },
            },
          ]}
          fullWidth
          title={shopDetails?.shop_owner ?? "shopify Domain"}
          titleMetadata={
            InstallStatus ? (
              <Badge status="success">Installed</Badge>
            ) : (
              <Badge status="attention">Uninstalled</Badge>
            )
          }
          compactTitle
          subtitle={MyShopifyDomain}
          primaryAction={{
            content: "Edit Code",
            onAction: () => handelNavigateThemeList(),
            disabled: storeEexist,
          }}
        >
          <VerticalStack gap={"5"}>
            <HorizontalGrid
              columns={isMobile ? 1 : ["twoThirds", "oneHalf"]}
              gap={isMobile ? "2" : "4"}
            >
              <AlphaCard roundedAbove="xl">
                <Tabs
                  tabs={tabs}
                  selected={tabSelected}
                  onSelect={handleTabChange}
                  fitted
                >
                  {tabSelected == 0 ? (
                    <SpecificTier TierObject={TierObject} />
                  ) : tabSelected == 1 ? (
                    <NormalTier NormalTierObject={NormalTierObject} />
                  ) : tabSelected == 2 ? (
                    <CustomerGroupObj CustomerGroup={CustomerGroup} />
                  ) : tabSelected == 3 ? (
                    <SubtotalTier SubtotalTiers={SubtotalTiers} />
                  ) : null}
                </Tabs>
              </AlphaCard>
              <AlphaCard roundedAbove="sm">
                <VerticalStack gap="5">
                  <Box>
                    <Text variant="headingSm" as="h6">
                      {shopDetails?.shop_owner ?? "shopify Domain"}
                    </Text>
                    <a
                      href={`https://${MyShopifyDomain}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {MyShopifyDomain}
                    </a>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      HOST
                    </Text>
                    <Link url={`https://${Host ?? MyShopifyDomain}`} external>
                      {Host ?? MyShopifyDomain}
                    </Link>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      SHOP OWNER
                    </Text>
                    <Text>
                      <Text>{shopDetails?.shop_owner ?? "no shop_owner"}</Text>
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      EMAIL ADDRESS
                    </Text>
                    <Text>
                      <a
                        href={`https://mailto:${shopDetails?.email}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shopDetails?.email ?? "no email address"}
                      </a>
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      SHOPIFY PLAN
                    </Text>
                    <Text>{shopDetails?.plan_name ?? "no plan detail"}</Text>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      STORE INFORMATION
                    </Text>
                    <Text>
                      {shopDetails?.country_name} , {shopDetails?.city}
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      IS_APP_ENABLE
                    </Text>
                    <Text>{IsAppEnable ? "Enable" : "Disable" ?? ""}</Text>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      INSTALL DATE
                    </Text>
                    <Text>
                      <DateAndTimeHook FullDate={installDate} />
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="headingSm" as="h6">
                      CUSTOM TIERED DISCOUNT
                    </Text>
                    <Text>
                      {(() => {
                        switch (plan) {
                          case 1:
                            return "Starter";
                          case 2:
                            return "Plus";
                          case 3:
                            return "Pro";
                          case 4:
                            return "Enterprise";
                          default:
                            return "No plan";
                        }
                      })()}
                    </Text>
                  </Box>
                </VerticalStack>
              </AlphaCard>
            </HorizontalGrid>
            {!storeEexist ? (
              <AlphaCard>
                {/* <AlphaCard>
                    <Text alignment='center' fontWeight="bold" >CREATE SECTION </Text>
                    <Layout.Section>
                      <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <Button onClick={handleNavigateGroupList} primary >Create Customer Group for Discount</Button>
                        <Button onClick={handleNavigateCreateQuantityRule} primary  >Create Quantity Discount</Button>
                        <Button onClick={handleNavigateCreateRule} primary >Create Subtotal Discount</Button>
                        <Button onClick={handleNavigateSetting} variant="plain" size="medium">
                          <Icon
                            source={SettingsMajor}
                            tone="base"
                          />
                        </Button>
                      </div>
                    </Layout.Section>
                  </AlphaCard> */}

                <Layout.Section>
                  <TagGroup MyShopifyDomain={MyShopifyDomain} />
                </Layout.Section>

                <Layout.Section>
                  <CustomerList MyShopifyDomain={MyShopifyDomain} />
                </Layout.Section>

                <Layout.Section>
                  <ProductDetailsPage MyShopifyDomain={MyShopifyDomain} />
                </Layout.Section>

                <Layout.Section>
                  <ChangeHostName MyShopifyDomain={MyShopifyDomain} />
                </Layout.Section>
              </AlphaCard>
            ) : null}
          </VerticalStack>
          {successToastMarkup}
          {errorTostMarkup}
        </Page>
      )}
      <FooterHelp></FooterHelp>
    </React.Fragment>
  );
};

export default DetailsPage;

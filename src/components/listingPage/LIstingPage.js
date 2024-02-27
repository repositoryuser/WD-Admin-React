/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from "react";
import {
  ChoiceList,
  LegacyCard,
  Filters,
  DataTable,
  Page,
  Text,
  VerticalStack,
  Badge,
  Button,
  FooterHelp,
  Pagination,
  Spinner,
} from "@shopify/polaris";
import config from "../../config.json";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DateAndTimeHook from "../../Hooks/DateAndTimeHook";
import { useContext } from "react";
import { AuthContext } from "../../ContextApi/AuthContext";

export default function ListingPage() {
  const [cancelToken, setCancelToken] = useState(null); // for axios cancel token
  const location = useLocation();
  const { isStore, setIsStore, setSellerDetails } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //!pagination obj set
  const [paginationObj, setPaginationObj] = useState({});
  const [pages, setPages] = useState(0);
  const handleNext = () => {
    //? Counter state is incremented
    setPages(paginationObj.offset + paginationObj.limit);
  };
  let height = window.screen.height;

  //? Function is called every time decrement button is clicked
  const handlePrevious = () => {
    //? Counter state is decremented
    setPages(paginationObj.offset - paginationObj.limit);
  };

  //! seller list State
  const [sellers, setSellers] = useState([]);

  //! Search query state and Handler
  const [queryValue, setQueryValue] = useState("");
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);

  //! InstallStatus state and Handler
  const [installStatus, setInstallStatus] = useState(null);
  const handleInstallStatus = useCallback(
    (value) => setInstallStatus(value),
    []
  );
  const handleInstallStatusRemove = useCallback(
    () => setInstallStatus(null),
    []
  );

  //! Plan filter state and handler
  const [filterByCTDPlan, setFilterByCTDPlan] = useState(null);
  const handleFilterByCTDPlan = useCallback(
    (value) => setFilterByCTDPlan(value),
    []
  );
  const handleFilterByCTDPlanRemove = useCallback(
    () => setFilterByCTDPlan(null),
    []
  );

  //! filter by shopify plan state and handler
  const [filterByShopifyPlan, setFilterByShopifyPlan] = useState(null);
  const handleFilterByShopifyPlan = useCallback(
    (value) => setFilterByShopifyPlan(value),
    []
  );
  const handleFilterByShopifyPlanRemove = useCallback(
    () => setFilterByShopifyPlan(null),
    []
  );

  //! filter theme install or not
  const [filterByTheme, setFilterByTheme] = useState();
  const handleFilterByTheme = useCallback((value) => setFilterByTheme(value));
  const handleFilterByThemeRemove = useCallback(
    () => setFilterByTheme(null),
    []
  );

  const handleFiltersClearAll = useCallback(() => {
    handleInstallStatusRemove();
    handleFilterByCTDPlanRemove();
    handleFilterByShopifyPlanRemove();
    handleQueryValueRemove();
    handleFilterByThemeRemove();
  }, [
    handleInstallStatusRemove,
    handleQueryValueRemove,
    handleFilterByCTDPlanRemove,
    handleFilterByShopifyPlanRemove,
    handleFilterByThemeRemove,
  ]);

  const filters = [
    {
      key: "installStatus",
      label: "By Event",
      filter: (
        <ChoiceList
          title="InstallStatus"
          titleHidden
          choices={[
            { label: "Installed", value: "true" },
            { label: "UnInstalled", value: "false" },
          ]}
          selected={installStatus || []}
          onChange={handleInstallStatus}
        />
      ),
      shortcut: true,
    },
    {
      key: "filterByCTDPlan",
      label: "By WD Plan",
      filter: (
        <ChoiceList
          title="By WD Plan"
          titleHidden
          choices={[
            { label: "Free", value: "1" },
            { label: "Powerhouse", value: "2" },
            { label: "Enterprise", value: "3" },
            { label: "Plus", value: "4" },
          ]}
          selected={filterByCTDPlan || []}
          onChange={handleFilterByCTDPlan}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "filterByShopifyPlan",
      label: "Shopify plan",
      filter: (
        <ChoiceList
          title="Shopify plan"
          titleHidden
          choices={[
            { label: "basic", value: "basic" },
            { label: "staff", value: "staff" },
            { label: "professional", value: "professional" },
            { label: "unlimited", value: "unlimited" },
            { label: "shopify_plus", value: "shopify_plus" },
            { label: "dormant", value: "dormant" },
            { label: "partner_test", value: "partner_test" },
          ]}
          selected={filterByShopifyPlan || []}
          onChange={handleFilterByShopifyPlan}
          allowMultiple
        />
      ),
    },
    {
      key: "themeInstall",
      label: "Theme install",
      filter: (
        <ChoiceList
          title="ThemeInstall"
          titleHidden
          choices={[
            { label: "Theme installed", value: "true" },
            { label: "Theme not install", value: "false" },
          ]}
          selected={filterByTheme || []}
          onChange={handleFilterByTheme}
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(installStatus)) {
    const key = "installStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, installStatus),
      onRemove: handleInstallStatusRemove,
    });
  }
  if (!isEmpty(filterByCTDPlan)) {
    const key = "filterByCTDPlan";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, filterByCTDPlan),
      onRemove: handleFilterByCTDPlanRemove,
    });
  }
  if (!isEmpty(filterByShopifyPlan)) {
    const key = "filterByShopifyPlan";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, filterByShopifyPlan),
      onRemove: handleFilterByShopifyPlanRemove,
    });
  }
  if (!isEmpty(filterByTheme)) {
    const key = "themeInstall";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, filterByTheme),
      onRemove: handleFilterByThemeRemove,
    });
  }

  //! get seller list API
  const getSellerList = () => {
    setIsLoading(true);

    // Cancel previous request if it exists
    if (cancelToken) {
      cancelToken.cancel("Operation canceled by user");
    }

    // Create a new CancelToken
    const newCancelToken = Axios.CancelToken.source();
    setCancelToken(newCancelToken);

    let option = {
      headers: {
        auth_token: localStorage.getItem("wd-token"),
      },
    };

    var data = {
      offset: pages,
      limit: 5,
      InstallStatus: installStatus,
      plan: filterByCTDPlan,
      planName: filterByShopifyPlan,
      searchValue: queryValue,
      themeInstallOrNot: filterByTheme,
    };
    Axios.post(config.APIURL + `/admin/sellerList`, data, {
      cancelToken: newCancelToken.token,
    })
      .then((item) => {
        if (item.data.status === "success") {
          let listInfo = item.data.sellerData;
          setSellers(listInfo.docs);
          setPaginationObj(listInfo);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => console.error(error));
  };

  React.useEffect(() => {
    getSellerList();
    if (location.pathname === "/ListingPage") {
      setIsStore(false);
    }
    return () => {
      if (cancelToken) {
        cancelToken.cancel("Operation canceled by cleanup");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pages,
    installStatus,
    filterByCTDPlan,
    filterByShopifyPlan,
    queryValue,
    filterByTheme,
  ]);

  const handelNavigateToDetailPage = (props) => {
    console.log(props);
    setSellerDetails(props);
    navigate("/DetailsPage", { state: props });
  };

  //!Data table row obj
  const rows = sellers.map((item, index) => {
    const currantTheme = item.ThemeSettings.find((obj) => {
      return obj.ThemeId === item.CurrentTheme;
    });
    return [
      <Text variant="bodySm" as="p">
        <DateAndTimeHook FullDate={item.installDate} />
      </Text>,
      <VerticalStack>
        <span
          style={{
            width: "250px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <a
            href={`https://${item.MyShopifyDomain}`}
            target={"_blank"}
            rel="noopener noreferrer external"
          >
            {item.MyShopifyDomain}
          </a>
        </span>
      </VerticalStack>,
      <>
        {item.InstallStatus ? (
          <Badge status="success">Installed</Badge>
        ) : (
          <Badge status="attention">Uninstalled</Badge>
        )}
      </>,
      <VerticalStack>
        {(() => {
          switch (item.plan) {
            case 1:
              return "Free";
            case 2:
              return "Powerhouse";
            case 3:
              return "Enterprise";
            case 4:
              return "Plus";
            default:
              return "No plan";
          }
        })()}
      </VerticalStack>,
      <VerticalStack>
        <span
          style={{
            width: "180px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {currantTheme?.ThemeName ?? "No Theme install"}
        </span>
      </VerticalStack>,
      <Button outline onClick={() => handelNavigateToDetailPage(item)}>
        View Details
      </Button>,
    ];
  });

  return (
    <React.Fragment>
      <Page fullWidth>
        <LegacyCard>
          <LegacyCard.Section>
            <Filters
              queryValue={queryValue}
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleFiltersClearAll}
              // onQueryBlur={handleQueryChange}
            />
          </LegacyCard.Section>
          {sellers.length !== 0 ? (
            <DataTable
              showTotalsInFooter
              columnContentTypes={[
                "text",
                "text",
                "text",
                "text",
                "text",
                "text",
              ]}
              headings={[
                // "no.",
                <Text fontWeight="bold">Date</Text>,
                <Text fontWeight="bold">Store</Text>,
                <Text fontWeight="bold">Event</Text>,
                <Text fontWeight="bold">WD Plan</Text>,
                <Text fontWeight="bold">Theme</Text>,
                <Text fontWeight="bold">Action</Text>,
              ]}
              rows={rows}
              totals={[
                "",
                "",
                "",
                "",
                "",
                <Text alignment="end">{paginationObj.totalDocs}</Text>,
              ]}
              totalsName={{
                singular: "Total sellers",
                plural: "Total sellers",
              }}
              footerContent={`Showing ${rows.length} of ${rows.length} results`}
            />
          ) : (
            <VerticalStack inlineAlign="center">
              <Spinner
                accessibilityLabel="Loading form field"
                hasFocusableParent={false}
              />{" "}
            </VerticalStack>
          )}
        </LegacyCard>
        <FooterHelp>
          <Pagination
            label={`-- ${paginationObj.page ?? ""} --`}
            hasPrevious={paginationObj.hasPrevPage}
            onPrevious={() => handlePrevious()}
            hasNext={paginationObj.hasNextPage}
            onNext={() => handleNext()}
          />
        </FooterHelp>
      </Page>
    </React.Fragment>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "filterByShopifyPlan":
        return `Tagged with ${value}`;
      case "installStatus":
        return value
          .map((val) => (val === "true" ? "Installed" : "Uninstalled"))
          .join(", ");
      case "filterByCTDPlan":
        return value
          .map((val) => {
            switch (val) {
              case "1":
                return "Free";
              case "2":
                return "Powerhouse";
              case "3":
                return "Enterprise";
              case "4":
                return "Plus";
              default:
                return "No plan";
            }
          })
          .join(", ");
      case "themeInstall":
        return value
          .map((val) =>
            val === "true"
              ? "Theme installed seller"
              : "Theme not install seller"
          )
          .join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

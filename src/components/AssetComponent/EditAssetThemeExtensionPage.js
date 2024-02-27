import {
  AlphaCard,
  VerticalStack,
  Badge,
  Button,
  Modal,
  Page,
  Text,
  Toast,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/theme/material.css";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config.json";
import Axios from "axios";
import Switch from "react-switch";
import { PageSkeleton } from "../globalComponent/SkeletonPage";
require("codemirror/mode/javascript/javascript");
require("codemirror/lib/codemirror.css");
require("./CSS/Asset.css");

const EditAssetThemeExtensionPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { fileEdit, content_type } = state;
  const [code, setCode] = React.useState(`const warning = "NO Code here`);
  const [isLoading, setIsLoading] = useState(false);
  const [AssetValue, setAssetValue] = useState(null);

  //success
  const [successTost, setSuccessTost] = useState(false);
  const [successTostContent, setSuccessTostContent] = useState("");
  const toggleSuccessActive = useCallback(
    () => setSuccessTost((successTost) => !successTost),
    []
  );
  const successToastMarkup = successTost ? (
    <Toast content={successTostContent} onDismiss={toggleSuccessActive} />
  ) : null;
  //error
  const [errorTost, setErrorTost] = useState(false);
  const toggleErrorTost = useCallback(
    () => setErrorTost((errorTost) => !errorTost),
    []
  );
  const [errorContent, setErrorContent] = useState("Saving error");
  const errorTostMarkup = errorTost ? (
    <Toast content={errorContent} error onDismiss={toggleErrorTost} />
  ) : null;

  //switch
  const [switchState, setSwitch] = useState(false);
  const handelSwitch = useCallback(
    () => setSwitch((switchState) => !switchState),
    []
  );
  // Modal
  const [activeModal, setActiveModal] = useState(false);
  const handleModal = useCallback(
    () => setActiveModal(!activeModal),
    [activeModal]
  );

  React.useEffect(() => {
    getFileAsset();
  }, []);
  
  const getFileAsset = () => {
    setIsLoading(true);
    let shopId = state.shopDetails.id.toString();
    let fileNameChange = state.fileEdit;
    let fileNamePath = state.filePath;
    let themeId = state.themeId.toString();
    Axios.get(
      `${config.CTD_MAIN_APIURL_live}/api/${fileNamePath}/${shopId}/${themeId}/${fileNameChange}`
    )
      .then((item) => {
        setCode(item.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const SaveAssetChanges = async () => {
    if (AssetValue !== null) {
      let shopId = state.shopDetails.id.toString();
      let fileNameChange = state.fileEdit;
      let themeID = state.themeId.toString();
      const data = {
        updateContent: AssetValue,
        fileUpdateName: `./SelleStoreFiles/${shopId}/${themeID}/${fileNameChange}`,
        folderIdCheck: shopId,
        ThemIdFoldercheck: themeID,
        fileUpdateNameStore: fileNameChange,
      };
      await Axios.post(
        `${config.CTD_MAIN_APIURL_live}/api/clinetStoreFilecode`,
        data
      )
        .then((item) => {
          if (item.data.status == "success") {
            setSuccessTostContent(item.data.message);
            setSuccessTost(true);
            setActiveModal(false);
          } else {
            toggleErrorTost();
            setErrorContent(item.data.message);
            setActiveModal(false);
          }
        })
        .catch((error) => {
          console.log(error);
          toggleErrorTost();
          setActiveModal(false);
          setErrorContent(error.message);
        });
    } else {
      toggleErrorTost();
      setErrorContent("You Didn't make any changes to save:");
    }
  };

  const handleEditCode = ({ editor, data, value }) => {
    setAssetValue(value);
  };

  const modalMarkup = (
    <Modal
      open={activeModal}
      onClose={handleModal}
      title="Confirmation"
      primaryAction={{
        content: "Yes",
        onAction: () => SaveAssetChanges(),
      }}
      secondaryActions={[
        {
          content: "No",
          onAction: handleModal,
        },
      ]}
    >
      <Modal.Section>
        <VerticalStack>
          <Text>Are you sure you want to Save Changes?</Text>
        </VerticalStack>
      </Modal.Section>
    </Modal>
  );
  return (
    <React.Fragment>
      {isLoading ? (
        <PageSkeleton />
      ) : (
        <Page
          breadcrumbs={[
            {
              content: "AssetThemeExtesntionFiles",
              onAction: () => {
                navigate("/AssetThemeExtesntionFiles");
              },
            },
          ]}
          fullWidth
          title={fileEdit}
          titleMetadata={<Badge status="success">{fileEdit}</Badge>}
          compactTitle
          primaryAction={
            <Button primary size="slim" onClick={() => handleModal()}>
              Save
            </Button>
          }
          secondaryActions={
            <Switch
              onChange={() => handelSwitch()}
              checked={switchState}
              uncheckedIcon={false}
              checkedIcon={false}
            />
          }
        >
          <AlphaCard>
            <CodeMirror
              value={code}
              options={{
                mode: `${content_type ?? "javascript"}`,
                lineNumbers: true,
                // lint: true,
                matchBrackets: true,
                theme: switchState ? "material" : "default",
              }}
              onChange={(editor, data, value) => {
                handleEditCode({ editor, data, value });
              }}
            />
          </AlphaCard>
        </Page>
      )}
      {successToastMarkup}
      {errorTostMarkup}
      {modalMarkup}
    </React.Fragment>
  );
};

export default EditAssetThemeExtensionPage;

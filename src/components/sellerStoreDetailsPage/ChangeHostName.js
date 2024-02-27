import React from 'react'
import { useState, useCallback } from 'react';
import { TextField, Text, Button, AlphaCard, FormLayout, Toast, VerticalStack } from "@shopify/polaris";
import config from '../../config.json'

const ChangeHostName = ({ MyShopifyDomain }) => {

  const [hostName, setHostName] = useState();
  const [btnLoader, setBtnLoader] = useState();
  //success Toast
  const [successTost, setSuccessTost] = useState(false);
  const [successTostContent, setSuccessTostContent] = useState("");
  const toggleSuccessActive = useCallback(() => setSuccessTost((successTost) => !successTost), []);
  const successToastMarkup = successTost ? <Toast content={successTostContent} onDismiss={toggleSuccessActive} /> : null;
  //error Toast
  const [errorTost, setErrorTost] = useState(false);
  const toggleErrorTost = useCallback(() => setErrorTost((errorTost) => !errorTost), []);
  const [errorContent, setErrorContent] = useState("Saving error")
  const errorTostMarkup = errorTost ? <Toast content={errorContent} error onDismiss={toggleErrorTost} /> : null;

  const handleNameChange = (e) => {
    setHostName(e);
  }

  const changeHostName = async () => {
    setBtnLoader(true);
    let data = {
      Shop: MyShopifyDomain,
      newHost: hostName,
    }
    await fetch(config.APIURL + `/Customer/HostChange`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      let result = await response.json();
      if (result.status == "success") {
        toggleSuccessActive();
        setSuccessTostContent(result.message);
        setBtnLoader(false);
        setHostName("");
      }
      else {
        setErrorContent(result.message);
        setBtnLoader(false);
        toggleErrorTost();
      }
    }).catch((err) => {
      setErrorContent("Something went wrong");
      toggleErrorTost();
      setBtnLoader(false);
      console.log(err);
    })
  }

  const IsAppEnable = async () => {
    let data = {
      Shop: MyShopifyDomain,
      IsAppEnable: true,
    }
    await fetch( config.APIURL + '/AppEnableDisableRoute/UpdateEnableDisable', {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      let result = await response.json();
      toggleSuccessActive();
      setSuccessTostContent(result.message);
    }).catch((err) => {
      setErrorContent("Something went wrong");
      toggleErrorTost();
      setBtnLoader(false);
    })
  }

  const tableSettingCss = async () => {
    let data = {
      "table": "table1",
      "thMinQty": "Minimum Quantity",
      "thBuyText": "Buy",
      "thDiscountText": "Discount",
      "thBgColor": "#FFFFFF",
      "tbBgcolor": "#FFFFFF",
      "thTextFontColor": "#000000",
      "tbTextFontColor": "#000000",
      "tOutlineColor": "#000000",
      "thFontSize": 14,
      "tbFontSize": 14,
      "thFontWeight": "normal",
      "thTextTransform": "initial",
      "tbFontWeight": "normal",
      "textAlign": "center",
      "checkoutType": "normal",
      "Shop": MyShopifyDomain
    }
    await fetch(config.APIURL +'/CssSettingsRoute/UpdateCssSettings', {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      let result = await response.json();
      toggleSuccessActive();
      setSuccessTostContent(result.message);
    }).catch((err) => {
      setErrorContent("Something went wrong");
      toggleErrorTost();
      setBtnLoader(false);
    })
  }

  const saveingMesssage = async () => {
    let data = {
      "NotificationStatus": true,
      "bodyTextColor": "#138C19",
      "textAlign": "center",
      "FontWeight": "bold",
      "textFontSize": 14,
      "messageStyleBox": "You saved {{discount_amount}}.",
      "Shop": MyShopifyDomain
    }
    await fetch(config.APIURL + '/FrontEndSettings/UpdateFrontEndSettings', {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      let result = await response.json();
      toggleSuccessActive();
      setSuccessTostContent(result.message);
    }).catch((err) => {
      setErrorContent("Something went wrong");
      toggleErrorTost();
      setBtnLoader(false);
    })
  }

  const quantity_Discount = async () => {
    let data = {
      "Shop": MyShopifyDomain
    }
    await fetch("https://wholesale.apptiv.in/ChangeStoreType/quantityDiscount", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      let result = await response.json();
      toggleSuccessActive();
      setSuccessTostContent(result.message);
    }).catch((err) => {
      setErrorContent("Something went wrong");
      toggleErrorTost();
      setBtnLoader(false);
    })
  }
  const subtotal_Discount = async () => {
    let data = {
      "Shop": MyShopifyDomain
    }
    await fetch("https://wholesale.apptiv.in/ChangeStoreType/subtotalDiscount", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      let result = await response.json();
      toggleSuccessActive();
      setSuccessTostContent(result.message);
    }).catch((err) => {
      setErrorContent("Something went wrong");
      toggleErrorTost();
      setBtnLoader(false);
    })
  }

  return (
    <div>
      <AlphaCard>
        <FormLayout.Group>
          <VerticalStack gap="3">
            <Text fontWeight="bold" alignment="center">Change Host Name</Text>
            <TextField value={hostName} onChange={(e) => { handleNameChange(e) }} placeholder='Please Fill Updated Host Name' type="email" autoComplete="email" />
            <Button size="large" loading={btnLoader} primary onClick={changeHostName}>
              Change Host Name
            </Button>
          </VerticalStack>
        </FormLayout.Group>
      </AlphaCard>
      <br />
      <AlphaCard>
        <FormLayout.Group>
          <VerticalStack gap="3">
            <Text fontWeight="bold" alignment="center">Click To APP Enable</Text>
            <Button size="large" primary onClick={IsAppEnable}>
              Click
            </Button>
          </VerticalStack>
        </FormLayout.Group>

        <FormLayout.Group>
          <VerticalStack gap="3">
            <Text fontWeight="bold" alignment="center">Click To Save Table Settings</Text>
            <Button size="large" primary onClick={tableSettingCss}>
              Table Settings
            </Button>
          </VerticalStack>
        </FormLayout.Group>

        <FormLayout.Group>
          <VerticalStack gap="3">
            <Text fontWeight="bold" alignment="center">Click To Save Saving Message</Text>
            <Button size="large" primary onClick={saveingMesssage}>
              Saving Message
            </Button>
          </VerticalStack>
        </FormLayout.Group>

        <FormLayout.Group>
          <VerticalStack gap="3">
            <Text fontWeight="bold" alignment="center">Click To Save Quantity Discount </Text>
            <Button size="large" primary onClick={quantity_Discount}>
            Quantity Discount
            </Button>
          </VerticalStack>
        </FormLayout.Group>

        <FormLayout.Group>
          <VerticalStack gap="3">
            <Text fontWeight="bold" alignment="center">Click To Save Subtotal Discount </Text>
            <Button size="large" primary onClick={subtotal_Discount}>
            Subtotal Discount
            </Button>
          </VerticalStack>
        </FormLayout.Group>

      </AlphaCard>

      {successToastMarkup}
      {errorTostMarkup}
    </div>
  )
}

export default ChangeHostName;
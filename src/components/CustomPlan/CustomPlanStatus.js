import React, { useState } from "react";
import axios from "axios";
import config from "../../config.json";
import {
  AlphaCard,
  TextField,
  VerticalStack,
  Button,
  Page,
  Card,
  Text,
  RadioButton,
} from "@shopify/polaris";

function CustomPlanStatus({ getAllCustomPlanSeller }) {
  const [errors, setErrors] = useState("");
  const [Email, setEmail] = useState("");
  const [status, setStatus] = useState(); // true for active, false for inactive

  const activeInactiveCheck = () => {
    setStatus(!status); // Toggle the status between true and false
  };
  const CustomFormSubmit = () => {
    if (!Email) {
      setErrors("Store URL is required");
    } else {
      const formDataSend = {
        storeUrl: Email,
        isCustomer: status,
      };
      axios
        .post(config.APIURL + "/customPlan/updateStatus", formDataSend)
        .then((response) => {
          getAllCustomPlanSeller();
          setEmail("")
          setStatus()
        })
        .catch((error) => {
          alert("Error:", error);
        });
    }
  };

  return (
    <>
      <Page>
        <Card sectioned>
          <AlphaCard>
            <VerticalStack gap="3">
              <Text variant="headingLg" as="h5">
                Sellar Custom Plan Status
              </Text>
              <TextField
                label="Email"
                type="email"
                placeholder="Please Enter  Email For Update Status"
                autoComplete="email"
                value={Email}
                onChange={(value) => {
                  setEmail(value);
                  setErrors();
                }}
                error={errors}
              />
              <RadioButton
                label="Active"
                id="active"
                name="accounts"
                checked={status === true}
                onChange={activeInactiveCheck}
              />
              <RadioButton
                label="Inactive"
                id="inactive"
                name="accounts"
                checked={status === false}
                onChange={activeInactiveCheck}
              />
              <Button size="large" primary onClick={CustomFormSubmit}>
                <Text>Status Update</Text>
              </Button>
            </VerticalStack>
          </AlphaCard>
        </Card>
      </Page>
    </>
  );
}

export default CustomPlanStatus;

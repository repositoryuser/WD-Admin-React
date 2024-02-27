import React, { useState ,useEffect} from 'react';
import axios from "axios";
import config from "../../config.json"
import { Page, FormLayout, TextField, Checkbox, ButtonGroup, Button, LegacyCard} from '@shopify/polaris';
import CustomDataTable from './CustomDataTable';
import CustomPlanStatus from './CustomPlanStatus';

function CustomPlan() {
  const [storeUrl, setStoreUrl] = useState('');
  const [planValue, setPlanValue] = useState('');
  const [planName, setPlanName] = useState('');
  const [PlanDiscription, setPlanDiscription] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDowngrad, setIsDowngrad] = useState(false);
  const [errors, setErrors] = useState({});
  const [AllSellarData, setAllSellarData] = useState([]);
  const [ApiResponse ,SetApiResponse] = useState(false)

  const validateForm = () => {
    const errors = {};
    if (!storeUrl) {
      errors.storeUrl = 'Store URL is required';
    }
    if (!planValue) {
      errors.planValue = 'Plan value is required';
    } else if (isNaN(planValue)) {
      errors.planValue = 'Plan value must be a number';
    }
    if (!planName) {
      errors.planName = 'Plan Name is required';
    }
    if (PlanDiscription === "" ) {
      errors.PlanDiscription = 'Plan Discription is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangeIsSubscribed = (checked) => {
    setIsSubscribed(checked);
  };
  const handleChangeIsDowngrad = (checked) => {
    setIsDowngrad(checked);
  };

  const CustomFormSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      const formData = {
        storeUrl,
        planValue,
        planName,
        isSubscribed,
        isDowngrad,
        PlanDiscription,
        isCustomer : true
      };
    try{
        axios.post(config.APIURL + "/customPlan/createPlan",formData )
        .then((response) => {
        console.log(response)
        getAllCustomPlanSeller();
        })
        .catch((error) => {
            alert('Error:', error);
        });
    }catch(err){
    console.log(err)
    }
      // Reset the form after successful submission
      CustomFormRest();
    }
  };

  const CustomFormRest = () => {
    setStoreUrl('');
    setPlanValue('');
    setPlanName('');
    setIsSubscribed(false);
    setIsDowngrad(false);
    setPlanDiscription("")
    setErrors({});
  };

  const getAllCustomPlanSeller = ()=>{
    try{
        axios.get(config.APIURL + "/customPlan/getAllCustomPlans")
        .then((response) => {
        console.log(response)
        setAllSellarData(response.data)
        SetApiResponse(true)
        })
        .catch((error) => {
            console.log('Error:', error);
        });
    }catch(err){
    console.log(err)
    }
  }

  useEffect(() => {
    getAllCustomPlanSeller();
  }, [ApiResponse]);

  return (
    <>
    <Page title="Custom Plan Form">
      <LegacyCard sectioned>
        <FormLayout>
          <TextField
            label="Store URL"
            type="email"
            placeholder='apptiv-wholesale.myshopify.com'
            value={storeUrl}
            onChange={(value) => {setStoreUrl(value); setErrors({}) }}
            error={errors.storeUrl}
          />
          <TextField
            type="number"
            label="Plan value"
            value={planValue}
            onChange={(value) => {setPlanValue(value); setErrors({}) } }
            error={errors.planValue}
          />
          <TextField
            label="Plan Name"
            placeholder='Enterprise'
            value={planName}
            onChange={(value) =>{ setPlanName(value);setErrors({}) }}
            error={errors.planName}
          />
          <Checkbox
            label="Is Plan Subscribed"
            checked={isSubscribed}
            onChange={handleChangeIsSubscribed}
          />
          <Checkbox
            label="Is Plan Down-Grad"
            checked={isDowngrad}
            onChange={handleChangeIsDowngrad}
          />
            <TextField
            label="Plan Discription"
            value={PlanDiscription}
            onChange={ (value) =>{ setPlanDiscription(value); setErrors({})}}
            multiline={4}
            error={errors.PlanDiscription}
            autoComplete="off"
            />
          <ButtonGroup>
            <Button primary onClick={CustomFormSubmit}>Submit</Button>
            <Button onClick={CustomFormRest}>Reset</Button>
          </ButtonGroup>
        </FormLayout>
      </LegacyCard>
    </Page>
    <CustomPlanStatus getAllCustomPlanSeller={getAllCustomPlanSeller}/>
   {ApiResponse ? <CustomDataTable  sellarDataCustomPlan={AllSellarData}/> : ""}
   </>
  );
}

export default CustomPlan;

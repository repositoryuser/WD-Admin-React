import {
    Page,
    LegacyCard,
    DataTable,
    useBreakpoints,
  } from '@shopify/polaris';
  
  function CustomDataTable(props) {
    let rows = [];

    if (Array.isArray(props.sellarDataCustomPlan.data)) {
        rows = props.sellarDataCustomPlan.data.map(item => {
            item.active = item.active.toString()
            item.__v = item.__v.toString()
            item.isSubscribed = item.isSubscribed.toString()
            item.isCustomer = item.isCustomer.toString()
            item.isDowngrade = item.isDowngrade.toString()
            const { _id, active,__v, ...rest } = item;
            return Object.values(rest);
          });
    }
    const {lgDown} = useBreakpoints();
    const fixedFirstColumns = lgDown ? 2 : 0;
  
    return (
      <div className='apptiv-div' style={{marginBottom : 20}}>
      <Page title="Sellar Data Custom Plan" >
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              'text',
              'numeric',
              'text',
              'text',
              'text',
              'text',
              'text',
            ]}
            headings={[
              'Store Domain',
              'Plan Value',
              'Plan Name',
              'Is-subscribed',
              'Is-downgrade',
              "Plan status",
              "Plan Discription"
            ]}
            rows={rows}
            defaultSortDirection="descending"
            initialSortColumnIndex={1}
            stickyHeader
            fixedFirstColumns={fixedFirstColumns}
          />
        </LegacyCard>
      </Page>
      </div>
    );
  }

  export default CustomDataTable;
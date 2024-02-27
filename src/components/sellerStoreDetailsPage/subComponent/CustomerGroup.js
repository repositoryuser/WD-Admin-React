/* eslint-disable no-undef */
import React, { useState } from "react";
import { VerticalStack, Avatar, Button, DataTable, EmptyState, Modal, ResourceItem, ResourceList, Text } from "@shopify/polaris";
import { EmptyStatePage } from "../../../Hooks/EmptyState";

const CustomerGroupObj = ({ CustomerGroup }) => {
    const [active, setActive] = React.useState(false);
    const [customers, setCustomers] = useState([]);
    const handleModalChange = ({ customerList }) => {
        setCustomers(customerList);
        setActive(true);
    };

    const rows = CustomerGroup?.map((item) => {
        return [
            <Text>{item.group_name}</Text>,
            <Text alignment="center">{item.group_name}</Text>,
            <VerticalStack>
                <Text alignment="center">{item.group_type == "Group" ? "Manual" : item.group_type}</Text>
            </VerticalStack>,
            <Button plain onClick={() => handleModalChange({ customerList: item.customerList })}>
                <Text>View Customer</Text>
            </Button>,
        ];
    });

    const modal_ = (
        <Modal open={active} onClose={() => setActive(false)} title="Costumer List">
            <Modal.Section>
                <ResourceList
                    resourceName={{ singular: "customer", plural: "customers" }}
                    items={customers}
                    emptyState={<EmptyState heading="No Customer available" image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png" />}
                    renderItem={(item, index) => {
                        const { displayName, email } = item;
                        return (
                            <ResourceItem id={index} media={<Avatar customer size="medium" name={displayName} />} accessibilityLabel={`View details for ${displayName}`} name={displayName}>
                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                    {displayName}
                                </Text>
                                <div>{email}</div>
                            </ResourceItem>
                        );
                    }}
                />
            </Modal.Section>
        </Modal>
    );
    return (
        <>
            {CustomerGroup && CustomerGroup.length != 0 ? (
                <DataTable
                    columnContentTypes={[
                        "text",
                        "text",
                        "text",
                        "numeric",
                        // 'numeric',
                    ]}
                    headings={[
                        <Text variant="bodyMd" fontWeight="bold">
                            Group Name
                        </Text>,
                        <Text variant="bodyMd" fontWeight="bold" alignment="center">
                            Group Tag
                        </Text>,
                        <Text variant="bodyMd" fontWeight="bold" alignment="center">
                            Group Type
                        </Text>,
                        <Text variant="bodyMd" fontWeight="bold">
                            Action
                        </Text>,
                        //   'Net sales',
                    ]}
                    rows={rows}
                />
            ) : (
                <EmptyStatePage heading={"No CustomerGroup available"} />
            )}
            {modal_}
        </>
    );
};

export default CustomerGroupObj;

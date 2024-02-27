import { Badge, Button, DataTable, Text, Modal } from "@shopify/polaris";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { EmptyStatePage } from "../../../Hooks/EmptyState";

const SubtotalTier = ({ SubtotalTiers }) => {
    const [isModalActive, setIsModalActive] = useState(false);
    const [tableData, setTableData] = useState({});
    const handleModalOpen = (item) => {
        setTableData(item);
        setIsModalActive((isModalActive) => !isModalActive);
    };
    const rows = SubtotalTiers?.map((item) => {
        return [
            <Text>{item.tier_name}</Text>,
            <Text>{item.acp_tag}</Text>,
            <Text>{item.group_type}</Text>,
            <Text>{item.group_name}</Text>,
            <Text>{item.tier_status ? <Badge status="success">Active</Badge> : <Badge status="warning">InActive</Badge>}</Text>,
            <Button plain onClick={() => handleModalOpen(item)}>
                <Text>Discount table</Text>
            </Button>
        ];
    });

    const _discountModalMarkup = (
        <Modal small open={isModalActive} onClose={() => setIsModalActive(false)} title={`Discount type "${tableData.discount_type}"`}>
            <Modal.Section>
                <TableContainer>
                    <Table style={{ border: "1px solid black", width: "100%" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ border: "1px solid black", textAlign: "center" }}>Minimum Quantity</TableCell>
                                <TableCell style={{ border: "1px solid black", textAlign: "center" }}>Discount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData?.tier_min?.map((min, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ border: "1px solid black", textAlign: "center" }}>{min}+</TableCell>
                                    {(() => {
                                        switch (tableData.discount_type) {
                                            case "percentage":
                                                return <TableCell style={{ border: "1px solid black", textAlign: "center" }}>{tableData?.tier_values[index]}%</TableCell>;
                                            case "fixed_price":
                                                return <TableCell style={{ border: "1px solid black", textAlign: "center" }}>{tableData?.tier_values[index]} OFF</TableCell>;
                                            case "fixed":
                                                return <TableCell style={{ border: "1px solid black", textAlign: "center" }}>{tableData?.tier_values[index]} OFF</TableCell>;
                                            default:
                                                return <TableCell style={{ border: "1px solid black", textAlign: "center" }}>{tableData?.tier_values[index]}</TableCell>;
                                        }
                                    })()}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal.Section>
        </Modal>
    );
    return (
        <React.Fragment>
            {SubtotalTiers && SubtotalTiers.length != 0 ? (
                <DataTable
                    columnContentTypes={["text", "text", "text", "numeric", "text", "text"]}
                    headings={[
                        <Text variant="bodyMd" fontWeight="bold">
                            Tier name
                        </Text>,
                        <Text variant="bodyMd" fontWeight="bold" alignment="center">
                            Acp Tag
                        </Text>,
                        <Text variant="bodyMd" fontWeight="bold" alignment="center">
                            Group Type
                        </Text>,
                        <Text>Group name</Text>,
                        <Text>Status</Text>,
                        <Text variant="bodyMd" fontWeight="bold">
                            Action
                        </Text>,
                    ]}
                    rows={rows}
                />
            ) : (
                <EmptyStatePage heading={"No CustomerGroup available"} />
            )}
            {_discountModalMarkup}
        </React.Fragment>
    );
};

export default SubtotalTier;

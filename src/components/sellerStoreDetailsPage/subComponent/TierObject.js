import { DataTable, Text, VerticalStack, Badge, Button, Modal } from "@shopify/polaris";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { EmptyStatePage } from "../../../Hooks/EmptyState";

const SpecificTier = ({ TierObject }) => {
    const [isModalActive, setIsModalActive] = useState(false);
    const [tableData, setTableData] = useState({});
    const handleModalOpen = (item) => {
        setTableData(item);
        setIsModalActive((isModalActive) => !isModalActive);
    };

    const rows = TierObject?.map((item) => {
        const date = new Date(item.created_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        return [
            <VerticalStack>
                <Text fontWeight="bold" variant="bodySm">
                    {item.entity_name}
                </Text>
            </VerticalStack>,
            <Text>{item.tier_name}</Text>,
            <Text alignment="center">Created on {item.entity_type}</Text>,
            <Text>{item.acp_tag}</Text>,
            <VerticalStack>
                <Text alignment="center">{item.tier_status ? <Badge status="success">Active</Badge> : <Badge status="success">InActive</Badge>}</Text>
            </VerticalStack>,
            <Text>From {date}</Text>,
            <Button plain onClick={() => handleModalOpen(item)}>
                <Text>Discount table</Text>
            </Button>,
        ];
    });

    const _discountModalMarkup = (
        <Modal
            small
            // activator={activator}
            open={isModalActive}
            onClose={() => setIsModalActive(false)}
            title={`Discount type "${tableData.discount_type}"`}
        >
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
            {TierObject && TierObject?.length != 0 ? (
                <DataTable
                    columnContentTypes={[
                        "text",
                        "text",
                        "text",
                        "numeric",
                        "text",
                        "text",
                        "text",
                    ]}
                    headings={["", "", "", "", "", "", "", ""]}
                    rows={rows}
                />
            ) : (
                <EmptyStatePage heading={"Tier not available"} />
            )}
            {_discountModalMarkup}
        </React.Fragment>
    );
};

export default SpecificTier;

import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
const DashboardCard = (props) => {
    const { Item, status, sx, value, title, hostTitle } = props;

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="h6">
                            {title}
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            {value}
                        </Typography>
                    </Stack>
                    <Avatar
                        sx={{
                            backgroundColor: status == "active" ? "success.main" : status == "InActive" ? "skyBlue" : status == "total" ? "gray" : null,
                            height: 56,
                            width: 56,
                        }}
                    >
                        <SvgIcon>
                            <UsersIcon />
                        </SvgIcon>
                    </Avatar>
                </Stack>
                    <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Stack alignItems="center" direction="row" spacing={0.5}>
                            <SvgIcon color={status === "active" ? "success" : status === "InActive" ? "error" : status === "total" ? "lightgrey" : null} fontSize="small">
                                <ArrowUpIcon />
                            </SvgIcon>
                            <Typography color={status === "active" ? "success.main" : status === "InActive" ? "error" : status === "total" ? "gray" : null} variant="body2">
                                {Item.today}
                            </Typography>
                        </Stack>
                        <Typography color={status === "active" ? "success.main" : status === "InActive" ? "error" : status === "total" ? "gray" : null} variant="caption">
                            {hostTitle}
                        </Typography>
                    </Stack>
             
            </CardContent>
        </Card>
    );
};

DashboardCard.prototypes = {
    difference: PropTypes.number,
    positive: PropTypes.bool,
    sx: PropTypes.object,
    value: PropTypes.string.isRequired,
};

export default DashboardCard;

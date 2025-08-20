import React from "react";
import { Colors } from "../../utils/Theme/Colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Adminicon from "../../Assets/icons/admin.png";
import notificationicon from "../../Assets/icons/notification.png";
import flnlogo from "../../Assets/fln.svg";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
  { id: "logout", title: "Logout", icon: LogoutIcon, path: "/logout" },
];

// Define a new color palette to match the dashboard theme
const headerPalette = {
  background: "#246a89",
  iconText: "#246a89", // Using the same dark color as the sidebar
  textPrimary: "#F0F2F5", // Lighter text color for contrast
};

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        display: "flex",
        backgroundColor: "#FFFFFF",
        padding: "9px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{
            color: headerPalette.iconText,
            fontWeight: "bold",
            marginLeft: "10px",
            marginTop: "6px",
          }}
        >
          <img src={flnlogo} alt="flnlogo" style={{ paddingTop: "1rem" }} />
        </Typography>
        <Typography sx={{ color: headerPalette.iconText }}></Typography>
      </Box>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", alignItems: "center", ml: "auto", gap: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ml: "auto",
            cursor: "pointer",
          }}
        >
          <div
            sx={{
              width: "26px",
              height: "26px",
              "&:hover": {
                transform: "translateY(-3px)",
              },
              color: headerPalette.iconText,
            }}
          />
          <img src={notificationicon} alt="adm" width={30} />
          <Typography sx={{ fontSize: "12px", color: headerPalette.iconText }}>
            Notifications
          </Typography>
        </Box>

        {/* with Notifications icons*/}
        {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              ml: "auto",
              position: "relative",
            }}
          >

            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <NotificationsIcon sx={{ width: "26px", height: "26px" }} />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  transform: "translate(50%, -50%)",
                  backgroundColor: "red",
                  color: "white",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                5
              </Box>
            </Box>
            <Typography sx={{ fontSize: "12px" }}>Notifications</Typography>
          </Box> */}

        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              ml: "auto",
              gap: "1",
              cursor: "pointer",
            }}
          >
            <div
              sx={{
                width: "26px",
                height: "26px",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
                color: headerPalette.iconText,
              }}
            />
            <img src={Adminicon} alt="adminicon" width={30} />
            <Typography
              sx={{
                fontSize: "12px",
                color: headerPalette.iconText,
                textTransform: "none",
              }}
            >
              Admin
            </Typography>
          </Box>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {menuItems?.map((item) => (
            <MenuItem
              sx={{ gap: "10px" }}
              onClick={() => {
                navigate(item?.path);
              }}
            >
              <item.icon /> {item.title}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Header;
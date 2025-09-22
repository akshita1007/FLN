import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import Adminicon from "../../Assets/icons/admin.png";
import notificationicon from "../../Assets/icons/notification.png";

// Define color palette
const headerPalette = {
  background: "#FFFFFF",
  iconText: "#003566",
  textPrimary: "#1a1a1a",
};

const Header = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleLogout = () => {
    setOpenDialog(false);
    navigate("/logout"); // redirect
  };

  return (
    <>
      {/* Main Header */}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: headerPalette.background,
          padding: "12px 20px",
          minHeight: "64px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Left Section - Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            sx={{
              color: headerPalette.iconText,
              fontWeight: "bold",
              fontSize: "18px",
              lineHeight: 1.2,
            }}
          >
            Foundation Literacy and Numeracy
          </Typography>
        </Box>

        {/* Right Section - Actions */}


        {/* Right Section - Actions */}
        {/* Right Section - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Notifications */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "rgba(0, 53, 102, 0.08)", // subtle background
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 53, 102, 0.16)",
              },
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 20, color: headerPalette.iconText }} />
          </Box>

          {/* Admin Button */}
          <Button
            onClick={() => setOpenDialog(true)}
            sx={{
              minWidth: "auto",
              p: 0,
              borderRadius: "50%",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 53, 102, 0.16)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 53, 102, 0.08)",
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 20, color: headerPalette.iconText }} />
            </Box>
          </Button>
        </Box>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "10px",
            minWidth: "350px",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)", // ✅ Blurry background
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "20px",
            color: headerPalette.iconText,
          }}
        >
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: "15px", color: "#555" }}>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "center", gap: 2, paddingBottom: "16px" }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              borderColor: headerPalette.iconText,
              color: headerPalette.iconText,
              "&:hover": {
                backgroundColor: "rgba(36,106,137,0.1)",
                borderColor: headerPalette.iconText,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              backgroundColor: "#e63946",
              "&:hover": {
                backgroundColor: "#d62828",
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;

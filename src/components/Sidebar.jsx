import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/system";
import Home from "../Assets/icons/home.png";
import Analysis from "../Assets/icons/analysis.png";
import List from "../Assets/icons/list.png";
import Logout from "../Assets/icons/logout.png";
import submission from "../Assets/icons/submission.png";
import visit from "../Assets/icons/visit.png";

// Formal color palette
const formalPalette = {
  background:"#00194d", //2C3E50  //"#1E293B"
  textPrimary: "#ECF0F1",
  textSecondary: "#BDC3C7",
  active: "#3498DB",
  hover: "#2f7fa1",
};

// Keyframe animations for a polished look
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components
const SidebarWrapper = styled("div")(({ isCollapsed }) => ({
  height: "100vh",
  display: "flex",
  transition: "width 0.3s ease",
  width: isCollapsed ? "60px" : "210px",
  boxSizing: "border-box",
}));

const StyledSidebar = styled(motion.div)(({ isCollapsed }) => ({
  height: "100vh",
  padding: "20px 0",
  background: formalPalette.background,
  display: "flex",
  flexDirection: "column",
  alignItems: isCollapsed ? "center" : "flex-start",
  width: "100%",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box",
}));

const StyledCollapseButton = styled("button")(({ isCollapsed }) => ({
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: formalPalette.textPrimary,
  display: "flex",
  alignItems: "center",
  justifyContent: isCollapsed ? "center" : "space-between",
  width: "100%",
  padding: "10px 15px",
  marginBottom: "20px",
  boxSizing: "border-box",
  "& h3": {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 600,
    color: formalPalette.textPrimary,
  },
  "&:hover": {
    opacity: 0.8,
  },
}));

const StyledSidebarItem = styled("div")(({ isActive, isCollapsed }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: isCollapsed ? "12px 0" : "12px 20px",
  
  cursor: "pointer",
  position: "relative",
  color: formalPalette.textSecondary,
  background: isActive ? formalPalette.hover : "transparent",
  boxSizing: "border-box",

  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "80%",
    width: "4px",
    background: isActive ? formalPalette.active : "transparent",
    borderRadius: "0 4px 4px 0",
    transition: "background 0.3s ease",
  },

  "& .icon-img": {
    width: "21px",
    height: "21px",
    filter: "invert(70%)",
    transition: "transform 0.3s ease, filter 0.3s ease",
    marginLeft: isCollapsed ? "15px" : "0", // ✅ Remove extra offset
  },

  "&:hover": {
    color: formalPalette.textPrimary,
    background: formalPalette.hover,
  },

  "&:hover .icon-img": {
    transform: "scale(1.1)",
    filter: "invert(100%)",
  },

  "&.active-state": {
    color: formalPalette.textPrimary,
    background: formalPalette.hover,
    "& .icon-img": {
      filter: "invert(100%)",
    },
  },
}));



const Title = styled(motion.span)(({ isCollapsed }) => ({
  marginLeft: "15px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  opacity: isCollapsed ? 0 : 1,
  transform: isCollapsed ? "translateX(-20px)" : "translateX(0)",
  transition: "opacity 0.3s ease, transform 0.3s ease",
  fontWeight: 500,
}));

const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    title: "Dashboard",
    image: Home,
    paths: ["/dashboard"],
  },
  {
    id: "analysis",
    title: "Analysis",
    image: Analysis,
    paths: ["/analysis"],
  },
  { id: "list", title: "CAC List", image: List, paths: ["/dashboard"] },
  {
    id: "submission",
    title: "Submission",
    image: submission,
    paths: ["/submission"],
  },
  {
    id: "visit",
    title: "School Visit",
    image: visit,
    paths: ["/dashboard"],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split("/")[1] || "dashboard"
  );

  const handleItemClick = (item) => {
    setActiveTab(item.id);
    navigate(item.paths[0]);
  };

  return (
    <SidebarWrapper isCollapsed={isCollapsed}>
      <StyledSidebar
        isCollapsed={isCollapsed}
        initial={{ width: "60px" }}
        animate={{ width: isCollapsed ? "60px" : "210px" }}
      >
        <StyledCollapseButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? (
            <MenuIcon sx={{ color: formalPalette.textPrimary, fontSize: 26 }} />
          ) : (
            <>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                FLN
              </motion.h3>
              <MenuOpenIcon
                sx={{ color: formalPalette.textPrimary, marginLeft: "auto" }}
              />
            </>
          )}
        </StyledCollapseButton>

        {SIDEBAR_ITEMS.map((item) => (
          <StyledSidebarItem
            key={item.id}
            isActive={activeTab === item.id}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick(item)}
            className={activeTab === item.id ? "active-state" : ""}
          >
            <img className="icon-img" src={item.image} alt={`${item.title} icon`} />
            <Title isCollapsed={isCollapsed}>
              {item.title}
            </Title>
          </StyledSidebarItem>
        ))}
      </StyledSidebar>
    </SidebarWrapper>
  );
}
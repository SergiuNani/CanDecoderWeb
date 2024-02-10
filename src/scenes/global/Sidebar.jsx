import { useState, useEffect, useContext } from "react";
import { Box, IconButton, Typography, useTheme, styled } from "@mui/material";
// import 'react-pro-sidebar/dist/css/styles.css'
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreateIcon from "@mui/icons-material/Create";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HelpIcon from "@mui/icons-material/Help";
import AdbIcon from "@mui/icons-material/Adb";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate } from "react-router-dom";
import { SidebarContext, ClearanceContext, AppContext } from "../../App";
import TableChartIcon from "@mui/icons-material/TableChart";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MenuIcon from "@mui/icons-material/Menu";
const Item = ({ title, to, icon, selected, setSelected, open }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        color: selected == title ? `${colors.green[400]}` : "inherit",
        zoom: "1.2",
        cursor: "pointer",
        padding: " 0.5rem 0",
        display: "flex",
        justifyContent: !open ? "center" : null,
        "&:hover": {
          background: `${colors.primary[300]}`,
        },
      }}
      onClick={() => {
        setSelected(title);
        navigate(to);
      }}
    >
      <div
        style={{
          marginLeft: open ? "1rem" : null,
          display: "flex",
          alignContent: "center",
          gap: "1rem",
        }}
      >
        <p>{icon}</p>
        {open ? <p>{title}</p> : null}
      </div>
    </Box>
  );
};
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  background: `#23272F`,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(10)} + 1px)`,
  background: `#23272F`,

  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  background: "blue",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export function MiniDrawer() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { sidebarSelectedItem, setSidebarSelectedItem } =
    useContext(SidebarContext);
  var { Clearance } = useContext(ClearanceContext);
  const { setShortcutTrigger_g } = useContext(AppContext);

  const navigate = useNavigate();
  useEffect(() => {
    //SHORTCUTS
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.altKey) {
        return; // Do nothing if both Ctrl and Alt keys are pressed
      }
      if (event.ctrlKey && event.key === "1") {
        setSidebarSelectedItem("Home");
        navigate("/Home");
      } else if (event.ctrlKey && event.key === "2") {
        setSidebarSelectedItem("Registers");
        navigate("/Registers");
      } else if (event.ctrlKey && event.key === "4" && Clearance > 1) {
        setSidebarSelectedItem("Decode LOG");
        navigate("/Decode_CAN_LOG");
      } else if (event.ctrlKey && event.key === "3") {
        setSidebarSelectedItem("Edit Data");
        navigate("/EditDataWindow");
      } else if (event.ctrlKey && event.key === "5" && Clearance > 11) {
        setSidebarSelectedItem("More Options");
        navigate("/MoreOptionsWindow");
      } else if (event.ctrlKey && event.key === "6") {
        setSidebarSelectedItem("Help");
        navigate("/Help");
      } else if (event.key === "F4" && Clearance > 33) {
        setSidebarSelectedItem("Debug");
        navigate("/DebugScene");
      } else if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setSidebarSelectedItem("Home");
        navigate("/Home");
        setShortcutTrigger_g((prev) => !prev);
        setTimeout(() => {
          document.querySelector("#HomeSearchBar").focus();
        }, 90);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [Clearance]);

  const handleDrawerOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        color: `${colors.primary[400]}`,
        zoom: "1.1",
        "& .MuiPaper-root": {
          border: "none",
        },
      }}
    >
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {open ? (
            <Box
              onClick={handleDrawerOpen}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zoom: "1.5",
                cursor: "pointer",
                fontWeight: "550",
              }}
            >
              <p>
                <span>CAN</span>{" "}
                <span style={{ color: `${colors.red[500]}` }}>DECODER</span>
              </p>
              <IconButton>
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              onClick={handleDrawerOpen}
              sx={{ zoom: "1.1", ml: "0.4rem" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>

        <Box paddingLeft={open ? undefined : "10%"}>
          <Item
            title="Home"
            to="/Home"
            icon={<HomeOutlinedIcon />}
            selected={sidebarSelectedItem}
            setSelected={setSidebarSelectedItem}
            open={open}
          />
          <Item
            title="Registers"
            to="/Registers"
            icon={<LibraryBooksIcon />}
            selected={sidebarSelectedItem}
            setSelected={setSidebarSelectedItem}
            open={open}
          />
          <Item
            title="Edit Data"
            to="/EditDataWindow"
            icon={<CreateIcon />}
            selected={sidebarSelectedItem}
            setSelected={setSidebarSelectedItem}
            open={open}
          />

          {Clearance > 1 ? (
            <section>
              <Item
                title="Decode LOG"
                to="/Decode_CAN_LOG"
                icon={<TableChartIcon />}
                selected={sidebarSelectedItem}
                setSelected={setSidebarSelectedItem}
                open={open}
              />
            </section>
          ) : null}
          {Clearance > 11 ? (
            <Item
              title="More Options"
              to="/MoreOptionsWindow"
              icon={<DragIndicatorIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
              open={open}
            />
          ) : null}
          <Item
            title="Help"
            to="/Help"
            icon={<HelpIcon />}
            selected={sidebarSelectedItem}
            setSelected={setSidebarSelectedItem}
            open={open}
          />
          {Clearance > 33 ? (
            <Item
              title="Debug"
              to="/DebugScene"
              icon={<AdbIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
              open={open}
            />
          ) : null}
          {Clearance > 33 ? (
            <Item
              title="DebugButton"
              // to="/DebugScene"
              icon={<HealthAndSafetyIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
              open={open}
            />
          ) : null}
        </Box>
      </Drawer>
    </Box>
  );
}

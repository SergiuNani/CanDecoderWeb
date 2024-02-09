import { useState, useEffect, useContext } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, styled } from "@mui/material";
import { Link } from "react-router-dom";
// import 'react-pro-sidebar/dist/css/styles.css'
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreateIcon from "@mui/icons-material/Create";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HelpIcon from "@mui/icons-material/Help";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AdbIcon from "@mui/icons-material/Adb";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate } from "react-router-dom";
import { SidebarContext, ClearanceContext, AppContext } from "../../App";
import TableChartIcon from "@mui/icons-material/TableChart";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import { handleDebugButton } from "../debug";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
          zoom: "1.2",
          margin: "0",
        }}
        onClick={() => {
          setSelected(title);

          if (title == "DebugButton") {
            handleDebugButton();
          }
        }}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
      <Link to={to} />
    </div>
  );
};

// function setSidebarSelectedItem() {}
// var sidebarSelectedItem = 'Home'
const SidebarComponent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        background: `${colors.primary[200]} !important`,

        "& .pro-sidebar-inner": {
          background: `${colors.primary[200]} !important`,
          border: `1px solid yellow`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          border: `1px solid yellow`,
        },
        "& .pro-inner-item": {
          padding: "0.5rem 1rem 0.2rem 1rem !important",
        },
        "& .ps-menu-button": {
          background: `${colors.primary[300]} !important`,
        },
        "& .ps-menu-button:hover": {
          color: `${colors.green[400]} `,
          background: `${colors.primary[300]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.green[400]} !important`,
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "0.5rem 0rem 0rem 0.4rem",
              // color: colors.grey[100]
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="1rem"
              >
                <Typography variant="h4">
                  CAN{" "}
                  <span
                    style={{
                      color: colors.red[400],
                    }}
                  >
                    DECODER
                  </span>
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/Home"
              icon={<HomeOutlinedIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
            />

            <Typography
              variant="h6"
              color={colors.grey[200]}
              sx={{ m: "0 0 0.1rem 1.1rem" }}
            >
              Tools
            </Typography>
            <Item
              title="Registers"
              to="/Registers"
              icon={<LibraryBooksIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
            />
            <Item
              title="Edit Data"
              to="/EditDataWindow"
              icon={<CreateIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
            />

            {Clearance > 1 ? (
              <section>
                <Typography
                  variant="h6"
                  color={colors.grey[200]}
                  sx={{ m: "0 0 0.1rem 1.1rem" }}
                >
                  Decode
                </Typography>
                <Item
                  title="Decode LOG"
                  to="/Decode_CAN_LOG"
                  icon={<TableChartIcon />}
                  selected={sidebarSelectedItem}
                  setSelected={setSidebarSelectedItem}
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
              />
            ) : null}

            <Typography
              variant="h6"
              color={colors.grey[200]}
              sx={{ m: "0 0 0.1rem 1.1rem" }}
            >
              More
            </Typography>
            <Item
              title="Help"
              to="/Help"
              icon={<HelpIcon />}
              selected={sidebarSelectedItem}
              setSelected={setSidebarSelectedItem}
            />
            {Clearance > 33 ? (
              <Item
                title="Debug"
                to="/DebugScene"
                icon={<AdbIcon />}
                selected={sidebarSelectedItem}
                setSelected={setSidebarSelectedItem}
              />
            ) : null}
            {Clearance > 33 ? (
              <Item
                title="DebugButton"
                // to="/DebugScene"
                icon={<HealthAndSafetyIcon />}
                selected={sidebarSelectedItem}
                setSelected={setSidebarSelectedItem}
              />
            ) : null}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarComponent;

import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
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
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        open={open}
        sx={{
          border: `1px solid yellow`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

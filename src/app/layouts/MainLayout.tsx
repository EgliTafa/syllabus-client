import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ThemeToggle } from "../components";
import { SyllabusHistory } from "../../features/syllabus/components/SyllabusHistory";

export const MainLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { handleLogout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleTitleClick = () => {
    if (isAuthenticated) {
      navigate("/syllabus");
    } else {
      navigate("/login");
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
    >
      <Box sx={{ width: 250 }}>
        <List>
          {isAuthenticated ? (
            <>
              <ListItem component={RouterLink} to="/syllabus" onClick={handleMobileMenuToggle}>
                <ListItemText primary="Syllabuses" />
              </ListItem>
              {isAdmin() && (
                <ListItem component={RouterLink} to="/admin/roles" onClick={handleMobileMenuToggle}>
                  <ListItemText primary="Admin Role Assignment" />
                </ListItem>
              )}
              <ListItem component={RouterLink} to="/courses" onClick={handleMobileMenuToggle}>
                <ListItemText primary="Courses" />
              </ListItem>
              <Divider />
              <ListItem component={RouterLink} to="/profile" onClick={handleMobileMenuToggle}>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem onClick={handleLogoutClick}>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem component={RouterLink} to="/login" onClick={handleMobileMenuToggle}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem component={RouterLink} to="/register" onClick={handleMobileMenuToggle}>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={handleTitleClick}
          >
            Syllabus Management
          </Typography>
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button color="inherit" component={RouterLink} to="/syllabus">
                    Syllabuses
                  </Button>
                  <SyllabusHistory />
                  {isAdmin() && (
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/admin/roles"
                    >
                      Admin Role Assignment
                    </Button>
                  )}
                  <Button color="inherit" component={RouterLink} to="/courses">
                    Courses
                  </Button>
                </>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <ThemeToggle />
              {isMobile ? (
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuToggle}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
              )}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {!isMobile && (
                <>
                  <Button color="inherit" component={RouterLink} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/register">
                    Register
                  </Button>
                </>
              )}
              {isMobile && (
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuToggle}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu()}

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

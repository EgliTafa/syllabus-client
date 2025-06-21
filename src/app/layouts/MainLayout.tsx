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
import { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useTokenValidation } from "../../features/auth/hooks/useTokenValidation";
import { ThemeToggle } from "../components";
import { useGetAllSyllabuses } from "../../features/syllabus/hooks/useSyllabuses";
import { useDispatch } from "react-redux";
import { SyllabusHistoryDropdown } from "../../features/syllabus/components/SyllabusHistoryDropdown";
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../../components/LanguageToggle';
import { EmailConfirmationReminder } from '../../components/EmailConfirmationReminder';

export const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { handleLogout, isAdmin } = useAuth();
  const { checkTokenValidity } = useTokenValidation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { syllabusList, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      // Check token validity before fetching data
      if (checkTokenValidity()) {
      fetchAndUpdateSyllabuses(dispatch);
      }
    }
  }, [isAuthenticated, fetchAndUpdateSyllabuses, dispatch, checkTokenValidity]);

  // Get unique academic years and sort them in ascending order
  const academicYears = Array.from(new Set(syllabusList.map((s) => s.academicYear)))
    .sort((a, b) => {
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearA - yearB;
    });

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
                <ListItemText primary={t('nav.syllabuses')} />
              </ListItem>
              <ListItem>
                <ListItemText primary={t('nav.syllabusHistory')} primaryTypographyProps={{ fontWeight: 'bold' }} />
              </ListItem>
              {academicYears.map((year) => (
                <ListItem
                  key={year}
                  component={RouterLink}
                  to={`/syllabus/history/${year}`}
                  onClick={handleMobileMenuToggle}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary={year} />
                </ListItem>
              ))}
              {isAdmin() && (
                <ListItem component={RouterLink} to="/admin" onClick={handleMobileMenuToggle}>
                  <ListItemText primary={t('nav.adminManagement')} />
                </ListItem>
              )}
              <ListItem component={RouterLink} to="/courses" onClick={handleMobileMenuToggle}>
                <ListItemText primary={t('nav.courses')} />
              </ListItem>
              <Divider />
              {isAdmin() && (
                <ListItem component={RouterLink} to="/ping" onClick={handleMobileMenuToggle}>
                  <ListItemText primary={t('nav.apiHealthCheck')} />
                </ListItem>
              )}
              <ListItem component={RouterLink} to="/profile" onClick={handleMobileMenuToggle}>
                <ListItemText primary={t('nav.profile')} />
              </ListItem>
              <ListItem onClick={handleLogoutClick}>
                <ListItemText primary={t('nav.logout')} />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem component={RouterLink} to="/login" onClick={handleMobileMenuToggle}>
                <ListItemText primary={t('nav.login')} />
              </ListItem>
              <ListItem component={RouterLink} to="/register" onClick={handleMobileMenuToggle}>
                <ListItemText primary={t('nav.register')} />
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
            {t('nav.management')}
          </Typography>
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button color="inherit" component={RouterLink} to="/syllabus">
                    {t('nav.syllabuses')}
                  </Button>
                  <SyllabusHistoryDropdown />
                  {isAdmin() && (
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/admin"
                    >
                      {t('nav.adminManagement')}
                    </Button>
                  )}
                  <Button color="inherit" component={RouterLink} to="/courses">
                    {t('nav.courses')}
                  </Button>
                  {isAdmin() && (
                    <Button color="inherit" component={RouterLink} to="/ping">
                      {t('nav.apiHealthCheck')}
                    </Button>
                  )}
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
                  vertical: "top",
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
                <Box display="flex" justifyContent="center" alignItems="center" py={1}>
                  <LanguageToggle />
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                  {t('nav.profile')}
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>{t('nav.logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {!isMobile && (
                <>
                  <Button color="inherit" component={RouterLink} to="/login">
                    {t('nav.login')}
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/register">
                    {t('nav.register')}
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
      <EmailConfirmationReminder />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

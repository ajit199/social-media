
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import "./topbar.css";
import { Person, Notifications, Chat, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Topbar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let { dispatch } = useContext(AuthContext);
    // const handleOpenNavMenu = (event) => {
    //     setAnchorElNav(event.currentTarget);
    // }; 
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // const handleCloseNavMenu = () => {
    //     setAnchorElNav(null);
    // };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // function handleLogout(){

    // }

    let publicUrl = process.env.REACT_APP_PUBLIC_FOLDER;
    let { user } = useContext(AuthContext);
    let navigate = useNavigate();
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">social app</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input placeholder="Search for friends, posts, and videos" className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="topbarLink" >Homepage</div>
                    </Link>
                    <div className="topbarLink">Timeline</div>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem" onClick={() => navigate("/messanger", { replace: false })}>
                        <Chat />
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">5</span>
                    </div>
                </div>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar src={user.profilePicture ? publicUrl + user.profilePicture : publicUrl + "person/no-avatar.png"} alt="profilepic" className="topbarImg" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {/* {settings.map((setting) => ( */}
                        <MenuItem onClick={() => {
                            handleCloseUserMenu()
                        }}>
                            <Link to={`/profile/${user.username}`} style={{ color: "inherit", textDecoration: "none" }}>
                                <Typography textAlign="center">Profile</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleCloseUserMenu()
                            // handleLogout()
                            localStorage.clear();
                            dispatch({ type: "LOGOUT" })
                            navigate("/login", { replace: true });
                        }}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </div>
        </div>
    )
}

export default Topbar;
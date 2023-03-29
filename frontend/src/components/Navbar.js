import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import '../hide.css';
import AuthContext from '../store/AuthContext';
import axios from 'axios';
axios.defaults.withCredentials = true;
const Navbar = () => {
    const navigate = useNavigate();
    const authCTX = useContext(AuthContext);
    const isLoggedIn = authCTX.isLoggedIn;
    const logoutUser = authCTX.logoutUser;
    const [name, setName] = useState('');
    const [userId, setUserid] = useState('');
    const [email, setEmail] = useState('');

    const onLogout = async (e) => {
        await axios.get('http://localhost:8000/api/logout').then(response => {
            if (response.status === 201) {
                setUserid('');
                logoutUser();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                toast.success('User is Logged out successfully!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else {
                toast.error(response.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch(error => {
            toast.error(error.message, {
                position: "bottom-right",
                hideProgressBar: false,
                progress: undefined,
            });
        });

    }
    useEffect(() => {
        const user = localStorage.getItem('user');
        const user_detail = JSON.parse(user);
        if (user_detail) {
            setUserid(user_detail._id);
            setEmail(user_detail.email);
        }
    }, [isLoggedIn]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant='h5' component="div" sx={{ flexGrow: 1 }}>MLM with React JS</Typography>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography component="div" sx={{ flexGrow: 1 }} className={`${!userId ? "mystyle" : ""}`} >Welcome {email}</Typography>
                    <NavLink style={{ color: 'white' }} color="inherit" to="/join" className={`${!userId ? "mystyle" : ""}`} >Join</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} to="/tree/:id" className={`${!userId ? "mystyle" : ""}`} >Tree</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} onClick={(e) => onLogout(e)} className={`${!userId ? "mystyle" : ""}`} >Logout</NavLink>
                    <NavLink style={{ color: 'white' }} to="/login" className={`${userId ? "mystyle" : ""}`} >Login</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} to="/register" className={`${userId ? "mystyle" : ""}`}>Sign Up</NavLink>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar;

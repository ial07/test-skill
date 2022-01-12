import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login'
import { LockOutlined } from '@material-ui/icons'
import Input from './Input';
import useStyles from './styles'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signin, signup } from '../../actions/auth';

const initialState = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const Auth = () => {
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(formData, navigate))
        } else {
            dispatch(signin(formData, navigate))

        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const googleSucces = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: 'AUTH', data: { result, token } })
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const googleFailure = (err) => {
        console.log(err)
    }


    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        handleShowPassword(false)
    }


    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Register' : 'Login'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstname" label="First Name" handleChange={handleChange} autofocus half />

                                    <Input name="lastname" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {

                            isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} />
                        }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>{isSignup ? 'Register' : 'Login'}</Button>
                </form>
                <Grid >
                    <Button onClick={switchMode}>
                        {isSignup ? 'Already have an account? Please Login' : "Don't have account? Register here!"}
                    </Button>
                </Grid>
            </Paper>
            <Grid className={classes.googleForm}>
                <Typography direction="column" justify='center'>OR</Typography>
            </Grid>
            <Grid className={classes.googleForm}>
                <GoogleLogin
                    color="inherit"
                    clientId="1080029274310-6dvi1fj8eqgh6ho39961m4lvbqbugj1o.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={googleSucces}
                    onFailure={googleFailure}
                    cookiePolicy={'single_host_origin'}
                />


            </Grid>
        </Container >
    )
}

export default Auth

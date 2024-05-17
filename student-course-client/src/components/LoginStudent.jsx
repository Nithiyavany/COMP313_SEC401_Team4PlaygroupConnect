//Login.js
import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import "./entryform.css"
//
import CoursesHome from './CoursesHome'
//
// mutation for student login
const LOGIN_STUDENT = gql`
    mutation LoginStudent( $email: String!, $password: String! ) {
        loginStudent( email: $email, password: $password  )         

    }
`;
// query for checking if student is logged in
const LOGGED_IN_STUDENT = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`;
// Login function component
function Login() {
    //
    let navigate = useNavigate()
    // loginStudent is a function that can be called to execute
    // the LOGIN_STUDENT mutation, and { data, loading, error } 
    // is an object that contains information about the state of the mutation.
    const [loginStudent, { data, loading, error }] = useMutation(LOGIN_STUDENT);
    //
    //state variable for the screen, admin or student
    const [screen, setScreen] = useState(false);
    //store input field data, student name and password
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    //
   
    const handleLogin = async (event) => {
        event.preventDefault();
        console.log('email and password: ', email + ' ' + password);

        try {
          const { data } = await loginStudent({
            variables: { email, password }
            
          });
          //refetchQueries: [{ query: LOGGED_IN_STUDENT }],
          console.log('data from server: ', data)
          console.log('Logged in as:', data.loginStudent);
          setScreen(data.loginStudent);
          setEmail('');
          setPassword('');
          console.log('screen: ', screen)
        } catch (error) {
          console.error('Login error:', error);
        }
    };
    // a destructuring assignment that uses the useQuery hook from
    //  the @apollo/client library to fetch data from a GraphQL server.
    const { data: isLoggedInData, loading: isLoggedInLoading, error: isLoggedInError, refetch: refetchLoggedInData } = useQuery(LOGGED_IN_STUDENT);
    //
    // useEffect block
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                console.log('--- in checkLoginStatus function ---');
                await refetchLoggedInData(); // Trigger manual refetch
                const isLoggedInVar = isLoggedInData?.isLoggedIn;
                console.log('auth status from graphql server: ', isLoggedInVar);
                if (isLoggedInVar !== undefined && isLoggedInVar !== screen) {
                    console.log('stduent is logged in');
                    console.log('screen: ', screen);
                    console.log('isLoggedInVar in useEffect: ', isLoggedInVar);
                    // update the screen state variable only if it's different
                    setScreen(isLoggedInVar);
                }
            } catch (e) {
                setScreen(false);
                console.log('error: ', e);
            }
        };

        // Run the checkLoginStatus function once when the component mounts
        checkLoginStatus();
    }, [isLoggedInData, refetchLoggedInData, screen]); // Include refetchLoggedInData in the dependency array

    // Check if student is logged in
  if (isLoggedInData?.isLoggedIn === true) {
      console.log('stduent is logged in');
      console.log('screen: ', screen);
  }

    // Render the login form or the welcome message based on the value of 'screen'
    return (
        <div className="entryform">
            { screen !==false ? (
                <CoursesHome screen={screen} setScreen={setScreen} /> ) : (

                <Form onSubmit={handleLogin}>
                    
                    <Form.Group>
                        <Form.Label> Email:</Form.Label>
                        <Form.Control id="email" type="email"  onChange={(event) => setEmail(event.target.value)} 
                            placeholder="Email:" />
                    </Form.Group>                    
                    
                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control id="password" type="password"  onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password:" />
                    </Form.Group>  
            
                    <Button size = "lg" variant="primary" type="submit" >
                        Login
                    </Button>
                  
                </Form>
            )}            
            
        </div>
    );
}
//
export default Login;
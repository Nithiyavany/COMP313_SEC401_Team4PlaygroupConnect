// AddStudent component
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
//
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
//
// AddStudent mutation
const ADD_STUDENT = gql`
  mutation AddStudent($studentNumber: String!, $password: String! $firstName: String!,
    $lastName: String!,$address: String!,$city: String!, $phoneNumber: String!, $email: String!, $program: String!) {
    createStudent(studentNumber: $studentNumber, password: $password, firstName: $firstName, 
        lastName: $lastName, address: $address, city: $city, phoneNumber: $phoneNumber, email: $email,program: $program ) {
      studentNumber
    }
  }
`;
// AddStudent component
const AddStudent = () => {
  let navigate = useNavigate()
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  // AddStudent mutation
  const [addStudent] = useMutation(ADD_STUDENT);
  //
  const saveStudent = (e) => {
    setShowLoading(true);
    e.preventDefault();
    // Add student
    addStudent({ variables: { studentNumber, password, firstName, lastName, address, city, 
        phoneNumber, email,program } });
    // Clear input fields
    setStudentNumber('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setAddress('');
    setCity('');
    setPhoneNumber('');
    setEmail('');
    setProgram('');
    setShowLoading(false);
    navigate('/studentlist')  // navigate to student list page
  };
  //

  // AddStudent component UI
  return (
    <div>
    {showLoading && 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> 
      } 
      <h2>Create a new account</h2>
      <Form onSubmit={saveStudent}>
        <Form.Group>
            <Form.Label> Register Number</Form.Label>
            <Form.Control type="text" name="studentNumber" id="studentNumber" placeholder="Enter register number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
        </Form.Group>
      
        <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" id="firstName" rows="3" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" id="lastName" rows="3" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" id="address" rows="3" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name="city" id="city" rows="3" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phoneNumber" id="phoneNumber" rows="3" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" id="email" rows="3" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </Form.Group>

        <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="program" id="program" rows="3" placeholder="Enter category" value={program} onChange={(e) => setProgram(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" type="submit">
            Sign Up
        </Button>

      </Form>
    </div>

  );
};
//
export default AddStudent;

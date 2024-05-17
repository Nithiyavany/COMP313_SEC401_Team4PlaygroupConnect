import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//
const GET_STUDENT = gql`
  query GetStudent($id: String!) {
    student(id: $id) {
      studentNumber
      firstName
      lastName
      address
      city
      phoneNumber
      email
      program
    }
  }
`;
//
const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: String!
    $studentNumber: String!
    $firstName: String!
    $lastName: String!
    $address: String!
    $city: String!
    $phoneNumber: String!
    $email: String!
    $program: String!
  ) {
    updateStudent(
      id: $id
      studentNumber: $studentNumber
      firstName: $firstName
      lastName: $lastName
      address: $address
      city: $city
      phoneNumber: $phoneNumber
      email: $email
      program: $program
    ) {
      id
      studentNumber
      firstName
      lastName
      address
      city
      phoneNumber
      email
      program
    }
  }
`;

//
function EditStudent(props) {
  const [student, setStudent] = useState({
    id: "",
    studentNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "",
  });
  let navigate = useNavigate();
  const { id } = useParams(); // Get the id parameter from the URL
  console.log("in EditStudent, id=", id);
  //
  const { loading, error, data } = useQuery(GET_STUDENT, {
    variables: { id },
    onCompleted: (data) => {
      const {
        studentNumber: currentStudentNumber,
        firstName: currentFirstName,
        lastName: currentLastName,
        address: currentAddress,
        city: currentCity,
        phoneNumber: currentPhoneNumber,
        email: currentEmail,
        program: currentProgram,
      } = data.student;
      //
      setStudent({
        id,
        studentNumber: currentStudentNumber,
        firstName: currentFirstName,
        lastName: currentLastName,
        address: currentAddress,
        city: currentCity,
        phoneNumber: currentPhoneNumber,
        email: currentEmail,
        program: currentProgram,
      });
    },
  });
  // print error
  if (error) {
    console.log("error=", error);
  }
  //print data
  if (data) {
    console.log("data=", data);
  }

  //
  const [updateStudent] = useMutation(UPDATE_STUDENT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  //
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("in handleSubmit, student=", student);

    try {
      console.log("Before updateStudent call");
      await updateStudent({
        variables: { id, ...student },
      });
      console.log("After updateStudent call", student);
      navigate("/studentlist");
    } catch (error) {
      console.error("Error updating student:", error);
      // Handle the error as needed (e.g., show an error message to the student)
    }
  };

  //
  //
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  //
  return (
    <div>
      <h1>Edit User</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formStudentNumber">
          <Form.Label>Register Number</Form.Label>
          <Form.Control
            type="text"
            name="studentNumber"
            placeholder="Enter register number"
            value={student.studentNumber || data.student.studentNumber}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={student.firstName || data.student.firstName}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            placeholder="Enter last Name"
            value={student.lastName || data.student.lastName}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            placeholder="Enter address"
            value={student.address || data.student.address}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            placeholder="Enter city"
            value={student.city || data.student.city}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formPhoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={student.phoneNumber || data.student.phoneNumber}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            placeholder="Enter email"
            value={student.email || data.student.email}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formProgram">
          <Form.Label>Program</Form.Label>
          <Form.Control
            type="text"
            name="program"
            placeholder="Enter program"
            value={student.program || data.student.program}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default EditStudent;

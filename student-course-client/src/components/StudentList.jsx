import React from "react";
import { gql, useQuery } from "@apollo/client";
//import ListGroup from 'react-bootstrap/ListGroup';
import Table from "react-bootstrap/Table";
//import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
//
// To parse the GraphQL operations, we use a special function
// called a tagged template literal to allow us to express them
// as JavaScript strings. This function is named gql
//
// note the backquotes here
const GET_STUDENTS = gql`
  {
    students {
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
const StudentList = () => {
  const { loading, error, data, refetch } = useQuery(GET_STUDENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <Table>
        <tbody>
          <tr>
            <th>registerNumber</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>address</th>
            <th>city</th>
            <th>phoneNumber</th>
            <th>email</th>
            <th>activity</th>
          </tr>
          {data.students.map((student, index) => (
            <tr key={index}>
              <td>{student.studentNumber}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.address}</td>
              <td>{student.city}</td>
              <td>{student.phoneNumber}</td>
              <td>{student.email}</td>
              <td>{student.program}</td>

              <td>
                <Link to={`/editstudent/${student.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="center">
        <button className="center" onClick={() => refetch()}>
          Refetch
        </button>
      </div>
    </div>
  );
};

export default StudentList;

import React from "react";
import { gql, useQuery } from "@apollo/client";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const GET_FAVOURITES = gql`
  query GetFavourites {
    favourites {
      id
      courseName
      section
      semester
      courseCodeId
    }
  }
`;

const StudentList = () => {
  const { loading, error, data, refetch } = useQuery(GET_FAVOURITES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error}</p>;

  return (
    <div>
      <h2>Your favourite activities</h2>
      <Table>
        <tbody>
          <tr>
            <th>Course name</th>
            <th>Semester</th>
            <th>Section</th>
          </tr>
          {data.favourites.map((favourite, index) => (
            <tr key={index}>
              <td>{favourite.courseName}</td>
              <td>{favourite.semester}</td>
              <td>{favourite.section}</td>
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

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import EditCourse from "./EditCourse";

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      courseName
      section
      semester
    }
  }
`;

const ListCourses = () => {
  const { loading, error, data, refetch } = useQuery(GET_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRowClick = (courseCodeId) => {
    setSelectedCourse(courseCodeId);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const sortedCourses = [...data.courses];
    if (sortConfig.key !== null) {
      sortedCourses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedCourses;
  };

  return (
    <div>
      <h2>List of Activities</h2>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th
              className="text-primary"
              onClick={() => requestSort("courseName")}
            >
              Activity Description
            </th>
            <th className="text-primary" onClick={() => requestSort("section")}>
              Category
            </th>
            <th
              className="text-primary"
              onClick={() => requestSort("semester")}
            >
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData().map((course, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(course.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{course.courseName}</td>
              <td>{course.section}</td>
              <td>{course.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCourse && (
        <div>
          <h2>Edit Activity</h2>
          <EditCourse
            courseCodeId={selectedCourse}
            existingCourseName={
              data.courses.find((course) => course.id === selectedCourse)
                .courseName
            }
            existingSection={
              data.courses.find((course) => course.id === selectedCourse)
                .section
            }
            existingSemester={
              data.courses.find((course) => course.id === selectedCourse)
                .semester
            }
            onClose={() => setSelectedCourse(null)}
          />
        </div>
      )}

      <button className="btn btn-dark mt-2" onClick={() => refetch()}>
        Refetch
      </button>
    </div>
  );
};

export default ListCourses;

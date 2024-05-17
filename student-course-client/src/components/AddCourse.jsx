import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Form, Button } from "react-bootstrap"; // Import React Bootstrap components

// AddCourse mutation
const ADD_COURSE = gql`
  mutation AddCourse(
    $courseName: String!
    $section: String!
    $semester: String!
  ) {
    addCourse(courseName: $courseName, section: $section, semester: $semester) {
      courseName
    }
  }
`;

// AddCourse component
const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const navigate = useNavigate();
  const [addCourse] = useMutation(ADD_COURSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCourse({
        variables: { courseName, section, semester },
      });
      // Clear input fields
      setCourseName("");
      setSection("");
      setSemester("");
      navigate("/listcourses");
    } catch (err) {
      console.error("Error creating course:", err);
      // Handle the error, e.g., show an error message to the student.
    }
  };

  // AddCourse component UI with React Bootstrap components
  return (
    <div>
      <h2>Create Activity</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCourseName">
          <Form.Label>Activity Description:</Form.Label>
          <Form.Control
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formSection">
          <Form.Label>Category:</Form.Label>
          <Form.Control
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formSemester">
          <Form.Label>Rating:</Form.Label>
          <Form.Control
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default AddCourse;

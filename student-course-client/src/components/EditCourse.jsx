// EditCourse component
import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import Swal from "sweetalert2";

const EDIT_COURSE = gql`
  mutation EditCourse(
    $id: ID!
    $courseName: String!
    $section: String!
    $semester: String!
  ) {
    editCourse(
      id: $id
      courseName: $courseName
      section: $section
      semester: $semester
    ) {
      id
      courseName
      section
      semester
    }
  }
`;

const FAVOURITE_ACTIVITY = gql`
  mutation FavouriteActivity($courseId: ID!) {
    favouriteActivity(courseId: $courseId) {
      id
    }
  }
`;

const UNFAVORITE_ACTIVITY = gql`
  mutation UnfavoriteActivity($courseId: ID!) {
    unfavoriteActivity(courseId: $courseId) {
      id
    }
  }
`;

const EditCourse = ({
  courseCodeId,
  existingCourseName,
  existingSection,
  existingSemester,
  onClose,
}) => {
  const [courseName, setCourseName] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    // Set the initial content when the component mounts
    setCourseName(existingCourseName);
    setSection(existingSection);
    setSemester(existingSemester);
  }, [existingSection, existingSemester]);

  const [editCourse] = useMutation(EDIT_COURSE);
  const [favouriteCourse] = useMutation(FAVOURITE_ACTIVITY);
  const [unfavoriteCourse] = useMutation(UNFAVORITE_ACTIVITY);

  const UnfavoriteCourse = async (courseCodeId) => {
    console.log("Unfavoriting activity:", courseCodeId);
    try {
      await unfavoriteCourse({
        variables: { courseId: courseCodeId },
      });
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: "The activity has been removed from your favorites!",
      });
      onClose();
    } catch (err) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: `Error removing activity from favourites - ${err}`,
      });
      console.log(JSON.stringify(err, null, 2));
    }
  };

  const FavouriteCourse = async (courseCodeId) => {
    console.log("Favouriting activity:", courseCodeId);
    try {
      await favouriteCourse({
        variables: { courseId: courseCodeId },
      });

      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "The activity has been added to your favorites!",
      });
      onClose();
    } catch (err) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "error",
        title: `Error adding activity to favourites - ${err}`,
      });

      console.log(JSON.stringify(err, null, 2));
    }
  };

  const sendReport = async (e) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 1700,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: "success",
      title: "Report request recieved!",
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(courseCodeId, courseName, section, semester);
    try {
      await editCourse({
        variables: { id: courseCodeId, courseName, section, semester },
      });
      onClose();
    } catch (err) {
      console.error("Error editing course:", err);
      // Handle the error, e.g., show an error message to the student.
    }
  };
  console.log(courseCodeId, courseName, section, semester);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Activity Description:</label>
          <textarea
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div>
          <label>Category:</label>
          <textarea
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
        </div>
        <div>
          <label>Rating</label>
          <textarea
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <button
            type="button"
            className="btn btn-outline-warning p-1"
            onClick={() => FavouriteCourse(courseCodeId)}
          >
            ⭐ Favourite
          </button>
          <button
            type="button"
            className="btn btn-outline-danger p-1 mx-1"
            onClick={() => UnfavoriteCourse(courseCodeId)}
          >
            ⛔ Unfavorite
          </button>
        </div>
        <button type={"submit"} className="mx-2 btn btn-dark">
          Save
        </button>
        <button type="button" className="btn btn-dark" onClick={onClose}>
          Cancel
        </button>

        <button
          type="button"
          className="mx-2 btn btn-outline-danger"
          onClick={sendReport}
        >
          Report
        </button>
      </form>
    </div>
  );
};

export default EditCourse;

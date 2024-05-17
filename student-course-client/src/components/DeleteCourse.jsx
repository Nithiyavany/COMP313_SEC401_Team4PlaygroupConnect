// DeleteCourse component
import React from 'react';
import { useMutation, gql } from '@apollo/client';

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;

const DeleteCourse = ({ courseCodeId, onCourseDeleted }) => {
  const [deleteCourse] = useMutation(DELETE_COURSE, {
    variables: { id: courseCodeId  },
    onCompleted: () => onCourseDeleted(),
    onError: (error) => {
      // Handle the error
      console.error('Error deleting course:', error);
    },
  });

  const handleDelete = async () => {
    await deleteCourse();
  };

  return (
    <button onClick={handleDelete}>
      Delete Course
    </button>
  );
};

export default DeleteCourse;

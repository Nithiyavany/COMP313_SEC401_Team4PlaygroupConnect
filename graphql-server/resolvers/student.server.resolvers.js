const Student = require('../models/student.server.model');

  // Student resolvers
  const updateStudent = async (parent, args) => {
    console.log('args in update student:', args);
    try {
      const { id, ...update } = args;
      const options = { new: true };
      let student = await Student.findByIdAndUpdate(id, update, options);

      if (!student) {
        throw new Error(`Student with ID ${id} not found`);
      }

      // Explicitly call save to trigger the pre-save hook
      student = await student.save();

      return student;
    } catch (error) {
      console.error('Error updating student:', error);
      throw new Error('Failed to update student');
    }
  };
  // Export resolvers
  module.exports = {
  
    updateStudent
  }
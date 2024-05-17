const Course = require('../models/course.server.model');

  // Course resolvers
  const updateCourse = async (parent, args) => {
    console.log('args in update course:', args);
    try {
      const { id, ...update } = args;
      const options = { new: true };
      let course = await Course.findByIdAndUpdate(id, update, options);

      if (!course) {
        throw new Error(`Course with ID ${id} not found`);
      }

      // Explicitly call save to trigger the pre-save hook
      course = await course.save();

      return course;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }
  };
  // Export resolvers
  module.exports = {
  
    updateCourse
  }
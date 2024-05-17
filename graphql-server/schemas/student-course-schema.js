// Import resolvers for each operation
const { updateStudent } = require("../resolvers/student.server.resolvers");

// student-course-schema.js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
} = require("graphql");

const StudentModel = require("../models/student.server.model"); // Import your Student model
const CourseModel = require("../models/course.server.model"); // Import your Course model

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key"; // generate this elsewhere
const jwtExpirySeconds = 300;

// Create a GraphQL Object Type for Student model
// The fields object is a required property of a GraphQLObjectType
// and it defines the different fields or query/mutations that are available
// in this type.
const studentType = new GraphQLObjectType({
  name: "student",
  fields: function () {
    return {
      id: {
        type: GraphQLID, // Unique identifier for the student (typically corresponds to MongoDB _id)
      },
      studentNumber: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      address: {
        type: GraphQLString,
      },
      city: {
        type: GraphQLString,
      },
      phoneNumber: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      program: {
        type: GraphQLString,
      },
      favouriteActivities: {
        type: new GraphQLList(GraphQLID),
      },
    };
  },
});

// Create a GraphQL Object Type for Course model
const courseType = new GraphQLObjectType({
  name: "course",
  fields: function () {
    return {
      id: {
        type: GraphQLID, // Unique identifier for the stduent (typically corresponds to MongoDB _id)
      },

      courseName: {
        type: GraphQLString,
      },
      section: {
        type: GraphQLString,
      },
      semester: {
        type: GraphQLString,
      },
      courseCodeId: {
        type: GraphQLID,
      },
    };
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      students: {
        type: new GraphQLList(studentType),

        resolve: function () {
          const students = StudentModel.find().exec();
          if (!students) {
            throw new Error("Error");
          }
          return students;
        },
      },
      student: {
        type: studentType,
        args: {
          id: {
            name: "id",
            type: GraphQLString,
          },
        },
        resolve: async function (root, params) {
          console.log("Executing student resolver with params:", params);
          try {
            const studentInfo = await StudentModel.findById(params.id).exec();
            console.log("Student info:", studentInfo);

            if (!studentInfo) {
              console.error("Student not found for id:", params.id);
              throw new Error("Error");
            }

            return studentInfo;
          } catch (error) {
            console.error("Error fetching student:", error);
            throw new Error("Failed to fetch student");
          }
        },
      },
      // check if student is logged in
      isLoggedIn: {
        type: GraphQLBoolean, // Change the type to Boolean
        args: {
          email: {
            name: "email",
            type: GraphQLString,
          },
        },
        resolve: function (root, params, context) {
          const token = context.req.cookies.token;

          // If the cookie is not set, return false
          if (!token) {
            return false;
          }

          try {
            // Try to verify the token
            jwt.verify(token, JWT_SECRET);
            return true; // Token is valid, student is logged in
          } catch (e) {
            // If verification fails, return false
            return false;
          }
        },
      },
      //
      courses: {
        type: new GraphQLList(courseType),
        resolve: function () {
          const courses = CourseModel.find().exec();
          if (!courses) {
            throw new Error("Error");
          }
          return courses;
        },
      },

      course: {
        type: courseType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async function (root, { id }) {
          try {
            const course = await CourseModel.findById(id).exec();

            if (!course) {
              throw new Error("Course not found");
            }

            return course;
          } catch (error) {
            console.error("Error fetching course:", error);
            throw new Error("Failed to fetch course");
          }
        },
      },

      favourites: {
        type: new GraphQLList(courseType),
        resolve: async function (root, params, context) {
          const token = context.req.cookies.token;
          if (!token) {
            throw new Error("Unauthorized");
          }
          try {
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const userId = decodedToken._id;
            const student = await StudentModel.findById(userId).exec();
            if (!student) {
              throw new Error("User not found");
            }
            const favouriteCourses = await CourseModel.find({
              _id: { $in: student.favouriteActivities },
            }).exec();
            console.log("Favourite courses: ", favouriteCourses);
            return favouriteCourses;
          } catch (error) {
            console.error("Error fetching favourites:", error);
            throw new Error("Failed to fetch favourites");
          }
        },
      },
    };
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      createStudent: {
        type: studentType,
        args: {
          studentNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },

          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          address: {
            type: new GraphQLNonNull(GraphQLString),
          },
          city: {
            type: new GraphQLNonNull(GraphQLString),
          },
          phoneNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          program: {
            type: new GraphQLNonNull(GraphQLString),
          },
          favouriteActivities: {
            type: new GraphQLList(GraphQLID),
            defaultValue: [],
          },
        },
        resolve: function (root, params, context) {
          const studentModel = new StudentModel(params);
          const newStudent = studentModel.save();
          if (!newStudent) {
            throw new Error("Error");
          }
          return newStudent;
        },
      },

      favouriteActivity: {
        type: courseType,
        args: {
          courseId: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async function (root, { courseId }, context) {
          // Check if the student is logged in
          const token = context.req.cookies.token;
          if (!token) {
            throw new Error("Student not authenticated");
          }
          try {
            // Verify the token to get the student ID
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const studentId = decodedToken._id;
            console.log("Student ID:", studentId);

            // Find the student by ID
            const student = await StudentModel.findById(studentId).exec();
            if (!student) {
              throw new Error("Student not found");
            }

            // Check if the activity already exists in the favouriteActivities array
            if (student.favouriteActivities.includes(courseId)) {
              throw new Error("You already have that activity favorited.");
            }

            // Add the courseId to the favouriteActivities array
            student.favouriteActivities.push(courseId);
            const updatedStudent = await student.save();
            return updatedStudent;
          } catch (error) {
            console.error("Error adding favourite activity:", error);
            throw new Error("Failed to add favourite activity");
          }
        },
      },

      unfavoriteActivity: {
        type: courseType,
        args: {
          courseId: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: async function (root, { courseId }, context) {
          // Check if the student is logged in
          const token = context.req.cookies.token;
          if (!token) {
            throw new Error("Student not authenticated");
          }
          try {
            // Verify the token to get the student ID
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const studentId = decodedToken._id;
            console.log("Student ID:", studentId);
            // Find the student by ID
            const student = await StudentModel.findById(studentId).exec();
            if (!student) {
              throw new Error("Student not found");
            }
            // Remove the courseId from the favouriteActivities array
            student.favouriteActivities = student.favouriteActivities.filter(
              (activity) => activity !== courseId
            );
            const updatedStudent = await student.save();
            return updatedStudent;
          } catch (error) {
            console.error("Error removing favourite activity:", error);
            throw new Error("Failed to remove favourite activity");
          }
        },
      },

      updateStudent: {
        type: studentType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
          studentNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          address: {
            type: new GraphQLNonNull(GraphQLString),
          },
          city: {
            type: new GraphQLNonNull(GraphQLString),
          },
          phoneNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          program: {
            type: new GraphQLNonNull(GraphQLString),
          },
          favouriteActivities: {
            type: new GraphQLList(GraphQLID),
          },
        },
        resolve: updateStudent,
      },
      loginStudent: {
        type: GraphQLBoolean, // Change the type to Boolean
        args: {
          email: {
            name: "email",
            type: GraphQLString,
          },
          password: {
            name: "password",
            type: GraphQLString,
          },
        },
        resolve: async function (root, params, context) {
          console.log("Executing loginStudent resolver with params:", params);

          const studentInfo = await StudentModel.findOne({
            email: params.email,
          }).exec();
          console.log("Student info:", studentInfo);
          if (!studentInfo) {
            console.error("Student not found for email:", params.email);
            return false; // Authentication failed
          }
          console.log("email: ", studentInfo.email);
          console.log("entered pass: ", params.password);
          console.log("hash: ", studentInfo.password);
          console.log("Entered Password (trimmed):", params.password.trim());
          console.log(
            "Stored Password (trimmed):",
            studentInfo.password.trim()
          );
          // check if the password is correct

          const isValidPassword = await bcrypt.compare(
            params.password.trim(),
            studentInfo.password.trim()
          );
          console.log("bcrypt.compare Result: ", isValidPassword);

          if (!isValidPassword) {
            console.error("Invalid password");
            console.log("Entered Password:", params.password);
            console.log("Stored Password:", studentInfo.password);
            return false; // Authentication failed
          }

          try {
            const token = jwt.sign(
              { _id: studentInfo._id, email: studentInfo.email },
              JWT_SECRET,
              { algorithm: "HS256", expiresIn: jwtExpirySeconds }
            );

            console.log("Generated token:", token);

            context.res.cookie("token", token, {
              maxAge: jwtExpirySeconds * 1000,
              httpOnly: true,
            });
            return true; // Authentication successful
          } catch (error) {
            console.error("Error generating token:", error);
            return false; // Authentication failed
          }
        },
      },

      logOut: {
        type: GraphQLString,
        resolve: (parent, args, context) => {
          context.res.clearCookie("token");
          return "Logged out successfully!";
        },
      },
      addCourse: {
        type: courseType,
        args: {
          courseName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          section: {
            type: new GraphQLNonNull(GraphQLString),
          },
          semester: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async function (
          root,
          { courseName, section, semester },
          context
        ) {
          // Check if the student is logged in
          const token = context.req.cookies.token;

          if (!token) {
            throw new Error("Stduent not authenticated");
          }

          try {
            // Verify the token to get the stduent ID
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const courseCodeId = decodedToken._id;

            // Continue with adding the course, including the courseCodeId
            const courseModel = new CourseModel({
              courseName,
              section,
              semester,
              courseCodeId,
            });
            const savedCourse = await courseModel.save();

            return savedCourse;
          } catch (error) {
            console.error("Error adding course:", error);
            throw new Error("Failed to add course");
          }
        },
      },

      editCourse: {
        type: courseType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
          courseName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          section: {
            type: new GraphQLNonNull(GraphQLString),
          },
          semester: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async function (root, params, context) {
          const token = context.req.cookies.token;
          if (!token) {
            return "not-auth";
          }

          try {
            // Get the student ID from the token
            const { _id: studentId } = jwt.verify(token, JWT_SECRET);

            // Find the course by ID
            const course = await CourseModel.findById(params.id).exec();

            // Check if the student making the edit is the course of the courseCodeId
            if (!course || String(course.courseCodeId) !== studentId) {
              throw new Error("Unauthorized");
            }

            // Update the course content
            const updatedCourse = await CourseModel.findByIdAndUpdate(
              params.id,
              {
                $set: {
                  courseName: params.courseName,
                  section: params.section,
                  semester: params.semester,
                },
              },

              { new: true }
            ).exec();

            return updatedCourse;
          } catch (error) {
            console.error("Error editing course:", error);
            // Handle the error, e.g., show an error message to the student.
            throw new Error("Failed to edit course");
          }
        },
      },
    };
  },
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });

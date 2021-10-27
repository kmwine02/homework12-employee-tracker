const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const initialQuestions = [
  {
    type: "list",
    name: "task",
    message: "Enter the manager's name:",
    choices: [
      "View all departments",
      "View all roles",
      "View all empoloyees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee",
    ],
  },
];

const addDepartment = [
  {
    type: "input",
    name: "addDepartment",
    message: "Enter the name of the department you would like to add:"
  }
];

const addRole = [
  {
    type: "input",
    name: "roleName",
    message: "Enter the name of the role you would like to add:"
  },
  {
    type: "input",
    name: "salary",
    message: "Enter the salary for the role:"
  },
  // how to add a dynamic list for existing departments
  {
    type: "input",
    name: "department",
    message: "Enter a department for the role:"
  }
];

const addEmployee = [
  {
    type: "input",
    name: "firstName",
    message: "Enter the new employee's first name:"
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter the new employee's last name:"
  },
  // add a dynamic list for roles available
  {
    type: "input",
    name: "role",
    message: "Select a role for the new employee:"
  },
  {
    type: "input",
    name: "manager",
    message: "Select a manager for the new employee:"
  }
];

const updateEmployee = [
  {
    type: "input",
    name: "employee",
    message: "Select an employee to update:"
  }
];

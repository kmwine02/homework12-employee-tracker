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
  }
  // console.log(`Connected to the employees_db database.`)
);
db.connect(function (err) {
  init();
});

const initialQuestions = [
  {
    type: "list",
    name: "task",
    message: "Choose an action:",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee",
    ],
  },
];

const addDepartmentQuestion = [
  {
    type: "input",
    name: "addDepartment",
    message: "Enter the name of the department you would like to add:",
  },
];

const addRoleQuestions = [
  {
    type: "input",
    name: "roleName",
    message: "Enter the name of the role you would like to add:",
  },
  {
    type: "input",
    name: "salary",
    message: "Enter the salary for the role:",
  },
  // how to add a dynamic list for existing departments
  {
    type: "input",
    name: "department",
    message: "Enter a department for the role:",
  },
];

const addEmployeeQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "Enter the new employee's first name:",
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter the new employee's last name:",
  },
  // add a dynamic list for roles available
  {
    type: "input",
    name: "role",
    message: "Select a role for the new employee:",
  },
  {
    type: "input",
    name: "manager",
    message: "Select a manager for the new employee:",
  },
];

const updateEmployeeQuestions = [
  {
    type: "input",
    name: "employee",
    message: "Select an employee to update:",
  },
];

const viewDepartments = () => {
  db.query(`select * from departments`, (err, data) => {
    if(err) {
      console.log(err);
    }
    console.table(data);
    process.exit();
  });
};

const viewRoles = () => {
  db.query(`select * from roles`, (err, data) => {
    if(err) {
      console.log(err);
    }
    console.table(data);
    process.exit();
  });
};

const viewEmployees = () => {
  db.query(`select * from employees`, (err, data) => {
    if(err) {
      console.log(err);
    }
    console.table(data);
    process.exit();
  });
};

const addDepartment = (department) => {
  db.query(`insert into departments(name) value (?)`, [department], (err, data) => {
    if(err) {
      console.log(err);
    }
    db.query(`select * from departments`, (err, data) => {
      if(err) {
        console.log(err);
      }
      console.table(data)
      process.exit();
    });
  });
};

const addRole = (role) => {
  db.query(`insert into roles (title, salary, department_id) value (?)`, [role], (err, data) => {
    if(err) {
      console.log(err);
    }
    db.query(`select * from roles`, (err, data) => {
      if(err) {
        console.log(err);
      }
      console.table(data);
      process.exit();
    });
  });
};

async function init() {
  let answers = await inquirer.prompt(initialQuestions);
  console.log(answers);

  if (answers.task === "View all departments") {
    console.log("View all departments");
    viewDepartments();
  } else if (answers.task === "View all roles") {
    console.log(answers.task);
    viewRoles();
  } else if (answers.task === "View all employees") {
    console.log(answers.task);
    viewEmployees();
  } else if (answers.task === "Add a department") {
    console.log(answers.task);
    const newDepartment = await inquirer.prompt(addDepartmentQuestion);

    console.log(newDepartment.addDepartment);
    addDepartment(newDepartment.addDepartment);
  } else if (answers.task === "Add a role") {
    console.log(answers.task);
    const newRole = await inquirer.prompt(addRoleQuestions);
    console.log(newRole);

    
  } else if (answers.task === "Add an employee") {
    console.log(answers.task);
    db.query(`select * from employees`, (err, data) => {
      console.table(data);
      process.exit();
    });
  } else if (answers.task === "Update an employee") {
    console.log(answer.task);
    db.query(`select * from employees`, (err, data) => {
      console.table(data);
      process.exit();
    })
  }
};

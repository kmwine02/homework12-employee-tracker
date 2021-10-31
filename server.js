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
);
db.connect(function (err) {
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
  console.log(role);
  db.query(`insert into roles (title, salary, department_id) value (?, ?, ?)`, [role.roleName, role.salary, role.department], (err, data) => {
    if(err) {
      console.log(err);
    }
    viewRoles();
  });
};

const addEmployee = (employee) => {
  console.log(employee);
  db.query(`insert into employees (first_name, last_name, role_id, manager_id) value (?, ?, ?, ?)`, [employee.firstName, employee.lastName, employee.role, employee.manager], (err, data) => {
    if(err) {
      console.log(err);
    }
    viewEmployees();
  });
};

//starts the employee manager application and prompts the initial question asking what action the user wants to take
const startEmployeeManager = async () => {
  const selection = await inquirer.prompt(initialQuestions);
  startQuestions(selection.task);
}

// uses the answer selected and prompts either more questions or shows the requested data
const startQuestions= async answer => {
  if (answer === "View all departments") {
    viewDepartments();

  } else if (answer === "View all roles") {
    viewRoles();

  } else if (answer === "View all employees") {
    viewEmployees();

  } else if (answer === "Add a department") {
    const addDepartmentQuestion = [
      {
        type: "input",
        name: "addDepartment",
        message: "Enter the name of the department you would like to add:",
      },
    ];
    const newDepartment = await inquirer.prompt(addDepartmentQuestion);
    addDepartment(newDepartment.addDepartment);

  } else if (answer === "Add a role") {
    const [dbDepartments] = await db.promise().query('select * from departments');
    const departments = dbDepartments.map(dept => {return dept.name});
    
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
      {
        type: "list",
        name: "department",
        message: "Choose a department for the role:",
        choices: departments
      },
    ];
    const newRole = await inquirer.prompt(addRoleQuestions);
    console.log(newRole);
    addRole(newRole);

  } else if (answer === "Add an employee") {
    const [dbRoles] = await db.promise().query(`select * from roles`);
    console.log(dbRoles);
    const roles = dbRoles.map(role => {return role.title});

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
      {
        type: "list",
        name: "role",
        message: "Select a role for the new employee:",
        choices: roles
      },
      {
        type: "input",
        name: "manager",
        message: "Select a manager for the new employee:",
      },
    ];

    const newEmployee = await inquirer.prompt(addEmployeeQuestions);
    addEmployee(newEmployee);


  } else if (answer === "Update an employee") {
    console.log(answer);
    db.query(`select * from employees`, (err, data) => {
      console.table(data);
      process.exit();
    })
  }
};

function init() {
  startEmployeeManager();
};

init();
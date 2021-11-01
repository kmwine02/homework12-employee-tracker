const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require('console.table');

// creates connection to database
const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "password",
  database: "employees_db",
});
db.connect(function (err) {});

// first questions asked to the user
const initialQuestions = [
  {
    type: "list",
    name: "task",
    message: "Choose an action:",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit"
    ],
  },
];

const viewDepartments = () => {
  db.query(`select id as 'ID', name as 'Department Name' from departments`, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.table(data);
    process.exit();
  });
};

const viewRoles = () => {
  db.query(`
  select 
  r.id as 'ID', 
  r.title as 'Title', 
  d.name as 'Department Name', 
  r.salary as 'Salary'  
  from 
  roles r 
  join 
  departments d on r.department_id = d.id
  order by r.id
  `, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.table(data);
    process.exit();
  });
};

const viewEmployees = () => {
  db.query(`
  select 
  e.id as 'ID',
  e.first_name as 'First Name',
  e.last_name as 'Last Name',
  r.title as 'Title',
  d.name as 'Department',
  r.salary as 'Salary',
  concat (em.first_name, ' ', em.last_name) as 'Manager'
  from 
  employees e
  join roles r on r.id = e.role_id
  join departments d on d.id = r.department_id
  left join employees em on e.manager_id = em.id
  `, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.table(data);
    process.exit();
  });
};

const addDepartment = (department) => {
  db.query(`insert into departments(name) value (?)`, [department],
    (err, data) => {
      if (err) {
        console.log(err);
      }
      db.query(`select * from departments`, (err, data) => {
        if (err) {
          console.log(err);
        }
        console.table(data);
        process.exit();
      });
    });
};

const addRole = (role) => {
  db.query(`select id from departments where name=?`, [role.department], (err, result) => {
      const departmentID = result[0].id;
      db.query(`insert into roles (title, salary, department_id) value (?, ?, ?)`, [role.roleName, role.salary, departmentID],
        (err, data) => {
          if (err) {
            console.log(err);
          }
          viewRoles();
        });
    });
};

const addEmployee = (employee) => {
  db.query(`select id from roles where title=?`, [employee.role], (err, result) => {
      const roleID = result[0].id;
      db.query(`select id from employees where concat(first_name, ' ', last_name) = ?`, [employee.manager], (err, result2) => {
          const managerID = result2[0].id;
          console.log(managerID);
          db.query(`insert into employees (first_name, last_name, role_id, manager_id) value (?, ?, ?, ?)`, [employee.firstName, employee.lastName, roleID, managerID],
            (err, data) => {
              if (err) {
                console.log(err);
              }
              viewEmployees();
            });
        });
    });
};

const updateEmployee = (employee) => {
  db.query(`select id from employees where concat(first_name, ' ', last_name) = ?`, [employee.employee], (err, result) => {
    const employeeID = result[0].id;
    db.query(`select * from roles where title=?`, [employee.role], (err, result2) => {
      const roleID = result2[0].id;
      db.query(`update employees set role_id = ? where id = ?`, [roleID, employeeID], (err, data) => {
        if(err) {
          console.log(err);
        }
        console.log("Employee recorded successfully updated.");
      })
    })
  })
};

//starts the employee manager application and prompts the initial question asking what action the user wants to take
const startEmployeeManager = async () => {
  const selection = await inquirer.prompt(initialQuestions);
  startQuestions(selection.task);
};

// uses the answer selected and prompts either more questions or shows the requested data
const startQuestions = async (answer) => {
  switch (answer) {
  case "View All Departments":
    viewDepartments();

    break;

   case "View All Roles":
    viewRoles();
    break;

  case "View All Employees":
    viewEmployees();
    break;

  case "Add Department":
    const addDepartmentQuestion = [
      {
        type: "input",
        name: "addDepartment",
        message: "Enter the name of the department you would like to add:",
      },
    ];
    const newDepartment = await inquirer.prompt(addDepartmentQuestion);
    addDepartment(newDepartment.addDepartment);
    break;

  case "Add Role":
    // creating array to display existing departments
    const [dbDepartments] = await db.promise().query("select * from departments");
    const departments = dbDepartments.map((dept) => ({
      id: dept.id,
      name: dept.name,
    }));

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
        choices: departments,
      },
    ];
    const newRole = await inquirer.prompt(addRoleQuestions);
    addRole(newRole);
    break;

  case "Add Employee":
    // creating array to display existing roles
    const [dbRoles] = await db.promise().query(`select * from roles`);
    const roles = dbRoles.map((role) => {return role.title;});

    // creating array to display existing employees
    const [dbManager] = await db.promise().query(`select concat(first_name, ' ', last_name) as manager from employees`);
    const manager = dbManager.map((mgr) => {return mgr.manager;});

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
        choices: roles,
      },
      {
        type: "list",
        name: "manager",
        message: "Select a manager for the new employee:",
        choices: manager,
      },
    ];

    const newEmployee = await inquirer.prompt(addEmployeeQuestions);
    addEmployee(newEmployee);
    break;

  case "Update Employee":
    // creating array to display existing employees
    const [dbEmployees] = await db.promise().query(`select concat(first_name, ' ', last_name) as employee from employees`);
    const employees = dbEmployees.map(emp => {return emp.employee})

    // creating array to display existing roles
    const [dbRoles1] = await db.promise().query(`select * from roles`);
    const roles1 = dbRoles1.map((role1) => {return role1.title;});
    const updateEmployeeQuestions = [
      {
        type: "list",
        name: "employee",
        message: "Select an employee to update:",
        choices: employees
      },
      {
        type: "list",
        name: "role",
        message: "Which role do you want to assign the selected employee?",
        choices: roles1
      },
    ];

    const updatedEmployee = await inquirer.prompt(updateEmployeeQuestions);
    updateEmployee(updatedEmployee);
    break;

  case "Quit":
    process.exit();
    break;
  }
};

function init() {
  startEmployeeManager();
}

init();

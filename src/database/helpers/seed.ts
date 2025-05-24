// import {
//   PrismaClient,
//   RoleName,
//   Action,
//   Resource,
//   NotificationTypes,
// } from '../generated/prisma'; // Adjust path based on your output config

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Start seeding...');

//   // 1. Delete all existing data (optional, but good for clean re-seeding)
//   await prisma.notification.deleteMany({});
//   await prisma.transfer.deleteMany({});
//   await prisma.expense.deleteMany({});
//   await prisma.income.deleteMany({});
//   await prisma.expenseType.deleteMany({});
//   await prisma.incomeType.deleteMany({});
//   await prisma.user.deleteMany({});
//   await prisma.permissions.deleteMany({}); // Delete permissions before roles
//   await prisma.role.deleteMany({});

//   console.log('Existing data cleared.');

//   // 2. Create Roles
//   const adminRole = await prisma.role.create({
//     data: {
//       name: RoleName.ADMIN,
//     },
//   });

//   const customerRole = await prisma.role.create({
//     data: {
//       name: RoleName.CUSTOMER,
//     },
//   });
//   console.log('Roles created.');

//   // 3. Create Permissions for ADMIN
//   // ADMIN has full access to all resources
//   const adminPermissions = await prisma.permissions.createMany({
//     data: [
//       {
//         roleId: adminRole.id,
//         resource: Resource.USER,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.PERMISSION,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.INCOME,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.EXPENSE,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.TRANSFER,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.EXPENSE_TYPE,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.INCOME_TYPE,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: adminRole.id,
//         resource: Resource.NOTIFICATION,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//     ],
//   });
//   console.log('Admin permissions created.');

//   // 4. Create Permissions for CUSTOMER
//   // CUSTOMER can manage their own income/expenses/transfers and view notifications, but not manage users or permissions directly.
//   const customerPermissions = await prisma.permissions.createMany({
//     data: [
//       {
//         roleId: customerRole.id,
//         resource: Resource.USER,
//         actions: [Action.READ, Action.UPDATE],
//       }, // Can read/update their own user profile
//       {
//         roleId: customerRole.id,
//         resource: Resource.INCOME,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: customerRole.id,
//         resource: Resource.EXPENSE,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: customerRole.id,
//         resource: Resource.TRANSFER,
//         actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
//       },
//       {
//         roleId: customerRole.id,
//         resource: Resource.EXPENSE_TYPE,
//         actions: [Action.READ],
//       }, // Can only view expense types
//       {
//         roleId: customerRole.id,
//         resource: Resource.INCOME_TYPE,
//         actions: [Action.READ],
//       }, // Can only view income types
//       {
//         roleId: customerRole.id,
//         resource: Resource.NOTIFICATION,
//         actions: [Action.READ],
//       },
//     ],
//   });
//   console.log('Customer permissions created.');

//   // 5. Create Users (example)
//   const adminUser = await prisma.user.create({
//     data: {
//       email: 'admin@example.com',
//       password: 'hashed_password_admin', // In a real app, hash this securely!
//       role_id: adminRole.id,
//     },
//   });

//   const customerUser = await prisma.user.create({
//     data: {
//       email: 'customer@example.com',
//       password: 'hashed_password_customer', // In a real app, hash this securely!
//       role_id: customerRole.id,
//     },
//   });
//   console.log('Users created.');

//   // 6. Create Expense and Income Types (example)
//   const foodExpenseType = await prisma.expenseType.create({
//     data: { name: 'Food' },
//   });
//   const transportExpenseType = await prisma.expenseType.create({
//     data: { name: 'Transport' },
//   });
//   const salaryIncomeType = await prisma.incomeType.create({
//     data: { name: 'Salary' },
//   });
//   const freelanceIncomeType = await prisma.incomeType.create({
//     data: { name: 'Freelance' },
//   });
//   console.log('Expense and Income Types created.');

//   // 7. Create some dummy Expenses and Incomes for the customer user
//   await prisma.expense.create({
//     data: {
//       name: 'Groceries',
//       amount: '50.00', // Use string for monetary values if your schema uses string, but Decimal/Float is better
//       user_id: customerUser.id,
//       expense_type_id: foodExpenseType.id,
//     },
//   });
//   await prisma.expense.create({
//     data: {
//       name: 'Bus Ticket',
//       amount: '2.50',
//       user_id: customerUser.id,
//       expense_type_id: transportExpenseType.id,
//     },
//   });

//   await prisma.income.create({
//     data: {
//       name: 'Monthly Salary',
//       amount: '2000.00',
//       user_id: customerUser.id,
//       income_type_id: salaryIncomeType.id,
//     },
//   });
//   console.log('Expenses and Incomes created.');

//   // 8. Create a dummy Transfer
//   await prisma.transfer.create({
//     data: {
//       sender_id: customerUser.id,
//       recipient_id: adminUser.id, // Assuming admin can receive
//       amount: 100, // Make sure this matches your schema (Int in this case)
//       description: 'Payment for services',
//     },
//   });
//   console.log('Transfer created.');

//   // 9. Create a dummy Notification
//   await prisma.notification.create({
//     data: {
//       user_id: customerUser.id,
//       type: NotificationTypes.NEW_EXPENSE,
//       description: 'You recorded a new expense of $50.',
//     },
//   });
//   console.log('Notification created.');

//   console.log('Seeding finished.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

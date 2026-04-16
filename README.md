# Full Stack Developer Portfolio

A dynamic portfolio website built with Node.js, Express, and EJS with an admin panel for managing projects.

## Features

- **Dynamic Projects**: Add, edit, and delete projects from the admin panel
- **Secure Admin Panel**: Password-protected admin dashboard
- **Responsive Design**: Mobile-friendly dark UI design
- **MongoDB Integration**: Stores project data in MongoDB
- **Session Management**: Secure admin authentication

## Installation

1. **Clone the repository**
   ```bash
   cd PortFolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB**
   - Make sure MongoDB is running locally on `mongodb://localhost:27017`
   - Or update `MONGO_URI` in `.env` file with your MongoDB connection string

4. **Initialize Admin User**
   ```bash
   npm run init
   ```
   This creates a default admin user:
   - Username: `admin`
   - Password: `admin123`
   - ⚠️ Change the password immediately after first login!

5. **Start the server**
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:3000`

## Usage

### Accessing the Portfolio
- Homepage: `http://localhost:3000` or `http://localhost:3000/MyPort/home`
- All projects added through the admin panel will be displayed here

### Accessing the Admin Panel
1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123` (or your custom password)
3. Dashboard: `http://localhost:3000/admin/dashboard`

### Admin Functions
- **Add Project**: Click "Add Project" to create a new project
- **Edit Project**: Click "Edit" on any project to modify it
- **Delete Project**: Click "Delete" to remove a project
- **Logout**: Click "Logout" to exit the admin panel

## Project Structure

```
PortFolio/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Admin.js           # Admin schema with bcrypt
│   │   └── Project.js         # Project schema
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── server.js              # Express server setup
│   ├── components/            # Reusable components
│   ├── data/                  # Static data
│   └── styles/                # CSS files
├── routes/
│   ├── home.js                # Portfolio homepage
│   └── admin.js               # Admin routes
├── views/
│   ├── home.ejs               # Main portfolio page
│   ├── partials/
│   │   ├── navbar.ejs         # Navigation bar
│   │   └── footer.ejs         # Footer
│   └── admin/
│       ├── login.ejs          # Admin login page
│       ├── dashboard.ejs      # Admin dashboard
│       ├── add-project.ejs    # Add project form
│       └── edit-project.ejs   # Edit project form
├── public/
│   ├── css/
│   │   └── styles.css         # Main stylesheet
│   ├── js/
│   │   └── main.js            # Client-side JavaScript
│   └── assets/                # Images and SVGs
├── .env                       # Environment variables
├── init-admin.js              # Admin initialization script
└── package.json               # Dependencies
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/portfolio
SESSION_SECRET=portfolio-admin-secret-key-2026
NODE_ENV=development
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, EJS templating
- **Database**: MongoDB with Mongoose
- **Authentication**: bcryptjs for password hashing, express-session
- **Server**: Express with session management

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Protected admin routes
- HTTP-only cookies
- CSRF prevention through session management

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run init` - Initialize admin user

## Default Credentials

After running `npm run init`:
- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the password immediately after first login!

## File Uploads

Currently, the admin panel doesn't support image uploads. Project links point to external URLs for live demo and GitHub repository.

## Future Enhancements

- Image upload for project covers
- Project filtering by tags
- Project search functionality
- Email notifications for contact form
- Project statistics dashboard
- Multiple admin users support

## License

ISC

## Author

Kishore Kumar  
Email: kishore21092003@gmail.com  
GitHub: github.com/kaushal-kumar-2109

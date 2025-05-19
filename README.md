# 📚 Syllabus Client

A responsive React + TypeScript frontend for managing academic syllabuses and course content. Built for university staff and professors to easily view and maintain syllabus structures, this app is tightly integrated with the [.NET-based Syllabus API](https://github.com/EgliTafa/SyllabusAPI).

---

## ⚙️ Technologies Used

| Purpose           | Technology                           |
|-------------------|---------------------------------------|
| Language          | TypeScript                            |
| Framework         | React                                 |
| UI Library        | Material UI (MUI v5)                  |
| State Management  | Redux Toolkit                         |
| Routing           | React Router DOM                      |
| HTTP Requests     | Axios                                 |
| Authentication    | JWT with Axios Interceptors           |
| Theming           | MUI Theme Provider                    |
| Build Tool        | CRA (Create React App)                |
| Mobile Support    | Responsive design with MUI Grid/Flexbox |
| Styling           | MUI SX                                |
| Containerization  | Docker                                |

---

## ✨ Features

- ✅ **Authentication System**
  - User registration with validation
  - Secure login with JWT
  - Password reset functionality
  - Role-based access control

- ✅ **Responsive UI**
  - Mobile-first design
  - Adaptive layouts for all screen sizes
  - Touch-friendly interface

- ✅ **Syllabus Management**
  - View syllabus details
  - Course listing by semester
  - Interactive course tables
  - Generate syllabus documents

- ✅ **Course Management**
  - Detailed course information
  - Teaching plan display
  - Evaluation breakdown
  - Course editing capabilities

- ✅ **User Features**
  - Role-based navigation
  - Profile management
  - Secure authentication
  - Session management

---

## 📁 Folder Structure

```
syllabus-client/
├── public/
├── src/
│   ├── app/                ← App setup, store config
│   ├── features/           ← Domain features
│   │   ├── auth/          ← Authentication
│   │   ├── courses/       ← Course management
│   │   └── syllabus/      ← Syllabus management
│   ├── components/         ← Shared UI components
│   ├── layouts/           ← Page layouts
│   ├── theme/             ← Theme configuration
│   ├── utils/             ← Helpers & constants
│   └── index.tsx
├── .env
├── Dockerfile
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v18+)
- npm (v9+)
- Backend running from: [syllabus-api](https://github.com/EgliTafa/syllabus-api)

---

### 📦 Install Dependencies

```bash
npm install
```

---

### 🧪 Start the App

```bash
npm run start
```

> Then open: [http://localhost:3000](http://localhost:3000)

---

### 🌐 Environment Setup

Create a `.env` file in the root and add the backend API URL:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

For production:
```
REACT_APP_API_BASE_URL=https://syllabus-app-container.yellowfield-b94f6044.westus2.azurecontainerapps.io
```

---

## 🔐 Authentication

The application uses JWT-based authentication with the following features:

- Secure user registration with validation
- Email-based login
- Password reset functionality
- Role-based access control (Administrator, Professor, Student)
- Automatic token management
- Protected routes

---

## 📱 Mobile Support

- Fully responsive using Material UI's grid system
- Mobile-optimized forms and tables
- Touch-friendly interface elements
- Adaptive layouts for all screen sizes

---

## 🐳 Docker Support

The application is containerized using Docker:

```bash
# Build the image
docker build -t syllabus-client .

# Run the container
docker run -p 3000:3000 syllabus-client
```

---

## 🚧 Roadmap

- [x] Authentication system
- [x] Syllabus management
- [x] Course management
- [x] Responsive design
- [x] Docker containerization
- [ ] Document generation
- [ ] File upload support
- [ ] Advanced search functionality
- [ ] Analytics dashboard

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 👨‍💻 Author

**E. T.**  
Senior .NET & React Developer  
GitHub: [@EgliTafa](https://github.com/EgliTafa)

---

## 📄 License

[MIT License](LICENSE) 

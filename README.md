# 📚 Syllabus Client

A responsive, multilingual React + TypeScript frontend for managing academic syllabuses and course content. Built for university staff and professors to easily view and maintain syllabus structures, this app is tightly integrated with the [.NET-based Syllabus API](https://github.com/EgliTafa/syllabus-api).

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
| Internationalization | react-intl                        |
| Theming           | MUI Theme Provider (Light & Dark mode)|
| Build Tool        | CRA (Create React App)                |
| Mobile Support    | Responsive design with MUI Grid/Flexbox |
| Styling           | MUI SX + Custom SCSS Modules          |
| DevOps (planned)  | Docker                                |
| Testing (planned) | Jest + React Testing Library          |

---

## ✨ Features

- ✅ **Light/Dark Theme Toggle** (based on MUI theme)
- ✅ **Responsive UI** for desktop, tablet, and mobile
- ✅ **Multilingual UI**: English 🇬🇧 & Albanian 🇦🇱
- ✅ **Syllabus listing & detail view**
- ✅ **Course and course details display**
- ✅ **City and Country selectors**
- ✅ **Editable business and professor data (modal based)**

> 🧩 **Planned Features**:
- 🔐 Authentication via JWT
- ➕ Create/edit syllabuses and courses
- 📄 Export to DOCX/PDF using backend support
- ⬆️ File upload support for attachments
- 🧑‍🎓 Role-based UI (Admin vs Professor)

---

## 📁 Folder Structure

```
syllabus-client/
├── public/
├── src/
│   ├── app/                ← App setup, store config
│   ├── features/           ← Domain features (e.g., business, syllabus)
│   ├── components/         ← Shared UI components
│   ├── pages/              ← Route-based pages
│   ├── translations/       ← i18n JSON files
│   ├── theme/              ← Light/Dark theme setup
│   ├── utils/              ← Helpers & constants
│   └── index.tsx
├── .env
├── Dockerfile (planned)
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

---

## 🌍 Internationalization

Supports multiple languages using `react-intl`. Currently includes:

- 🇬🇧 English (`en.json`)
- 🇦🇱 Albanian (`sq.json`)

Translations are organized in `src/translations/` and can be extended easily.

---

## 🎨 Theme Support

- Uses Material UI theming.
- Supports both **Light Mode** and **Dark Mode**.
- Theme preference is toggleable and stored in browser memory.

---

## 📱 Mobile Support

- Fully responsive using Material UI’s grid system and media queries.
- Components adapt gracefully to smaller screens and tablets.

---

## 🚧 Roadmap

- [x] Static views for syllabus, courses, and business data
- [x] Theme switcher and i18n setup
- [ ] Authentication (JWT-based)
- [ ] Editable syllabus creation form
- [ ] File upload and document export integration
- [ ] Docker container support
- [ ] End-to-end testing suite

---

## 👥 Contributing

Contributions are welcome! Whether it's code, bug reports, or translations, feel free to open a pull request or issue.

---

## 👨‍💻 Author

**E. T.**  
Senior .NET & React Developer  
GitHub: [@EgliTafa](https://github.com/EgliTafa)

---

## 📄 License

[MIT License](LICENSE)

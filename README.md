# 💃 Women's Saree Shopping Website

![HTML Badge](https://img.shields.io/badge/HTML5-orange?logo=html5&logoColor=white)
![CSS Badge](https://img.shields.io/badge/CSS3-blue?logo=css3&logoColor=white)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black)
![Bootstrap Badge](https://img.shields.io/badge/Bootstrap-purple?logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

### 🛍️ **Live Demo:** [ruchitdoshi30.github.io/saree-shop](https://ruchitdoshi30.github.io/saree-shop/)

---

## 📖 Overview

**Women's Saree Shopping Website** is a modern, fully responsive, and interactive e-commerce platform designed to provide a **premium shopping experience** for women.  

Users can explore, virtually try, and purchase sarees and blouses with ease, while administrators efficiently manage products, customers, and orders through a sleek admin dashboard.

This project demonstrates strong front-end development, elegant design practices, and dynamic interactivity using **HTML**, **CSS**, **JavaScript**, and **Bootstrap**.

---

## ✨ Features

### 👩‍🦰 User Features
- 🧵 **Product Browsing** – Explore a curated collection of sarees and blouses with detailed product information.
- 👗 **Virtual Draping** – Try sarees virtually to preview their appearance.
- 💫 **Personalized Recommendations** – Get smart product suggestions based on browsing preferences.
- 🛒 **Cart Management** – Add, remove, and manage items seamlessly.
- 🔐 **Authentication** – Secure login and signup system for safe user access.

---

### 🧑‍💼 Admin Features
- 📊 **Dashboard Overview** – Track orders, revenue, and customer stats at a glance.
- 🧾 **Manage Products** – Add, edit, and delete sarees and blouses dynamically.
- 📦 **Order Management** – View and update order statuses in real-time.
- 👥 **Customer Management** – Manage customer details and messages efficiently.
- ⚙️ **Advanced Features**:
  - 🔍 Real-time search and filtering  
  - ↕️ Sortable table columns  
  - 🌙 Dark mode toggle  
  - 🧠 Responsive sidebar collapse/expand  
  - 🔔 Toast notifications for instant feedback  

---

## 🧰 Technologies Used

| Category | Stack |
|-----------|--------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6) |
| **Frameworks & Libraries** | Bootstrap 5, Font Awesome, Chart.js |
| **Authentication** | Custom JavaScript-based authentication system |
| **Design** | Responsive and mobile-first layout |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/RuchitDoshi30/saree-shop.git

# 2. Navigate into the project directory
cd saree-shop

# 3. Open the project in your browser
start index.html
Or view the live version directly:
👉 https://ruchitdoshi30.github.io/saree-shop/

📁 Folder Structure
graphql
Copy code
saree-shop/
│
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript logic
│
├── components/        # Reusable HTML components (e.g., navbar, footer)
├── pages/             # User and Admin HTML pages
├── uploads/           # Uploaded images or media (if any)
│
└── index.html         # Main landing page
💡 Highlights
✅ Fully responsive on all devices (mobile, tablet, desktop)

✅ Modular, clean, and reusable front-end structure

✅ Dynamic product and order management for admins

✅ Smooth animations, hover effects, and modern transitions

✅ Real-world e-commerce design and functionality

✅ Built for scalability and long-term maintainability

🤝 Contributing
Contributions are welcome!
If you’d like to improve this project:

Fork the repository

Create your feature branch

bash
Copy code
git checkout -b feature-name
Commit your changes

bash
Copy code
git commit -m "Add new feature"
Push to your branch

bash
Copy code
git push origin feature-name
Create a Pull Request 🚀

📜 License
This project is licensed under the MIT License — free to use, modify, and distribute with attribution.

👨‍💻 Developer
Developed with ❤️ by Ruchit Doshi
Frontend Developer | Web Enthusiast | Passionate about Modern UI/UX

---

## 🛰️ Hosting on GitHub Pages

This repository is set up to publish the site to GitHub Pages automatically when changes are pushed to the `main` branch.

What I added:
- A GitHub Actions workflow at `.github/workflows/deploy.yml` that runs on pushes to `main` and deploys the repository root to the `gh-pages` branch using `peaceiris/actions-gh-pages`.

How it works:
1. Push your changes to the `main` branch.
2. The workflow will run and publish the site files (the repository root) to the `gh-pages` branch.
3. After a successful run, your site will be available at: `https://<your-username>.github.io/<repository-name>/` (for example: `https://ruchitdoshi30.github.io/saree-shop/`).

Notes & troubleshooting:
- If your site doesn't appear after a successful workflow run, go to the repository Settings → Pages and ensure the source is set to the `gh-pages` branch and the correct folder (root).
- The workflow uses the automatic `GITHUB_TOKEN` so no extra secrets are required.
- If you prefer to publish from a different folder (for example `/docs`), update the `publish_dir` value in the workflow.

Want me to also set up a custom domain or update the workflow to build from a `docs/` folder? Tell me which option you'd prefer.

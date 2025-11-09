# 💃 Women's Saree Shopping Website

![HTML Badge](https://img.shields.io/badge/HTML5-orange?logo=html5&logoColor=white)
![CSS Badge](https://img.shields.io/badge/CSS3-blue?logo=css3&logoColor=white)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black)
![Bootstrap Badge](https://img.shields.io/badge/Bootstrap-purple?logo=bootstrap&logoColor=white)
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

Follow these steps to set up and run the project locally on your system:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/RuchitDoshi30/saree-shop.git

# 2️⃣ Navigate into the project directory
cd saree-shop

# 3️⃣ Launch the project in your browser
start index.html
```

## 📂 Project Structure

```
saree-shop/
├── assets/
│   ├── css/
│   │   ├── admin.css
│   │   ├── drape.css
│   │   ├── product.css
│   │   ├── recommender.css
│   │   ├── responsive.css
│   │   ├── style-old.css
│   │   └── style.css
│   ├── images/
│   ├── js/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── drape.js
│   │   ├── product.js
│   │   ├── products.js
│   │   ├── recommender.js
│   │   ├── script.js
│   │   └── scroll-animation.js
│   └── uploads/
├── components/
│   ├── footer.html
│   └── navbar.html
├── pages/
│   ├── admin-dashboard.html
│   ├── admin.js
│   ├── body-recommender.html
│   ├── cart.html
│   ├── contact.html
│   ├── customer-messages.html
│   ├── index.html
│   ├── login.html
│   ├── lookbook.html
│   ├── manage-blouses.html
│   ├── manage-customers.html
│   ├── manage-lookbooks.html
│   ├── manage-orders.html
│   ├── manage-recommender.html
│   ├── manage-sarees.html
│   ├── manage-videos.html
│   ├── mobile-block.html
│   ├── product-detail.html
│   ├── saree-collection.html
│   ├── settings.html
│   ├── signup.html
│   ├── view-orders.html
│   └── virtual-draping.html
├── index.html
└── README.md
```

## 🚀 Core Features

### Authentication System
- Secure user registration and login
- Role-based access control (Admin/User)
- Session management and persistence
- Password encryption and validation

### Product Management
- Dynamic product catalog
- Advanced filtering and sorting
- Real-time inventory updates
- Image upload and optimization

### Shopping Experience
- Intuitive cart management
- Virtual try-on system
- Personalized recommendations
- Responsive design across devices

## 🔧 Configuration

### Environment Setup
1. Configure base URL in `config.js`
2. Set up authentication endpoints
3. Configure image upload parameters

### Admin Setup
1. Access `/admin-dashboard.html`
2. Default credentials:
   ```
   Email: admin@example.com
   Password: admin123
   ```

## 📱 Mobile Responsiveness

The application is thoroughly tested on multiple devices and breakpoints:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🛡️ Security Features

- CSRF protection
- XSS prevention
- Input sanitization
- Secure session management

## 🔍 Testing

### Manual Testing Checklist
- [ ] User authentication flow
- [ ] Product management
- [ ] Cart operations
- [ ] Admin functionalities
- [ ] Responsive design
- [ ] Cross-browser compatibility

## 📈 Performance Optimization

- Minified CSS/JS files
- Optimized image loading
- Lazy loading implementation
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. Create a Pull Request

## 📝 Code Style Guide

### JavaScript
- ES6+ standards
- Clear function naming
- JSDoc documentation
- Modular architecture

### CSS
- BEM methodology
- Mobile-first approach
- CSS custom properties
- Modular architecture

## 🙏 Acknowledgments

- Bootstrap Team
- Font Awesome
- Chart.js Contributors

---

## 🔄 Continuous Integration

This project uses GitHub Actions for automated deployment to GitHub Pages.

### Deployment Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

## ✨ Future Enhancements

1. Payment Gateway Integration
2. Real-time Order Tracking
3. Advanced Analytics Dashboard
4. Multi-language Support
5. PWA Implementation

---

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

👨‍💻 Developer
Developed with ❤️ by [Ruchit Doshi](https://github.com/RuchitDoshi30)
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

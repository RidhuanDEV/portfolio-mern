# Portfolio MERN Stack

Sebuah aplikasi portfolio lengkap dengan sistem autentikasi, menggunakan MERN stack (MongoDB, Express.js, React, Node.js). Aplikasi ini memungkinkan pengguna untuk membuat akun, login, mengelola profil, dan menampilkan proyek portfolio dengan fitur upload gambar melalui Cloudinary.

## Fitur Utama

- **Autentikasi Pengguna**: Registrasi, login, logout dengan JWT
- **Manajemen Profil**: Update informasi pengguna
- **Dashboard**: Halaman utama dengan informasi pengguna
- **Manajemen Proyek**: Tambah, edit, hapus proyek portfolio
- **Upload Gambar**: Integrasi dengan Cloudinary untuk upload gambar
- **Email Notification**: Menggunakan Mailtrap untuk email
- **Responsive Design**: Menggunakan Tailwind CSS dan Framer Motion
- **Security**: Helmet, CORS, rate limiting, CSRF protection

## Tech Stack

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Autentikasi
- **Bcryptjs** - Hashing password
- **Cloudinary** - Upload dan manajemen gambar
- **Mailtrap** - Email service
- **Multer** - File upload middleware
- **Helmet, CORS, Rate Limiting** - Security middleware

### Frontend

- **React** - Library UI
- **Vite** - Build tool dan dev server
- **React Router** - Routing
- **Zustand** - State management
- **Tailwind CSS** - CSS framework
- **Framer Motion** - Animasi
- **Axios** - HTTP client
- **React Hot Toast** - Notifikasi
- **Lucide React** - Icon library

## Prerequisites

Sebelum menjalankan aplikasi ini, pastikan Anda memiliki:

- **Node.js** (versi 20 atau lebih baru)
- **MongoDB** (lokal atau cloud seperti MongoDB Atlas)
- **Akun Cloudinary** (untuk upload gambar)
- **Akun Mailtrap** (untuk email testing)

## Installation

1. **Clone repository ini:**

   ```bash
   git clone <repository-url>
   cd uts-web-lanjut
   ```

2. **Install dependencies untuk backend:**

   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies untuk frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

## Setup Environment Variables

1. **Backend**: Salin file `.env.example` ke `.env` di folder `backend/` dan isi dengan nilai yang sesuai:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Isi file `.env` dengan:

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_here
   MAILTRAP_TOKEN=your_mailtrap_token_here
   CLIENT_URL=http://localhost:5173
   API_URL=http://localhost:5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. **Frontend**: Jika diperlukan, setup environment variables di `frontend/` (saat ini tidak ada .env di frontend).

## Running Locally

### Development Mode

1. **Jalankan backend:**

   ```bash
   cd backend
   npm run dev
   ```

   Server akan berjalan di `http://localhost:5000`

2. **Jalankan frontend (di terminal baru):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`

### Production Mode

1. **Build dan jalankan backend:**

   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## Build dan Deploy

### Menggunakan Docker

Aplikasi ini sudah dikonfigurasi dengan Docker untuk development dan production.

1. **Development dengan Docker:**

   ```bash
   # Backend
   cd backend
   docker build -t portfolio-backend:dev --target development .
   docker run -p 5000:5000 portfolio-backend:dev

   # Frontend
   cd frontend
   docker build -t portfolio-frontend:dev --target development .
   docker run -p 5173:5173 portfolio-frontend:dev
   ```

2. **Production dengan Docker:**

   ```bash
   # Backend
   cd backend
   docker build -t portfolio-backend:prod --target production .
   docker run -p 5000:5000 portfolio-backend:prod

   # Frontend
   cd frontend
   docker build -t portfolio-frontend:prod --target production .
   docker run -p 80:80 portfolio-frontend:prod
   ```

### Deploy ke Vercel

Aplikasi ini sudah dikonfigurasi untuk deploy ke Vercel.

1. **Setup akun Vercel** dan install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. **Deploy backend:**

   ```bash
   cd backend
   vercel --prod
   ```

3. **Deploy frontend:**

   ```bash
   cd frontend
   vercel --prod
   ```

4. **Environment Variables di Vercel:**
   - Untuk backend, set environment variables di dashboard Vercel sesuai dengan `.env`
   - Untuk frontend, set `VITE_API_URL` ke URL backend yang sudah di-deploy

### Deploy ke Platform Lain

- **Heroku**: Gunakan buildpack Node.js untuk backend, dan static build untuk frontend
- **Netlify**: Untuk frontend saja, dengan redirect API ke backend
- **Railway/DigitalOcean**: Gunakan Docker images yang sudah disediakan

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/logout` - Logout pengguna
- `GET /api/auth/me` - Get current user info

### User Routes

- `PUT /api/auth/update-profile` - Update profil pengguna

### Project Routes

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Upload Routes

- `POST /api/upload` - Upload file ke Cloudinary

### Home/About Routes

- `GET /api/home` - Get home data
- `PUT /api/home` - Update home data
- `GET /api/about` - Get about data
- `PUT /api/about` - Update about data

## Scripts

### Backend Scripts

- `npm run dev` - Jalankan development server dengan nodemon
- `npm start` - Jalankan production server
- `npm run build` - Install dependencies dan build frontend

### Frontend Scripts

- `npm run dev` - Jalankan development server Vite
- `npm run build` - Build untuk production
- `npm run lint` - Jalankan ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Contact

Jika ada pertanyaan, silakan buat issue di repository ini.

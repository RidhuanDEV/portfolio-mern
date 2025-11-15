# Portfolio MERN Stack

Sebuah aplikasi portfolio lengkap dengan sistem autentikasi, menggunakan MERN stack (MongoDB, Express.js, React, Node.js). Aplikasi ini memungkinkan pengguna untuk membuat akun, login, mengelola profil, dan menampilkan proyek portfolio dengan fitur upload gambar melalui Cloudinary dan file storage hybrid (local untuk development, Vercel Blob untuk production).

## Fitur Utama

- **Autentikasi Pengguna**: Registrasi, login, logout dengan JWT
- **Manajemen Profil**: Update informasi pengguna
- **Dashboard**: Halaman utama dengan informasi pengguna
- **Manajemen Proyek**: Tambah, edit, hapus proyek portfolio
- **Upload Gambar**: Integrasi dengan Cloudinary untuk upload gambar profil dan proyek
- **Upload CV**: Hybrid storage - local storage untuk development, Vercel Blob untuk production
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
- **Vercel Blob** - File storage untuk production (CV uploads)
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
- **Akun Vercel** (untuk file storage production - Vercel Blob)
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
   BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
   ```

   **Catatan untuk BLOB_READ_WRITE_TOKEN:**

   - Diperlukan untuk upload CV ke Vercel Blob di production
   - Dapatkan token dari Vercel Dashboard → Storage → Blob → Create Token
   - Untuk development lokal, token ini tidak wajib (akan menggunakan local storage)

2. **Frontend**: Jika diperlukan, setup environment variables di `frontend/` (saat ini tidak ada .env di frontend).

## Setup Vercel Blob (untuk Production)

Aplikasi ini menggunakan **hybrid storage** untuk upload CV:

- **Development**: File disimpan di local storage (`backend/uploads/cv/`)
- **Production**: File diupload ke Vercel Blob (1GB free tier)

### Setup Vercel Blob:

1. **Login ke Vercel Dashboard**
2. **Pergi ke Storage → Blob**
3. **Create Store** (jika belum ada)
4. **Generate Token**:
   - Klik store yang sudah dibuat
   - Pergi ke tab "Tokens"
   - Create new token dengan permission "Read/Write"
   - Copy token dan paste ke `BLOB_READ_WRITE_TOKEN` di environment variables

### Cara Kerja Hybrid Storage:

- Aplikasi secara otomatis mendeteksi environment (`NODE_ENV` atau `VERCEL`)
- Development: CV disimpan di folder `backend/uploads/cv/`
- Production: CV diupload ke Vercel Blob dan URL disimpan di database
- Frontend dapat mendownload dari kedua sumber (local path atau Vercel Blob URL)

## Seeding Database

Untuk mengisi database dengan data awal (user, home, about, projects), jalankan:

```bash
cd backend
npm run seed
```

Ini akan membuat:

- User dengan email `ridhuandf1@gmail.com` dan password `password123`
- Data home, about, dan 6 sample projects

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

Aplikasi ini sudah dikonfigurasi untuk deploy ke Vercel dengan hybrid storage support.

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
   - **PENTING**: Pastikan `BLOB_READ_WRITE_TOKEN` sudah diset untuk upload CV di production
   - Untuk frontend, set `VITE_API_URL` ke URL backend yang sudah di-deploy

5. **Setup Vercel Blob di Production:**
   - Setelah deploy backend, pastikan `BLOB_READ_WRITE_TOKEN` sudah dikonfigurasi
   - Jika belum ada store Vercel Blob, buat store baru di Vercel Dashboard
   - Generate token dengan permission Read/Write
   - Update environment variable di Vercel project settings

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
- `PUT /api/home` - Update home data (termasuk upload CV dengan hybrid storage)

### Home/About Routes

- `GET /api/home` - Get home data
- `PUT /api/home` - Update home data (support upload CV dengan hybrid storage)
- `GET /api/about` - Get about data
- `PUT /api/about` - Update about data

## Scripts

### Backend Scripts

- `npm run dev` - Jalankan development server dengan nodemon
- `npm start` - Jalankan production server
- `npm run build` - Install dependencies dan build frontend
- `npm run seed` - Seed database dengan data awal

### Frontend Scripts

- `npm run dev` - Jalankan development server Vite
- `npm run build` - Build untuk production
- `npm run lint` - Jalankan ESLint
- `npm run preview` - Preview production build

## Troubleshooting

### Upload CV tidak berfungsi di Production

**Masalah**: CV tidak bisa didownload setelah deploy ke Vercel

**Solusi**:

1. Pastikan `BLOB_READ_WRITE_TOKEN` sudah diset di Vercel environment variables
2. Periksa apakah Vercel Blob store sudah dibuat dan token memiliki permission Read/Write
3. Upload ulang CV setelah setup token - file lama mungkin corrupt

### File Storage

**Development**: CV disimpan di `backend/uploads/cv/` (local storage)
**Production**: CV diupload ke Vercel Blob dengan URL public

Frontend secara otomatis mendeteksi dan menangani kedua jenis storage.

### Environment Detection

Aplikasi menggunakan logika berikut untuk menentukan storage:

```javascript
const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
```

## Contributing

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Changelog

### v2.0.0 - Hybrid Storage Update

- ✅ Migrasi upload CV dari Cloudinary ke hybrid storage
- ✅ Local storage untuk development
- ✅ Vercel Blob untuk production
- ✅ Auto-detection environment
- ✅ Improved error handling untuk file uploads

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Contact

Jika ada pertanyaan, silakan buat issue di repository ini.

**Author**: Ridhuan Rangga Kusuma
**Email**: ridhuandf1@gmail.com
**GitHub**: [@RidhuanDEV](https://github.com/RidhuanDEV)

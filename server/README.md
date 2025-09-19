# OnlineShop Backend

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install MongoDB:

- Windows: Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud)

3. Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/onlineshop
JWT_SECRET=your_super_secret_jwt_key_here
PORT=4000
```

4. Start MongoDB service:

```bash
# Windows
net start MongoDB

# Or start manually
mongod
```

5. Run the server:

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

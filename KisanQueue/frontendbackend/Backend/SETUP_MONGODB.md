# Quick MongoDB Setup

## 1. Go to MongoDB Atlas

https://www.mongodb.com/cloud/atlas

## 2. Create a free cluster

- Click "Build a Database"
- Select "FREE" tier
- Choose your region

## 3. Create Database User

- Username: admin
- Password: yourpassword

## 4. Add IP Address

- Click "Add IP Address"
- Select "Allow Access from Anywhere" (0.0.0.0/0)

## 5. Get Connection String

- Click "Connect"
- Select "Connect your application"
- Copy the connection string

## 6. Update .env

Replace YOUR_USERNAME and YOUR_PASSWORD with your credentials

## 7. Seed Data

npm run seed

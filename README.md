Bangalore Pincode Explorer

A full-stack web app for searching Bangalore pincodes and area names using live India Post data.

The app allows users to:

search pincodes and localities
browse Bangalore postal zones
filter and explore pincode data
view backend API endpoints and stats

Built using React, Node.js, and Express with live India Post API integration.

API Used

India Post API
https://api.postalpincode.in

Tech Stack

Frontend

React
Vite
CSS

Backend

Node.js
Express.js

Packages

Axios
Helmet
CORS
express-rate-limit
node-cache
concurrently

Features

Pincode → Area lookup
Area → Pincode lookup
Zone distribution overview
Cached API responses
Rate limiting
Search and filtering
Pagination
REST API reference section

Run Locally

1. Clone the repository

git clone https://github.com/Rizeria14/PincodeExplorer.git

cd pincode-explorer

2. Install dependencies

npm install

npm run install:all

3. Start both frontend and backend servers

npm run dev

Frontend runs on:

http://localhost:5173

Backend runs on:

http://localhost:5000

API Endpoints

GET /api/health

GET /api/pincodes

GET /api/pincode/:pin

GET /api/search/area

GET /api/zones

GET /api/stats


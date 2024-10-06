const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config();
const cors = require('cors');
const path = require('path')
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoute = require('./routes/messageRoutes');
const { server, app } = require('./socket/socket');
// middelwares
// app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


const PORT = process.env.PORT || 5000;
//const __dirname=path.resolve();

const runServer = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
  
      const PORT = process.env.PORT || 5000; // Default to port 5000 if PORT is not defined
      server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error connecting to MongoDB or starting server:', error);
    }
  };
  
  runServer();
  
//routes
app.use(cors({
    origin: 'http://localhost:3000', // Update to your frontend URL
    credentials: true // Allow cookies
}));

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/messages', messageRoute)


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}
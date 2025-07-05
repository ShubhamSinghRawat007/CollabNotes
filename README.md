# CollabNotes - Real-time Collaborative Note-taking App

# ==========================================

## 🌐 Live Demo

👉 [Click here to view the live app](https://collabnotes.vercel.app)

## ✨ Features

### Real-time Collaboration
- **Live editing** with instant updates across all clients
- **Presence indicators** showing active collaborators
- **Socket.IO** for seamless real-time communication

### Note Management
- **Clean, distraction-free** editor interface
- **Automatic saving** with manual save option
- **Last updated** timestamp
- **Recent notes** preview

### Modern UI/UX
- **Sleek, professional** interface with dark/light mode
- **Responsive design** works on all devices
- **Smooth animations** and transitions

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| Tailwind CSS | Modern styling |
| Framer Motion | Animations |
| Socket.IO client | Real-time updates |
| React Router | Navigation |
| date-fns | Date formatting |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| Socket.IO | Real-time server |

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShubhamSinghRawat007/CollabNotes.git
   cd collab-notes


2. **Setup the backend**
   ```bash
   cd server
   cp .env.example .env
   # Open the .env file and add your MongoDB URI and PORT, e.g.:
   # MONGODB_URI="your_mongodb_uri_here"
   # PORT=5000
   # CLIENT_URL=http://localhost:5173
   npm install
   npm run dev
    ```

3. **Setup the frontend**
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your API URL
    # VITE_API_URL="http://localhost:5000"
   npm install
   npm run dev
   ```

# Wardrobe

Wardrobe is an AI-driven application designed to provide personalized clothing suggestions. It leverages advanced machine learning and user-specific data to generate unique style recommendations.

---

## Features

- **AI Integration**: Powered by Mira SDK to generate the best styles tailored to your preferences.
- **Authentication**: Seamlessly integrates Google Authentication for secure and hassle-free sign-ins.
- **Database Management**: Utilizes Supabase for efficient storage and management of user data.
- **Personalized Suggestions**: Input your age, height, skin tone, and color preferences to receive curated clothing recommendations.

---

## Installation and Setup

### Prerequisites
1. **Node.js**: Ensure Node.js is installed on your system for frontend development.
2. **Python**: Required for backend functionality.

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wardrobe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev --legacy-peer-deps
   ```

### Backend Setup
1. Navigate to the backend folder (if separate).
2. Run the backend server:
   ```bash
   python -u ./wardrobe-test.py
   ```

---

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Python
- **Authentication**: Google Authentication via Supabase
- **AI SDK**: Mira SDK
- **Database**: Supabase

---

## Usage
1. Open the application in your browser (default: `http://localhost:3000`).
2. Log in using your Google account.
3. Enter your personal details such as age, height, skin tone, and color preferences.
4. Click the "Give me Clothing Suggestions" button to get AI-generated style recommendations.

---

## Development Commands

- **Frontend Development**:
  ```bash
  npm run dev --legacy-peer-deps
  ```

- **Backend Development**:
  ```bash
  python -u ./wardrobe-test.py
  ```

---

## Screenshots
![image](https://github.com/user-attachments/assets/7e9e84d2-e3b4-41f1-9cdf-90b887133f6f)


---

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added a new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

---

## License
This project is licensed under the MIT License.

---

## Acknowledgments
- **Mira SDK** for providing robust AI integration.
- **Supabase** for database and authentication solutions.
- **Google** for secure authentication services.

---

## Contact
For any queries, please contact the project maintainer at [moodyadi30@gmail.com].


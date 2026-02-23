
---

## **How It Works**

1. **Registration:**  
   - User submits name, email, and password.  
   - Backend hashes the password and stores it in MongoDB.  

2. **Login:**  
   - User enters email & password.  
   - Backend compares password with the hashed version in MongoDB.  
   - If matched → login successful; otherwise → error message.

3. **Frontend Interaction:**  
   - React frontend calls backend APIs using **Axios or Fetch**.  
   - Handles forms, validations, and shows messages dynamically.

---

## **Technologies Used**

| Layer      | Technology |
|------------|------------|
| Frontend   | React.js, HTML, CSS, Bootstrap |
| Backend    | Node.js, Express.js, bcrypt, CORS |
| Database   | MongoDB Atlas / Local MongoDB |
| Version Control | Git & GitHub |

---

## **Future Improvements**

- JWT authentication for session management  
- Forgot password / reset password 
- Deployment on Vercel
- User roles (admin, user)  
-----------------------------------------------------------------------------------------------------------
  backend link:https://reg-log-umber.vercel.app/
  frontend link:https://register-login-using-credentials-fo.vercel.app/

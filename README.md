1.	Create project named ‘mlm-assessment’ using MERN stack
2.	Created backend and frontend two folders.
3.	Frontend folders having React JS codes for users to Register ,Login,Logout, Join for MLM and for showing tree Tree components. User data session from frontend maintained by localStorage of browser. Frontend folder structure
 

4.	Created routes folder for protecting frontend API’s to directly run from browser having Private and Public routes codes.
5.	For session from backend used jsonwebtoken and a cookie. Backend routes are protected by middleware kept utils folder.
6.	Go to frontend  folder first run “npm install” then and run “npm start”. 
7.	Same for backend folder first run “npm install” then and run “npm start”. Backend folders structure
 
8.	For MLM feature only registered  user can join a member for MLM. After that his first child will create left and right because starting person for MLM will have only to join a user the that user then create their left and right and their children left and right and so on. 
9.	There are @mui/material snackbars are implemented for showing animated success and failures.
10.	Proper validations are attached for all pages using formik and yup library for schema validation as well as in line errors with some conditions.
11.	A proper tree is making under users for MLM purpose. First user only can join a person for MLM marketing after that their role is finished, I already explained above.
12.	Context API is used for managing users state.
13.	To create jwt token openssl and run command rand –base64 32 from there, or you can use to create your own way to create jwt token and placed it to .env file of your backend root. 
14.	If you want to connect mongo cloud use following url string 
DB_URL = `mongodb+srv://${username}:${password}@cluster0.xx7bo1e.mongodb.net/mlm?retryWrites=true&w=majority`
Just replace your username and password or currently it is connecting to local Mongo dB database.


# Clubhouse

🔗 [Live Preview](https://fiscal-xaviera-fagacodes-2438f922.koyeb.app)

## Introduction
This project is part of **The Odin Project** curriculum. The goal is to build an exclusive clubhouse where members can create and share posts. 

- Inside the clubhouse, members can see the authors of posts.  
- Outside the clubhouse, only the content of posts is visible, keeping the author and timestamp anonymous.  

The project focuses on practicing **authentication, authorization, and database skills** while handling different user roles.

## Features
- **User Authentication**  
  - Secure sign-up with validation, sanitized inputs, and password hashing via **bcrypt**.  
  - Login system implemented with **passport.js**.  
  - Confirm password validation on registration.

- **Membership System**  
  - Users are not members by default.  
  - Membership is granted only after entering a **secret passcode**.  
  - Members can see the authors and timestamps of messages.
  - Admins can see the authors and timestamps of messages and are able to delete messages.

## Tech Stack
- **Backend**: Node.js, Express.js  
- **Authentication**: Passport.js  
- **Database**: PostgreSQL  
- **Password Security**: bcrypt  
- **Templating**: EJS  

## Future improvements
- Allow users to edit their own messages.  
- Add a comments or replies system for posts.  
- Send confirmation emails upon sign-up for account verification.

# Deployment Guide for Freelancer Backend

## Overview
This guide helps you deploy the Freelancer backend on Vercel and Render with minimal effort and ensures production readiness.

---

## Prerequisites
- Node.js installed locally for testing.
- An account on Vercel and/or Render.
- Access to your database connection string and other secrets.

---

## Environment Variables
Create a `.env` file in the `freelancerBackend` directory by copying `.env.example` and filling in the required values:

```
cp .env.example .env
```

Set the following environment variables on your deployment platform (Vercel or Render):

- `PORT` (optional, default 5000)
- `MONGODB_URI` (your MongoDB connection string)
- `JWT_SECRET` (your JWT secret key)
- `CORS_ORIGIN` (comma-separated list of allowed origins)
- Any other variables used in `.env.example`

---

## Deployment on Vercel

1. Ensure `vercel.json` is configured to use `api/index.js` as the serverless function entry point.
2. Push your code to a Git repository connected to Vercel.
3. In Vercel dashboard, set the environment variables as above.
4. Deploy the project. Vercel will run `npm install` automatically.
5. The backend will be available as serverless functions.

---

## Deployment on Render

1. Ensure `render.yaml` is configured with:
   - `buildCommand: npm install`
   - `startCommand: npm start`
2. Push your code to a Git repository connected to Render.
3. In Render dashboard, set the environment variables as above.
4. Deploy the service. Render will run `npm install` and start the server using `src/server.js`.
5. The backend will be available as a web service.

---

## Testing After Deployment

Test the following key endpoints:

- User: `/api/v1/users/register`, `/login`, `/logout`, `/update_details`
- Task: `/api/v1/tasks/create-task`, `/browse-task`
- Message: `/api/v1/messages_route/create-conversation`, `/get-all-conversations`, `/send-message`

Use tools like Postman or Curl to verify:

- Successful responses on valid requests.
- Proper error handling on invalid inputs.
- Authentication flows for protected routes.

---

## Troubleshooting

- Ensure environment variables are correctly set.
- Check logs on Vercel or Render dashboards for errors.
- Verify database connectivity.
- Confirm CORS origins are correctly configured.

---

## Additional Recommendations

- Keep `.env` out of version control.
- Use secure secrets management on deployment platforms.
- Monitor logs and performance regularly.

---

This guide should help you deploy and maintain your backend with minimal manual steps.

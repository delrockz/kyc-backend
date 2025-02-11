Tech Stack: `Express, Node, MongoDB Atlas, AWS S3, AWS Cognito, AWS Lambda, AWS IAM, AWS API Gateway, AWS CloudFormation (IAC), TypeScript`

APIs:
- User or admin can signup & login.
- User can submit KYC details for review.
- Admin can view KYC submissions, see overview of number of users, pending, approved & rejected KYC appliations.
- Admin can approve or reject a KYC submission.

Run development server:

```
npm install -g ts-node
npm install
nodemon app
```

# Database

- Used MongoDB Atlas, set environment variable DBPath with the connection string from Atlas

# AWS Pre-Requisites:

- AWS Cognito User Pool is created prior and AWS_USER_POOL_ID, AWS_USER_POOL_APP_CLIENT_ID env variables are set from it.
- A pre-signup trigger lambda function exists to auto confirm user + email linked to the User Pool.
- custom attribute custom:user_type field is added to Cognito User Pool to differentiate between 'Admin' and 'User'
- AWS S3 bucket is created with public-read ACL/bucket policy and AWS_S3_BUCKET_NAME environment variable is set.

# Some Pointers:

- Authentication and authorization is managed via AWS Cognito
- Files are uploaded to AWS S3
- Backend express server is deployed to AWS as a lambda function with the help of CloudFormation and serverless framework.
- Signup Password policy:
  at least 8 characters
  at least 1 number
  at least 1 special character
  at least 1 uppercase letter
  at least 1 lowercase letter

# Command for deploying the KYC Application API serverless lambda function and API

    	npm run build
        sam build
        cp package.json .\.aws-sam\build\KYCApplicationAPILambda\
        cd .\.aws-sam\build\KYCApplicationAPILambda\
        npm i
        cd ../../../
        sam deploy --guided

AWS Serverless Ticketing System

A serverless IT ticketing application built on AWS, featuring RESTful CRUD operations, API key access control, input validation, email notifications, application monitoring, a web-based frontend and automated CI/CD deployment.

This project demonstrates practical implementation and integration of AWS managed services to build, deploy, monitor and maintain a serverless application.

Project Overview

Project type: Personal AWS Cloud Portfolio Project
AWS Region: Asia Pacific (Sydney) – "ap-southeast-2"
Application: IT Ticketing System
Architecture: Serverless, event-driven application

Project Roadmap
## 📋 Project Roadmap

- ✅ Phase 1: Foundation & IAM Configuration
- ✅ Phase 2: Serverless Compute & API Gateway
- ✅ Phase 3: API Security & Validation
- ✅ Phase 4: CloudWatch Alarms & Dashboard
- ✅ Phase 5: Web Frontend with S3 + CloudFront
- ✅ Phase 6: Amazon SNS Email Notifications
- ✅ Phase 7: CI/CD with CodePipeline & CodeBuild
- 🔄 Phase 8: Security Hardening, Infrastructure as Code & Operational Enhancements

Architecture Components

Layer| AWS Service| Purpose
Frontend| Amazon S3| Static website hosting
Content Delivery| Amazon CloudFront| Frontend distribution and caching
API| Amazon API Gateway| REST API endpoints
Compute| AWS Lambda| Backend application logic
Database| Amazon DynamoDB| Ticket data storage
Notifications| Amazon SNS| Email notifications
Monitoring| Amazon CloudWatch| Dashboards, metrics and alarms
CI/CD| AWS CodePipeline| Automated deployment workflow
Build| AWS CodeBuild| Application packaging and deployment
Security| AWS IAM| Resource permissions and execution roles

Architecture & Implementation Progress

Phase 1 – Foundation & IAM Configuration ✅

IAM Execution Role

- Created a dedicated Lambda execution role.
- Configured DynamoDB read and write permissions for backend operations.

DynamoDB

- Created DynamoDB table: "ticketing-table".
- Configured the table with:
  - Partition key: "ticketId" (String)
  - Sort key: "createdAt" (String)

The table stores ticket records and supports the application's CRUD operations.

Phase 2 – Serverless Compute & API Gateway ✅

AWS Lambda

Created four Lambda functions using Node.js 24.x:

Lambda Function| Responsibility
"ticketing-create"| Create new tickets
"ticketing-get"| Retrieve ticket records
"ticketing-update"| Update existing tickets
"ticketing-delete"| Delete ticket records

Each function handles a specific operation against DynamoDB.

Amazon API Gateway

- Created a REST API named "ticketing-api".
- Integrated API Gateway routes with their respective Lambda functions.
- Deployed the API to the "prod" stage.

API Routes

Method| Endpoint| Operation
POST| "/tickets"| Create ticket
GET| "/tickets"| Retrieve all tickets
GET| "/tickets/{ticketId}"| Retrieve individual ticket
PUT| "/tickets/{ticketId}"| Update ticket
DELETE| "/tickets/{ticketId}"| Delete ticket

Phase 3 – API Security & Input Validation ✅

API Key Authentication

- Configured API Gateway API key authentication.
- Created API usage plan: "ticketing-usage-plan".
- Associated the API key with the usage plan.

Input Validation

- Implemented required-field validation for ticket creation.
- Validated allowed priority values:
  - "low"
  - "medium"
  - "high"
- Invalid requests return HTTP "400" responses.

Simplified Ticket Operations

- GET, UPDATE and DELETE operations use "ticketId" to identify records.
- The "createdAt" sort key is looked up automatically.

Phase 4 – CloudWatch Monitoring & Alarms ✅

Implemented application monitoring using Amazon CloudWatch.

CloudWatch Dashboard

Created dashboard: "ticketing-dashboard".

Configured four monitoring widgets:

1. Lambda Errors – monitors all four Lambda functions.
2. Lambda Throttles – monitors throttling across all four functions.
3. Lambda Duration – tracks Lambda execution duration.
4. API Gateway Metrics – monitors 4XX errors, 5XX errors and request count.

CloudWatch Alarms

Configured 10 alarms:

Alarm| Condition
"ticketing-create-errors"| Lambda Errors > 0 per 5 minutes
"ticketing-get-errors"| Lambda Errors > 0 per 5 minutes
"ticketing-update-errors"| Lambda Errors > 0 per 5 minutes
"ticketing-delete-errors"| Lambda Errors > 0 per 5 minutes
"ticketing-create-throttles"| Lambda Throttles > 0 per 5 minutes
"ticketing-get-throttles"| Lambda Throttles > 0 per 5 minutes
"ticketing-update-throttles"| Lambda Throttles > 0 per 5 minutes
"ticketing-delete-throttles"| Lambda Throttles > 0 per 5 minutes
"ticketing-api-4xx-errors"| API Gateway 4XX errors > 10 per 5 minutes
"ticketing-api-5xx-errors"| API Gateway 5XX errors > 10 per 5 minutes

Phase 5 – Web Frontend with S3 & CloudFront ✅

Deployed a static ticket management interface using Amazon S3 and CloudFront.

Amazon S3

- Created bucket: "ticketing-frontend-m-ar-my".
- Enabled static website hosting.
- Uploaded the frontend "index.html".

Amazon CloudFront

- Created CloudFront distribution to deliver the frontend.
- Configured CloudFront to distribute the static website.

Frontend Features

- Create tickets with title, priority and description.
- Display ticket records in a table.
- View ticket ID, title, description, priority, status and creation date.
- Delete tickets.
- Update ticket status.
- Refresh ticket listing.
- Display success and error messages.

CORS Configuration

- Configured OPTIONS mock integrations for "/tickets" and "/tickets/{ticketId}".
- Configured API Gateway default 4XX and 5XX responses with CORS headers.
- Updated all four Lambda functions to return CORS headers.

Issues Identified & Resolved

- Corrected frontend response parsing for API Gateway Lambda proxy responses.
- Resolved API key mismatch between the frontend and API Gateway.
- Updated Lambda responses to consistently include CORS headers.

Phase 6 – Amazon SNS Email Notifications ✅

Integrated Amazon Simple Notification Service (SNS) to provide automated email notifications for ticket operations.

SNS Configuration

- Created SNS topic: "ticketing-notifications".
- Region: "ap-southeast-2".
- Configured and confirmed email subscription.
- Added "SNS_TOPIC_ARN" environment variable to the three write-operation Lambda functions.

Lambda Integration

Lambda Function| Notification
"ticketing-create"| New Ticket Created
"ticketing-update"| Ticket Status Changed
"ticketing-delete"| Ticket Deleted

Frontend Enhancement

- Added ticket status dropdown.
- Supported statuses:
  - "open"
  - "in-progress"
  - "closed"
- Added Update button to submit status changes and trigger SNS notifications.

Issues Identified & Resolved

- Identified missing "SNS_TOPIC_ARN" environment variable in "ticketing-delete".
- Corrected the configuration to prevent successful deletion operations from producing misleading frontend failure messages.

Testing & Verification

- Created ticket and received email notification.
- Updated ticket status and received email notification.
- Deleted ticket and received email notification.

Phase 7 – CI/CD Automation with CodePipeline & CodeBuild ✅

Implemented an automated deployment workflow integrated with GitHub.

AWS CodePipeline

- Created pipeline: "ticketing-backend-pipeline".
- Connected GitHub through AWS CodeConnections using GitHub App integration.
- Configured the pipeline to monitor changes pushed to the "main" branch.

AWS CodeBuild

- Created build project: "ticketing-backend-build".
- Configured deployment automation for both frontend and backend application components.

Backend Deployment

- Packages Lambda source code into ZIP deployment packages.
- Deploys updated code to the respective Lambda functions.
- Supports deployment of the four ticketing Lambda functions.

Frontend Deployment

- Synchronises frontend files from the "frontend/" directory to the S3 bucket.
- Automatically invalidates the CloudFront cache to make updated frontend content available.

IAM Configuration

- Created inline policy: "CodeBuild-S3-CloudFront-Policy".
- Configured the CodeBuild service role with the required S3 and CloudFront invalidation permissions.

Pipeline Trigger Configuration

- Configured trigger filtering to exclude "README.md" changes.
- Documentation-only commits do not trigger application deployment.

Deployment Verification

- Pushed changes to GitHub "main" branch.
- Verified automatic pipeline execution.
- Verified frontend synchronisation to S3.
- Verified CloudFront cache invalidation.
- Verified backend Lambda code deployment.
- Confirmed that README-only commits do not trigger deployment.

Frontend Deployment Indicator

Added an application banner to indicate automated deployment:

«🚀 Deployed via AWS CodePipeline — CI/CD is live!»

Testing & Verification

The application has undergone functional testing using "curl" and the deployed web frontend.

API Testing

Operation| Expected Result| Status
Create ticket| HTTP 201, UUID and timestamp returned| Verified
Retrieve all tickets| HTTP 200 with ticket records| Verified
Retrieve individual ticket| HTTP 200 with ticket details| Verified
Update ticket| HTTP 200 with updated fields| Verified
Delete ticket| HTTP 200; subsequent GET returns 404| Verified
Missing required fields| HTTP 400 validation error| Verified
Invalid priority value| HTTP 400 validation error| Verified

Email Notification Testing

Operation| Notification Result
Create ticket| Email received
Update ticket| Email received
Delete ticket| Email received

CI/CD Testing

- GitHub push triggers automated deployment.
- Frontend deployment verified.
- Backend Lambda deployment verified.
- CloudFront invalidation verified.
- README-only commit exclusion verified.

Screenshots & Demonstrations

Screenshots and implementation evidence can be added here as the project documentation develops.

Suggested evidence:

- AWS architecture and service configuration.
- DynamoDB table structure and sample records.
- Lambda function configuration.
- API Gateway routes and usage plan.
- CloudWatch dashboard and alarms.
- SNS notification email examples.
- Ticket management frontend.
- Successful CodePipeline execution and deployment logs.

Future Improvements & Best Practice Implementation

The current implementation demonstrates a functional serverless application. The following improvements have been identified to strengthen security, maintainability, reliability and deployment practices.

1. Security & Authentication

- Replace frontend-embedded API key authentication with Amazon Cognito or another suitable authentication mechanism.
- Review API Gateway authorization and access-control configurations.
- Restrict CORS allowed origins to the designated frontend domain instead of using wildcard origins.
- Review IAM permissions and apply least-privilege access across Lambda execution roles and deployment services.
- Ensure sensitive configuration and credentials are not exposed in frontend code or source control.

2. Infrastructure as Code (IaC)

- Introduce AWS SAM, AWS CloudFormation or Terraform.
- Define Lambda functions, API Gateway routes, DynamoDB, SNS, IAM roles and monitoring resources as code.
- Establish repeatable deployment procedures across development and production environments.

3. CI/CD Enhancement

- Extend the existing pipeline to manage infrastructure deployment.
- Introduce automated build and validation stages.
- Implement automated testing before deployment.
- Consider deployment approval and rollback mechanisms.

4. Monitoring & Operational Visibility

- Improve CloudWatch monitoring with structured application logs.
- Introduce correlation identifiers for request tracing.
- Review alarm thresholds and notification mechanisms.
- Evaluate AWS X-Ray for distributed tracing and troubleshooting.

5. Application Reliability & Data Management

- Improve error handling and logging across Lambda functions.
- Review DynamoDB access patterns and scalability considerations.
- Introduce pagination for ticket listing.
- Consider conditional writes and concurrency handling for ticket updates.
- Review SNS notification failure handling and retry mechanisms.

6. Cost Management

- Monitor AWS service usage and estimated monthly costs.
- Review CloudWatch log retention and alarm configurations.
- Establish resource cleanup and teardown procedures for unused environments.

Key AWS Resources

Resource| Name / Identifier
AWS Region| "ap-southeast-2"
DynamoDB Table| "ticketing-table"
SNS Topic| "ticketing-notifications"
API Gateway Usage Plan| "ticketing-usage-plan"
CodePipeline| "ticketing-backend-pipeline"
CodeBuild Project| "ticketing-backend-build"
S3 Frontend Bucket| "ticketing-frontend-m-ar-my"
CloudFront Distribution| "E14F4HU4QKQRU9"

API Endpoint:
https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod

Frontend URL:
https://d2akoriob20egl.cloudfront.net

Tools & Technologies

- Amazon Web Services (AWS)
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- AWS Identity and Access Management (IAM)
- Amazon S3
- Amazon CloudFront
- Amazon SNS
- Amazon CloudWatch
- AWS CodePipeline
- AWS CodeBuild
- GitHub
- Node.js 24.x
- JavaScript
- REST API
- cURL

Development Approach & Learning

This project was developed as a hands-on AWS learning and portfolio exercise.

AWS Assist was used to support code generation, refinement and implementation guidance. The project architecture, AWS service configuration, resource integration, deployment setup, functional testing and troubleshooting were carried out as part of the practical implementation process.

The project focuses on understanding how individual AWS services work together to deliver a complete serverless application, including application deployment, monitoring, security considerations and operational improvements.

The future improvement roadmap reflects identified limitations and areas for further implementation. Not all proposed improvements have been completed.

---

Project Status: Seven implementation phases completed. Further security, infrastructure automation and operational enhancements remain in the roadmap.

## 📋 Project Roadmap
- ✅ Phase 1: Foundation & IAM Configuration
- ✅ Phase 2: Compute & API
- ✅ Phase 3: API Security & Validation
- ✅ Phase 4: CloudWatch Alarms & Dashboard
- ✅ Phase 5: Web Frontend with S3 + CloudFront
- ✅ Phase 6: Amazon SNS Email Notifications
- ✅ Phase 7: CI/CD with CodePipeline & CodeBuild
- 🔄 Phase 8: Security Hardening, Infrastructure as Code & Operational Enhancements

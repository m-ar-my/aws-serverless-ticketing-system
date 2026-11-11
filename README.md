# Ticketing System — AWS Serverless Backend

A serverless IT ticketing backend built on AWS featuring full CRUD operations, API key security, and input validation.

## 🏗️ Architecture & Progress

### Phase 1 — Foundation ✅
* **IAM Role:** Created a Lambda execution role with DynamoDB read/write permissions.
* **DynamoDB Table:** Created `tickets` table with `ticketId` as the partition key.
* Table name: ticketing-table
*Partition key: ticketId (S)
*Sort key: createdAt (S)
*API endpoint: https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod
*Routes: POST /tickets, GET /tickets, GET /tickets/{ticketId}, PUT /tickets/{ticketId}, DELETE /tickets/{ticketId}

### Phase 2 — Compute & API ✅
* **Lambda Functions:** Created 5 functions (`create`, `get`, `list`, `update`, `delete`) using Node.js, each handling a specific CRUD operation against DynamoDB.
* **API Gateway:** Created a REST API with full CRUD routes mapped to each Lambda function, deployed to a `prod` stage:
  * `POST /tickets`
  * `GET /tickets`
  * `GET /tickets/{ticketId}`
  * `PUT /tickets/{ticketId}`
  * `DELETE /tickets/{ticketId}`

### Phase 3 — Security & Validation ✅
* **API Key Authentication:** All endpoints secured with an API key via API Gateway usage plan.
* **Input Validation:** Lambda functions validate required fields (`title`) and allowed values (`priority`: `low`, `medium`, `high`), returning `400` errors for invalid requests.

### 🧪 Tested & Verified
* Missing required fields → `400` validation error
* Invalid field values → `400` validation error
* Valid ticket creation → `201` with UUID, timestamp, and default `status: open`

## 📋 Roadmap (Still To Do)
* [ ] **Phase 4:** CloudWatch Alarms & Dashboard
* [ ] **Phase 5:** Frontend on S3 + CloudFront
* [ ] **Phase 6:** SNS/SES Notifications
* [ ] **Phase 7:** CI/CD with CodePipeline

# Ticketing System - AWS Serverless Backend

A serverless IT ticketing backend built on AWS featuring full CRUD operations, API key security, and input validation.

## 🏗️ Architecture & Progress

### Phase 1 - Foundation ✅
* **IAM Role:** Created a Lambda execution role with DynamoDB read/write permissions.
* **DynamoDB Table:** Created `ticketing-table` with `ticketId` as the partition key.
  * Table name: `ticketing-table`
  * Partition key: `ticketId` (S)
  * Sort key: `createdAt` (S)
  * API endpoint: https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod
  * Routes: POST /tickets, GET /tickets, GET /tickets/{ticketId}, PUT /tickets/{ticketId}, DELETE /tickets/{ticketId}

### Phase 2 - Compute & API ✅
* **Lambda Functions:** Created 4 functions (`ticketing-create`, `ticketing-get`, `ticketing-update`, `ticketing-delete`) using Node.js, each handling a specific CRUD operation against DynamoDB.
* **API Gateway:** Created a REST API with full CRUD routes mapped to each Lambda function, deployed to a `prod` stage:
  * `POST /tickets`
  * `GET /tickets`
  * `GET /tickets/{ticketId}`
  * `PUT /tickets/{ticketId}`
  * `DELETE /tickets/{ticketId}`

### Phase 3 - Security & Validation ✅
* **API Key Authentication:** All endpoints secured with an API key via API Gateway usage plan (`ticketing-usage-plan`).
* **Input Validation:** Lambda functions validate required fields (`title`) and allowed values (`priority`: `low`, `medium`, `high`), returning `400` errors for invalid requests.
* **GET/UPDATE/DELETE simplified:** `createdAt` looked up automatically - `ticketId` only needed.

### 🧪 Tested & Verified

**Validation errors:**
* Missing required fields → `400` validation error
* Invalid field values → `400` validation error

**CRUD operations (tested via curl):**

```bash
# Create ticket
curl -X POST https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod/tickets \
  -H "x-api-key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test ticket","description":"Testing","priority":"high"}'
# → 201 with UUID, timestamp, status: open

# Get all tickets
curl -X GET "https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod/tickets" \
  -H "x-api-key: <API_KEY>"
# → 200 with full ticket list

# Get single ticket
curl -X GET "https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod/tickets/{ticketId}" \
  -H "x-api-key: <API_KEY>"
# → 200 with ticket details

# Update ticket
curl -X PUT "https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod/tickets/{ticketId}" \
  -H "x-api-key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"status":"closed","priority":"low"}'
# → 200, allowed fields updated

# Delete ticket
curl -X DELETE "https://xkfvs4luk2.execute-api.ap-southeast-2.amazonaws.com/prod/tickets/{ticketId}" \
  -H "x-api-key: <API_KEY>"
# → 200, subsequent GET returns 404

### Phase 4 - Monitoring ✅
* **CloudWatch Dashboard:** Created `ticketing-dashboard` with 4 widgets:
  * Lambda Errors - all 4 functions
  * Lambda Throttles - all 4 functions
  * Lambda Duration - all 4 functions
  * API Gateway - 4XXError, 5XXError, Count for `ticketing-api`
* **CloudWatch Alarms:** Created 10 alarms (no actions yet - wired up in Phase 6):
  * `ticketing-create-errors` - Lambda Errors > 0 per 5 min
  * `ticketing-get-errors` - Lambda Errors > 0 per 5 min
  * `ticketing-update-errors` - Lambda Errors > 0 per 5 min
  * `ticketing-delete-errors` - Lambda Errors > 0 per 5 min
  * `ticketing-create-throttles` - Lambda Throttles > 0 per 5 min
  * `ticketing-get-throttles` - Lambda Throttles > 0 per 5 min
  * `ticketing-update-throttles` - Lambda Throttles > 0 per 5 min
  * `ticketing-delete-throttles` - Lambda Throttles > 0 per 5 min
  * `ticketing-api-4xx-errors` - API Gateway 4XXError > 10 per 5 min
  * `ticketing-api-5xx-errors` - API Gateway 5XXError > 10 per 5 min

### Phase 5 - Frontend on S3 + CloudFront ✅
* **S3 Bucket:** Static website hosting enabled, `index.html` uploaded with full ticketing UI.
* **CloudFront Distribution:** `E14F4HU4QKQRU9`
  * URL: https://d2akoriob20egl.cloudfront.net
* **CORS Configuration:**
  * OPTIONS mock integration on `/tickets` and `/tickets/{ticketId}`
  * Default 4XX and 5XX Gateway Responses include `Access-Control-Allow-Origin: *` headers
* **Frontend Features:**
  * Create ticket form (title, priority, description)
  * Ticket list table with ID, title, description, priority, status, created date
  * Delete button per ticket
  * Refresh button
  * Success/error message banners

## 📋 Roadmap
* [x] Phase 1: Foundation
* [x] Phase 2: Compute & API
* [x] Phase 3: Security & Validation
* [x] Phase 4: CloudWatch Alarms & Dashboard
* [x] Phase 5: Frontend on S3 + CloudFront
* [ ] Phase 6: SNS/SES Notifications
* [ ] Phase 7: CI/CD with CodePipeline

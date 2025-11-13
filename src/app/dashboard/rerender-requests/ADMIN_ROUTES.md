# Rerender Request Admin Routes

## Overview

Admin routes for managing rerender requests in the CMS.

## Routes

### 1. GET `/api/rerender-request/admin/all`

Get all rerender requests for admin display.

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "accountId": 123,
      "accountName": "John Doe",
      "renderId": 456,
      "renderName": "Render Name",
      "reason": "Incorrect Data",
      "userEmail": "user@example.com",
      "additionalNotes": "Optional notes",
      "status": "Pending",
      "hasBeenHandled": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### 2. GET `/api/rerender-request/admin/:id`

Get a single rerender request by ID with full details.

**Path Parameters:**

- `id` (number): The rerender request ID

**Response:**

```json
{
  "data": {
    "id": 1,
    "account": {
      "id": 123,
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe",
      "email": "account@example.com"
    },
    "render": {
      "id": 456,
      "name": "Render Name",
      "complete": true,
      "processing": false
    },
    "reason": "Incorrect Data",
    "userEmail": "user@example.com",
    "additionalNotes": "Optional notes",
    "status": "Pending",
    "hasBeenHandled": false,
    "userMeta": {},
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 3. PUT `/api/rerender-request/admin/:id/mark-handled`

Mark a rerender request as handled.

**Path Parameters:**

- `id` (number): The rerender request ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "hasBeenHandled": true,
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

## Schema Updates

Added new field to `rerender-request` content type:

- `hasBeenHandled` (boolean, default: false) - Tracks whether the request has been handled by admin

## Error Responses

All routes return standard error responses:

**400 Bad Request:**

```json
{
  "error": {
    "message": "Error description",
    "code": "VALIDATION_ERROR"
  }
}
```

**404 Not Found:**

```json
{
  "error": {
    "message": "Rerender request with ID X not found",
    "code": "NOT_FOUND"
  }
}
```

**500 Internal Server Error:**

```json
{
  "error": {
    "message": "Failed to fetch/update rerender request",
    "code": "INTERNAL_ERROR"
  }
}
```

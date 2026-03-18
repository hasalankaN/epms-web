# API Specification: Create Course

This document outlines the required data structure for the Course Creation API, based on the current frontend implementation and validation schemas.

## Endpoint Overview
- **Method**: POST
- **URL**: `/api/v1/admin/courses` (TBD)
- **Content-Type**: `application/json`

## Request Payload Structure

The payload is a combination of General Details, Fee Details, and Commission Details.

```json
{
  "general_details": {
    "name": "Diploma in Computing – Batch 02",
    "staff_members": ["uuid-1", "uuid-2"],
    "has_assessment": true,
    "course_type": "Diploma",
    "start_date": "2024-04-01T00:00:00.000Z",
    "end_date": "2024-10-01T00:00:00.000Z",
    "certificates": ["cert-uuid-1"],
    "category_id": "cat-uuid-1",
    "lecturer_id": "lec-uuid-1",
    "level": "Beginner",
    "language": "English",
    "lesson_duration_hours": 2,
    "hierarchy_type": "3 Tiers",
    "batch_id": "batch-uuid-1",
    "short_description": "Short summary of the course.",
    "long_description": "<h1>Detailed content...</h1>",
    "cover_image_url": "https://...",
    "intro_video_url": "https://..."
  },
  "fee_details": {
    "pricing_option": "Paid", 
    "fees": [
      {
        "amount": 50000.00,
        "duration_years": 1
      }
    ],
    "installments_enabled": true,
    "number_of_installments": 3,
    "installment_plans": [
      {
        "description": "First Installment",
        "amount": 20000.00
      },
      {
        "description": "Second Installment",
        "amount": 15000.00
      },
      {
        "description": "Third Installment",
        "amount": 15000.00
      }
    ]
  },
  "commission_details": {
    "referral": {
      "type": "Percentage",
      "value": 10.00,
      "team_value": 2.00
    },
    "lecturer": {
      "type": "Fixed",
      "value": 5000.00
    },
    "staff": {
      "type": "Percentage",
      "value": 5.00
    },
    "branch_staff": {
      "type": "Fixed",
      "value": 1000.00
    }
  }
}
```

## Data Fields & Validation Rules

### 1. General Details (`general_details`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Name of the course. |
| `staff_members` | String[] | Yes | Array of User IDs (Staff) assigned to the course. |
| `has_assessment` | Boolean | No | Whether the course has an assessment. |
| `course_type` | String | No | Enum: Workshop, Certificate, Diploma, HND, Degree, School, University, Exam Prep. |
| `start_date` | DateTime | No | Course start date. |
| `end_date` | DateTime | No | Course end date. |
| `certificates` | String[] | Yes | Array of Certificate Template IDs. |
| `category_id` | String | Yes | Course Category ID. |
| `lecturer_id` | String | Yes | User ID of the primary lecturer. |
| `level` | String | Yes | Enum: Beginner, Intermediate, Advanced, General. |
| `language` | String | Yes | Enum: English, Sinhala, Tamil. |
| `lesson_duration_hours` | Number | No | Duration per lesson in hours. |
| `hierarchy_type` | String | Yes | Enum: 3 Tiers, 4 Tiers, 5 Tiers. |
| `batch_id` | String | No | Batch UUID. |
| `short_description` | String | No | Plain text short summary. |
| `long_description` | String (HTML) | Yes | Rich text content for the course. |
| `cover_image_url` | String | No* | URL to the uploaded cover image. |
| `intro_video_url` | String | No* | URL to the uploaded introduction video. |

### 2. Fee Details (`fee_details`)

- **Rule**: If `pricing_option` is "Paid", at least one item in `fees` is required.
- **Rule**: If `installments_enabled` is true, `number_of_installments` must be between 2 and 6, and `installment_plans` must be populated.

| Field | Type | Description |
| :--- | :--- | :--- |
| `pricing_option` | String | Enum: Paid, Free. |
| `fees` | Array | Objects containing `amount` (Number) and `duration_years` (Number). |
| `installments_enabled` | Boolean | Whether to allow installment payments. |
| `number_of_installments` | Number | Max 6. |
| `installment_plans` | Array | Objects containing `description` (String) and `amount` (Number). |

### 3. Commission Details (`commission_details`)

Common structure for each commission type:
- `type`: String (Enum: Percentage, Fixed)
- `value`: Number

| Field | Description |
| :--- | :--- |
| `referral` | Includes `type`, `value`, and `team_value`. |
| `lecturer` | Includes `type` and `value`. |
| `staff` | Commission for office staff per enrollment. |
| `branch_staff` | Commission for branch staff per enrollment. |

---
**Notes for Backend**:
- Please confirm the image/video upload strategy (Direct upload to API or S3 Presigned URLs).
- Ensure consistency in snake_case naming for the API fields.

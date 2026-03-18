# API Specification: Create Batch

This document outlines the required data structure for the Batch Creation API, based on the current frontend implementation and validation schemas.

## Endpoint Overview
- **Method**: POST
- **URL**: `/api/v1/admin/batches` (TBD)
- **Content-Type**: `application/json`

## Request Payload Structure

The payload is a combination of General Details, Fee Details, and Commission Details.

```json
{
  "general_details": {
    "name": "Diploma in Computing – Batch 02",
    "branch_id": "branch-uuid-1",
    "language": "English",
    "batch_type": "Diploma",
    "staff_member_ids": ["uuid-1", "uuid-2"],
    "has_assignment": true,
    "category": "Online",
    "start_date": "2024-04-01T00:00:00.000Z",
    "end_date": "2024-10-01T00:00:00.000Z",
    "certificate_ids": ["cert-uuid-1"],
    "status": "Upcoming",
    "lecturer_id": "lec-uuid-1",
    "level": "Beginner",
    "hierarchy_type": "3 Tiers",
    "lesson_duration_hours": 2,
    "description": "Detailed summary of the batch.",
    "cover_image_url": "https://..."
  },
  "fee_details": {
    "pricing_option": "Paid", 
    "base_fees": [
      {
        "amount": 50000.00,
        "description": "Tuition Fee"
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
    ],
    "additional_fees": [
      {
        "amount": 2500.00,
        "duration_years": 1,
        "description": "Registration Fee"
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
| `name` | String | Yes | Name of the batch. |
| `branch_id` | String | Yes | UUID of the branch. |
| `language` | String | Yes | Enum: English, Sinhala, Tamil. |
| `batch_type` | String | Yes | Enum: Workshop, Certificate, Diploma, HND, Degree, School, University, Exam Prep. |
| `staff_member_ids` | String[] | Yes | Array of User IDs (Staff) assigned to the batch. |
| `has_assignment` | Boolean | No | Whether the batch has assignments. |
| `category` | String | Yes | Enum: Online, Offline. |
| `start_date` | DateTime | Yes | Batch start date. |
| `end_date` | DateTime | Yes | Batch end date. |
| `certificate_ids` | String[] | Yes | Array of Certificate Template IDs. |
| `status` | String | Yes | Enum: Active, Upcoming, Completed, Inactive. |
| `lecturer_id` | String | Yes | User ID of the primary lecturer. |
| `level` | String | Yes | Enum: Beginner, Intermediate, Advanced, General. |
| `hierarchy_type` | String | Yes | Enum: 3 Tiers, 4 Tiers, 5 Tiers. |
| `lesson_duration_hours` | Number | No | Duration per lesson in hours. |
| `description` | String | No | Detailed description of the batch. |
| `cover_image_url` | String | No | URL to the uploaded cover image. |

### 2. Fee Details (`fee_details`)

- **Rule**: If `pricing_option` is "Paid", at least one item in `base_fees` is required.
- **Rule**: If `installments_enabled` is true, `number_of_installments` must be between 2 and 5 (unlike Course which is 6), and `installment_plans` must be populated.

| Field | Type | Description |
| :--- | :--- | :--- |
| `pricing_option` | String | Enum: Paid, Free. |
| `base_fees` | Array | Objects containing `amount` (Number) and `description` (String). |
| `installments_enabled` | Boolean | Whether to allow installment payments. |
| `number_of_installments` | Number | Max 5. |
| `installment_plans` | Array | Objects containing `description` (String) and `amount` (Number). |
| `additional_fees` | Array | Objects containing `amount` (Number), `duration_years` (Number), and `description` (String). |

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
- Ensure consistency in snake_case naming for the API fields.
- Dates should be handled in ISO8601 format.

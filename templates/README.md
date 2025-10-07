# Email Templates Storage

This directory stores saved email templates as JSON files.

## Directory Structure

Each template is stored as a separate JSON file:
- `template-name.json` - Template file (auto-generated from name)

## Template Format

Each template file contains:
- **metadata**: Template information (id, name, description, category, timestamps)
- **blocks**: Array of EmailBlock objects

## Example Template

```json
{
  "metadata": {
    "id": "my-newsletter",
    "name": "My Newsletter",
    "description": "Weekly newsletter template",
    "category": "newsletter",
    "createdAt": "2024-10-07T12:00:00.000Z",
    "updatedAt": "2024-10-07T12:00:00.000Z"
  },
  "blocks": [
    {
      "id": "block-0",
      "type": "heading",
      "content": "Weekly Update",
      "settings": {}
    },
    {
      "id": "block-1",
      "type": "text",
      "content": "Here's what happened this week...",
      "settings": {}
    }
  ]
}
```

## Notes

- This directory is auto-created if it doesn't exist
- Templates are managed via the template API and hooks
- Do not manually edit template files unless necessary
- Backup this directory to preserve your templates

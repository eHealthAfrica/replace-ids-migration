replace-ids-migration
=====================

[![Build Status](https://travis-ci.org/eHealthAfrica/replace-ids-migration.svg)](https://travis-ci.org/eHealthAfrica/replace-ids-migration)

Replace all references to deprecated ids with current ids

Usage
-----

The migration script expects JSON input that matches a current doc with a list
of deprecated ids (like the output from `merge-docs`):

```json
[
  { "doc": { "_id": "current-id-123" }
  , "ids": ["old-id-345", "old-id-678"]
  }
]
```


Development
-----------

Run the tests from project root with:

```sh
npm test
```

---
Apache License 2.0

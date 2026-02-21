# TODO List

## Main features
### Store
[ ] finish store adapters logic setup:
  1. [ ] Get an overview of the store workflow (create a spec file with core principles, list of the different bricks (with links to their spec file) and a comprehensive graph of the data flows)
  2. [ ] Resolve the CategoryIcons issue on creating a new expense (probably linked to id aliasing as it worked properly before)
  3. [ ] check that the whole flow works by creating an event with expenses, participants, etc.
  4. [ ] check that data is correctly stored in local (keep only local adpater and refresh to check that data are kept)
  5. [ ] check that data is correctly stored in remote (keep only remote adpater and refresh to check that data are kept)
  6. [ ] Check each file for code conventions (no unnecessary comments, no unnecessary export, clear function goal, single responsibility, easy to test (no mock needed), etc.)
  7. [ ] Remove spec files

### Invite / Join
[ ] Create shared event links with QR codes
[ ] add signup (only available from joining process otherwise redirects to login page)
[ ] add invite page and joining process

### General
[ ] add payment confirmations when event is closed
[ ] add one day event (no program)
[ ] add participant group crud (for quick event creation)
[ ] add custom rules for categories
[ ] add private expenses / deposit (hidden from all participant outside of the shares + parallel distribution management to keep those secret)
[ ] Add data export functionality (CSV/JSON for expense reports)

## Other
[ ] Add participant permissions/roles (admin, viewer)
[ ] Add error boundary components for better error handling
[ ] Implement gesture controls (swipe to delete)
[ ] Add keyboard shortcuts for power users

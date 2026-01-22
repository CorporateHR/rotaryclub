<!-- 49d88e06-4b54-43a8-86e2-465689ee9d58 45d37760-6cd9-4c95-bc3e-3678fcd0c1c2 -->
# ClubTracker Application Implementation Plan

## Project Structure

```
rotary-attendance/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── navigation/       # Header, BottomNav, Sidebar
│   │   └── cards/           # StatCard, InfoBox, EventCard, etc.
│   ├── pages/
│   │   ├── auth/            # login, register, register-success
│   │   ├── member/          # All 20 member view pages
│   │   └── admin/           # All 11 admin view pages
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions, QR code utilities
│   ├── data/                # Mock data for localStorage
│   ├── styles/              # Global styles, theme variables
│   ├── App.jsx              # Main app router
│   └── main.jsx             # Entry point
├── package.json
└── vite.config.js
```

## Technology Stack

- **Framework**: React with Vite
- **Styling**: CSS Modules (primary) with global CSS for theme
- **QR Codes**: `qrcode.react` for generation, `react-qr-reader` or `html5-qrcode` for scanning
- **State**: Local component state with React Context for global app state (user, theme)
- **Routing**: React Router v6
- **Icons**: React Icons or similar
- **Date Handling**: date-fns or dayjs

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure

1. **Initialize Vite React project**

   - Set up Vite with React template
   - Install dependencies: react-router-dom, react-icons, qrcode.react, html5-qrcode, date-fns

2. **Create base structure**

   - Set up folder structure
   - Create global CSS with theme variables (colors, spacing, typography)
   - Set up CSS Modules configuration
   - Create theme constants file

3. **Build core reusable components**

   - `Button` (primary, secondary, success, danger variants)
   - `Card` (base card component)
   - `StatCard` (gradient purple background)
   - `InfoBox` (blue background, warning yellow)
   - `Badge` (success, warning, info, danger, purple)
   - `Avatar` (with initials generation)
   - `ProgressBar`
   - `Input`, `Textarea`, `Select`
   - `FilterChips`
   - `SearchBar`

4. **Navigation components**

   - `Header` (with role switcher: Login/Member/Admin)
   - `BottomNav` (Member: 6 tabs, Admin: 4 tabs)
   - `Sidebar` (for admin view)

5. **Context providers**

   - `AuthContext` (user state, login/logout)
   - `AppContext` (current view mode, navigation state)

### Phase 2: Authentication Pages (3 pages)

6. **Login Page** (`/login`)

   - Email/password form
   - Forgot password link
   - Demo credentials display
   - Navigation to register
   - Form validation
   - Mock authentication with localStorage

7. **Register Page** (`/register`)

   - Full registration form (name, email, phone, password, confirm)
   - Validation (8 char password, matching passwords)
   - Navigation to success page
   - Store pending registration in localStorage

8. **Registration Success Page** (`/register-success`)

   - Success checkmark icon
   - Account details card with pending status
   - Info box about approval process

### Phase 3: Member View Pages (20 pages)

9. **Member Home/Dashboard** (`/member/home`)

   - Welcome message with user name
   - Two stat cards (meetings attended, volunteer hours)
   - Next Meeting card
   - Upcoming Volunteer card
   - Quick Actions grid (4 buttons)
   - Bottom navigation

10. **Member Directory** (`/member/directory`)

    - Search functionality
    - Filter chips (All, Active, Board, New)
    - Member list with avatars, contact info, stats
    - Clickable phone numbers
    - Navigation to individual profiles

11. **Member Meetings** (`/member/meetings`)

    - Filter chips (Upcoming, Past, All Types)
    - Color-coded meeting cards
    - Meeting type indicators
    - Navigation to meeting detail

12. **Meeting Detail** (`/member/meetings/:id`)

    - Event information card
    - Agenda display
    - QR code check-in button
    - Navigation to scan QR

13. **Member Volunteers** (`/member/volunteers`)

    - Filter chips (Available, My Events, Past)
    - Volunteer event cards with capacity
    - Status badges
    - Navigation to signup/detail pages

14. **Volunteer Signup** (`/member/volunteers/signup/:id`)

    - Event details
    - Role selection cards (clickable)
    - Visual selection state
    - Confirm signup functionality

15. **Volunteer Signup Success** (`/member/volunteers/signup-success`)

    - Success confirmation
    - Event summary card
    - Next steps info box

16. **Volunteer Detail** (`/member/volunteers/:id`)

    - Event details with registration status
    - Description card
    - Other volunteers list
    - Cancel registration functionality

17. **Scan QR Code** (`/member/scan-qr`)

    - Camera preview integration (html5-qrcode)
    - Instructions and info box
    - QR code type detection
    - Navigation to appropriate success page

18. **Scan Success Pages** (3 pages)

    - Meeting check-in success (`/member/scan-success/meeting`)
    - Volunteer check-in success (`/member/scan-success/volunteer-in`)
    - Volunteer check-out success (`/member/scan-success/volunteer-out`)
    - Each with appropriate details and stats

19. **Member Profile** (`/member/profile`)

    - Avatar, name, member number
    - Contact information card
    - 2024 Activity Summary with progress bars
    - Achievements section with badges
    - Edit profile button

20. **Individual Member Profiles** (6 pages: `/member/directory/:id`)

    - Reusable profile component
    - Dynamic data based on member ID
    - Contact action buttons (Call, Message)
    - Back navigation

### Phase 4: Admin View Pages (11 pages)

21. **Admin Dashboard** (`/admin/home`)

    - Four stat cards grid
    - Quick Actions card
    - Action Items card with badges
    - Upcoming Events card

22. **Admin Members Management** (`/admin/members`)

    - Add Member button
    - Import button (UI only)
    - Search and filter functionality
    - Member list with status indicators
    - Pending approval badges

23. **Admin Meetings Management** (`/admin/meetings`)

    - Create Meeting button
    - Filter chips
    - Meeting cards with check-in counts
    - Edit and View QR buttons

24. **Admin Volunteers Management** (`/admin/volunteers`)

    - Create Opportunity button
    - Filter chips
    - Event cards with capacity tracking
    - Edit and View Details buttons

25. **Create Meeting** (`/admin/meetings/create`)

    - Meeting type dropdown
    - Date/time pickers
    - Location and agenda inputs
    - Form validation
    - Generate QR code on creation

26. **Meeting Created Success** (`/admin/meetings/created/:id`)

    - QR code display (qrcode.react)
    - Token ID and Meeting ID
    - Download QR button (canvas to image)
    - Email to Members button (UI only)

27. **Create Volunteer Event** (`/admin/volunteers/create`)

    - Event details form
    - Date/time pickers
    - Capacity and roles inputs
    - Form validation

28. **Volunteer Event Created Success** (`/admin/volunteers/created/:id`)

    - Success confirmation
    - Event summary card
    - Next steps info box
    - Notify Members button

29. **Admin Analytics** (`/admin/analytics`)

    - Time filter chips
    - Chart placeholder (using recharts or similar)
    - Top Members table
    - Top Volunteers table
    - Success metrics card
    - Export buttons (UI only)

30. **Admin Volunteer Detail Pages** (2 pages: `/admin/volunteers/:id`)

    - Event information card
    - Volunteers organized by role
    - Capacity tracking per role
    - Check-in status info
    - Action buttons (Email, Export)

### Phase 5: Data Management & QR Code Integration

31. **Mock data structure**

    - Create data models for:
      - Users/Members
      - Meetings
      - Volunteer Events
      - Attendance Records
      - Volunteer Hours
    - Initialize localStorage with sample data
    - Create data utility functions (CRUD operations)

32. **QR Code functionality**

    - QR code generation service:
      - Meeting check-in codes (format: `MEETING:{meetingId}:{token}`)
      - Volunteer check-in codes (format: `VOLUNTEER-IN:{eventId}:{token}`)
      - Volunteer check-out codes (format: `VOLUNTEER-OUT:{eventId}:{token}`)
    - QR code scanning service:
      - Parse QR code strings
      - Route to appropriate success page
      - Update attendance/hours in localStorage
    - QR code display component (for admin)

33. **Routing setup**

    - Configure React Router with all routes
    - Protected routes (require authentication)
    - Role-based route access (member vs admin)
    - 404 page

### Phase 6: Styling & Polish

34. **Theme implementation**

    - CSS variables for colors:
      - Purple (#667eea) - primary
      - Dark Purple (#764ba2) - board meetings
      - Green (#10b981) - volunteers, success
      - Blue (#3b82f6) - info
      - Yellow (#f59e0b) - warnings
      - Red (#ef4444) - danger
    - Responsive breakpoints
    - Typography scale
    - Spacing system

35. **Component styling**

    - Style all components with CSS Modules
    - Ensure consistent design language
    - Add hover/active states
    - Implement color-coded borders for event types

36. **Responsive design**

    - Mobile-first approach
    - Tablet and desktop breakpoints
    - Navigation adaptation (bottom nav on mobile, sidebar on desktop)

## Key Files to Create

### Core Files

- `src/App.jsx` - Main router and layout
- `src/main.jsx` - Entry point
- `src/styles/global.css` - Global styles and theme
- `src/utils/qrCode.js` - QR code generation/parsing utilities
- `src/utils/dataManager.js` - localStorage CRUD operations
- `src/data/mockData.js` - Initial sample data

### Context Files

- `src/contexts/AuthContext.jsx` - Authentication state
- `src/contexts/AppContext.jsx` - App-wide state

### Component Files (sample)

- `src/components/common/Button/Button.jsx` + `Button.module.css`
- `src/components/common/Card/Card.jsx` + `Card.module.css`
- `src/components/navigation/Header/Header.jsx` + `Header.module.css`
- `src/components/navigation/BottomNav/BottomNav.jsx` + `BottomNav.module.css`

### Page Files (sample)

- `src/pages/auth/Login/Login.jsx` + `Login.module.css`
- `src/pages/member/Home/Home.jsx` + `Home.module.css`
- `src/pages/admin/Home/Home.jsx` + `Home.module.css`

## Data Flow

```
User Action → Component Handler → Data Utility → localStorage → State Update → UI Re-render
```

## QR Code Flow

```
Admin Creates Event → Generate QR Token → Store in localStorage → Display QR Code
Member Scans QR → Parse Token → Validate → Update Attendance/Hours → Show Success Page
```

## Testing Strategy

- Manual testing of all 33 pages
- Test QR code generation and scanning
- Test form validations
- Test navigation flows
- Test localStorage persistence
- Test responsive design on multiple screen sizes

### To-dos

- [x] Initialize Vite React project and install dependencies (react-router-dom, react-icons, qrcode.react, html5-qrcode, date-fns)
- [ ] Create folder structure (components, pages, hooks, utils, data, styles) and set up CSS Modules configuration
- [ ] Build reusable UI components (Button, Card, StatCard, InfoBox, Badge, Avatar, ProgressBar, Input, FilterChips, SearchBar)
- [ ] Create navigation components (Header with role switcher, BottomNav for member/admin, Sidebar for admin)
- [ ] Create AuthContext and AppContext for global state management
- [ ] Build authentication pages (Login, Register, Register Success) with form validation
- [ ] Build member home/dashboard page with stat cards, next meeting, and quick actions
- [ ] Build member directory page with search, filters, and member list
- [ ] Build member meetings list and detail pages with color-coded cards
- [ ] Build volunteer pages (list, signup, detail, success pages) with role selection
- [ ] Implement QR code scanning page with html5-qrcode integration and success pages
- [ ] Build member profile pages (self and individual member profiles) with activity stats
- [ ] Build admin dashboard with stat cards, quick actions, and action items
- [ ] Build admin members management page with add/import/search/filter functionality
- [ ] Build admin meetings management and create meeting pages with QR generation
- [ ] Build admin volunteers management, create event, and detail pages
- [ ] Build admin analytics page with charts, tables, and export functionality
- [ ] Implement QR code generation service and integrate with meeting/volunteer creation
- [ ] Create mock data structure, localStorage utilities, and data CRUD operations
- [ ] Configure React Router with all 33 routes, protected routes, and role-based access
- [ ] Apply consistent styling across all pages, implement theme colors, and ensure responsive design


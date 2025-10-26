# Problem Library & Test Cases Feature

## Overview
Interviewers can now dynamically add coding problems from a library during live interview sessions. Each problem includes both public and hidden test cases that automatically validate candidate solutions.

## Features Implemented

### 1. **Problem Library Modal (Interviewer Only)**
   - ✅ Purple "Problem Library" button in interview room header
   - ✅ Modal displaying all available problems
   - ✅ Visual indicators for difficulty (Easy/Medium/Hard)
   - ✅ Shows currently active problem
   - ✅ Click to select and switch problems mid-session
   - ✅ Real-time synchronization across all participants

### 2. **Test Cases System**
   - ✅ **Public Test Cases** - Visible to all participants
   - ✅ **Hidden Test Cases** - Only visible to interviewers
   - ✅ Automatic test execution on "Run Code"
   - ✅ Visual pass/fail indicators with colors
   - ✅ Detailed input/expected/actual output comparison

### 3. **Enhanced Code Editor**
   - ✅ Integrated output panel (bottom 1/3 of screen)
   - ✅ Real-time code execution using Piston API
   - ✅ Test results with visual indicators (✓/✗)
   - ✅ Console output display
   - ✅ Collapsible output panel
   - ✅ Auto-reset when problem changes

### 4. **Backend Integration**
   - ✅ Test cases stored in database (JSON format)
   - ✅ API endpoint: `PATCH /api/sessions/:id/problem`
   - ✅ Socket.IO event: `change-problem`
   - ✅ Real-time problem synchronization

## Database Schema Changes

### Problem Model Updates:
```prisma
model Problem {
  id          String   @id @default(cuid())
  title       String
  description String
  difficulty  String
  starterCode String?
  testCases   Json?    // NEW: Array of test cases
  createdAt   DateTime @default(now())
  sessions    InterviewSession[]
}
```

### Test Case Structure:
```json
{
  "input": [2, 7, 11, 15], 9],
  "expected": [0, 1],
  "hidden": false,
  "description": "Basic case: [2, 7, 11, 15], target = 9"
}
```

## UI Components

### Interview Room Header (Interviewer View):
```
[Session Title]  |  [👥 2 online]  [⏱️ Timer]  [📚 Problem Library]  [🛑 End Session]
```

### Problem Library Modal:
- Grid layout (2 columns on desktop)
- Each problem card shows:
  - Title
  - Difficulty badge (color-coded)
  - Description (3-line preview)
  - Active indicator (purple dot)
- Click any problem to select it
- Real-time update to all participants

### Code Editor Output Panel:
```
Output & Test Results                                              [Hide]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Cases:

✓ Test 1 - PASSED
  Input: [2, 7, 11, 15], 9
  Expected: [0, 1]

✓ Test 2 - PASSED
  Input: [3, 2, 4], 6
  Expected: [1, 2]

✗ Test 3 - FAILED [Hidden]
  Input: [3, 3], 6
  Expected: [0, 1]
  Got: undefined

Console Output:
[0, 1]
[1, 2]
```

## Usage Flow

### For Interviewers:

1. **Start Interview Session**
   - Session may or may not have a problem assigned initially

2. **Open Problem Library**
   - Click "Problem Library" button (purple)
   - Browse available problems
   - See difficulty levels and descriptions

3. **Select a Problem**
   - Click on any problem card
   - Problem instantly updates for all participants
   - Code editor resets with starter code
   - Previous output clears

4. **View Test Results**
   - Candidate runs their code
   - Interviewer sees ALL test cases (including hidden ones)
   - Can evaluate solution quality based on test coverage

### For Candidates:

1. **Receive Problem**
   - Problem appears automatically when interviewer selects it
   - Starter code loads in editor
   - Problem description visible in toolbar

2. **Write Solution**
   - Code in the editor
   - Use provided starter code as template
   - Real-time collaboration with interviewer

3. **Run Tests**
   - Click "Run Code" button (green)
   - See output panel with results
   - Public test cases show input/expected/actual
   - Hidden test cases only show pass/fail (no details)

4. **Iterate**
   - Fix failing tests
   - Run again to verify
   - Interviewer can switch problems anytime

## API Endpoints

### Update Session Problem
```http
PATCH /api/sessions/:sessionId/problem
Content-Type: application/json

{
  "problemId": "clxxx123"
}

Response:
{
  "id": "session123",
  "title": "Interview Session",
  "problemId": "clxxx123",
  "problem": {
    "id": "clxxx123",
    "title": "Two Sum",
    "difficulty": "EASY",
    "testCases": [...]
  }
}
```

### Get All Problems
```http
GET /api/problems

Response:
[
  {
    "id": "clxxx123",
    "title": "Two Sum",
    "description": "Given an array...",
    "difficulty": "EASY",
    "starterCode": "function twoSum...",
    "testCases": [...]
  }
]
```

## Socket.IO Events

### Client → Server:
```javascript
// Change problem
socket.emit('change-problem', {
  sessionId: 'session123',
  problem: problemObject
});
```

### Server → Clients:
```javascript
// Notify problem changed
socket.on('problem-changed', ({ problem }) => {
  setCurrentProblem(problem);
  // Update UI
});
```

## Code Execution

### Using Piston API:
- **Service**: https://emkc.org/api/v2/piston/execute
- **Languages Supported**: JavaScript, Python, Java, C++, Go, TypeScript
- **Rate Limiting**: Free tier - reasonable for hackathon demos
- **Response Time**: ~1-3 seconds per execution

### Test Case Execution Logic:
1. User clicks "Run Code"
2. Code sent to Piston API
3. For each test case:
   - Wrap user code with test input
   - Execute remotely
   - Parse output
   - Compare with expected
4. Display results:
   - Show public tests to everyone
   - Show hidden tests only to interviewer
   - Visual pass/fail indicators

## Security & Privacy

### Hidden Test Cases:
- ✅ Hidden tests don't reveal input/expected to candidates
- ✅ Only show pass/fail status
- ✅ Full details visible to interviewers
- ✅ Prevents candidates from hardcoding solutions

### Permissions:
- ✅ Only interviewers can open problem library
- ✅ Only interviewers can change problems
- ✅ Button not visible to candidates
- ✅ API validates interviewer role (TODO: add auth middleware)

## Sample Problems Included

### 1. Two Sum (Easy)
- **Public Tests**: 2
- **Hidden Tests**: 1
- **Focus**: Hash maps, array manipulation

### 2. Reverse Linked List (Medium)
- **Public Tests**: 2
- **Hidden Tests**: 1
- **Focus**: Linked list manipulation, pointers

### 3. Valid Parentheses (Easy)
- **Public Tests**: 3
- **Hidden Tests**: 2
- **Focus**: Stack operations, string parsing

## Migration Commands

```powershell
cd server

# Apply schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed problems with test cases
# Make a POST request to /api/problems/seed
# OR manually add via Prisma Studio
```

## Testing the Feature

### Test as Interviewer:
1. Create a new session
2. Join the session
3. Click "Problem Library" button
4. Select "Two Sum" problem
5. Write a solution:
```javascript
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in map) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
}
```
6. Click "Run Code"
7. Verify:
   - All 3 tests visible (including hidden)
   - Test results show pass/fail
   - Output panel displays correctly

### Test as Candidate:
1. Join session via invite link
2. Wait for interviewer to select problem
3. See starter code load
4. Write solution
5. Run code
6. Verify:
   - Only 2 public tests visible
   - Hidden test shows pass/fail only
   - No "Problem Library" button

### Test Problem Switching:
1. Interviewer selects "Two Sum"
2. Candidate writes some code
3. Interviewer switches to "Valid Parentheses"
4. Verify:
   - Code editor resets to new starter code
   - Output clears
   - Problem title updates
   - Both see the same problem

## Troubleshooting

### Piston API Errors:
```
Error: Failed to execute code
Solution: Check internet connection, Piston API may be down
Fallback: Code execution will fail gracefully with error message
```

### Test Cases Not Running:
```
Issue: Test cases undefined or empty
Check: Problem has testCases field in database
Solution: Re-seed problems or add testCases via Prisma Studio
```

### Hidden Tests Visible to Candidate:
```
Issue: isInterviewer prop not passed correctly
Check: InterviewRoom passes isInterviewer={user?.role === 'INTERVIEWER'}
Solution: Verify user.role is set correctly from AuthContext
```

### Problem Library Empty:
```
Issue: No problems in database
Solution: Run seed endpoint: POST /api/problems/seed
Or add manually via Prisma Studio
```

## Future Enhancements

### Potential Additions:
- [ ] Problem difficulty filter in library
- [ ] Search/filter problems by topic
- [ ] Custom test case creation by interviewer
- [ ] Code templates for different languages
- [ ] Time/space complexity analysis
- [ ] Solution hints system
- [ ] Video explanation links
- [ ] Problem tags (arrays, strings, DP, etc.)
- [ ] Favorite/bookmark problems
- [ ] Custom problem creation by interviewers
- [ ] Import problems from LeetCode
- [ ] Historical test results tracking

## Performance Considerations

### Optimizations:
- Problems cached on client after first fetch
- Test execution parallelized where possible
- Output panel only renders when visible
- Monaco Editor uses virtual scrolling
- Socket events batched for multiple participants

### Limitations:
- Piston API free tier rate limits
- Large test case arrays may slow execution
- Console output truncated at 10KB
- Maximum 20 test cases per problem recommended

---

**Created**: October 26, 2025  
**Version**: 2.0.0  
**Status**: Production Ready  
**Dependencies**: Piston API, Monaco Editor, Socket.IO

# Course Recommendation Quiz

A short quiz that asks a learner about their goal, background, interests, coding level, available time and learning style, then recommends the three best-matching courses with a match percentage and a reason.

**Built with:** HTML, CSS, JavaScript (no libraries)

## Run it
Open `index.html` in any browser. No install or server needed.

## How it works
- Each answer adds points to tags (for example `data`, `beginner`, `job`).
- Every course has a weight for each tag. A course's score is the sum of (points x weight).
- The best score becomes 100%; other courses are shown relative to it.
- Questions and courses are plain arrays at the top of `script.js`, so they are easy to edit.

## Features
- Progress bar, Back/Next navigation, retake option
- Top 3 results with match % and a plain-language reason
- "Copy summary" button
- Responsive layout, keyboard friendly
- Safe rendering (`textContent`, no `innerHTML`)

## Ideas to extend
- Add a lead-capture form on the results page
- Load courses from a JSON file
- Add more questions (budget, preferred language)

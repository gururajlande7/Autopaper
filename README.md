# AutoPaper

AutoPaper is a full-stack Next.js application that generates structured Class
10 question papers from MongoDB and exports them as print-ready A4 PDFs.

For the architecture, request flow, database schema, and function-by-function
reference, read [`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md).

It supports full papers and chapter-wise 15-mark tests. Each chapter test
contains three MCQs, two objective questions, two 2-mark questions, and two
3-mark questions.

Difficulty profiles prefer these mixes and automatically use available
questions from another level when a preferred level is unavailable:

- Easy: 80% easy, 20% medium
- Medium: 20% easy, 60% medium, 20% hard
- Hard: 15% easy, 30% medium, 55% hard

# Autopaper

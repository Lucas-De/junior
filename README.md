## Take Home Test

**Table of Contents**

- [Context](#context)
- [Objective](#objective)
- [Deliverables](#deliverables)
- [Getting Started](#getting-started)
- [Deploying on Vercel](#deploying-on-vercel)

## Context:

This repo is a bare bones NextJS / Typescript / Postgres / [Chakra UI](https://v2.chakra-ui.com/docs/components/). On load, it renders a list of interview transcripts broken down as question / answer pairs. This is a very similar representation to how we have structured the data in Junior.

Your task is to build a simple quote bookmarking feature from a transcript. In the ideal version, a user should be able to bookmark individual quotes from a transcript and be able to view all of their bookmarks. The bookmarks should be stored in a database and be exportable to a CSV file. Users should be able to create different bookmark folders. The structure should look something like this:

```
Bookmark Folder 1
  - Quote 1
  - Quote 2
Bookmark Folder 2
  - Quote 1
  - Quote 4
```

Note 1: the data is mocked using fakerjs. You can ignore the actual transcripts and focus on the bookmarking feature.

Note 2: You can always reach out to me if you have any questions.

## Objective:

Specific requirements for the bookmarking feature:

1. Create different bookmark folders
2. Ability to bookmark individual quotes from transcripts
3. View all bookmarks
4. Store bookmarks in a database
5. Export bookmarks to CSV

**Bonus Points**:

- Implement filtering and searching within bookmarks.
- Add an OpenAI generated summary of the quotes for a given bookmark.
- Add a way to delete bookmarks or individual bookmark quotes.

### Deliverables:

- Source code repository (GitHub, GitLab, etc.).
- A brief documentation of your design decisions.
- Ideally: a vercel deployment of the application.

#### Evaluation Criteria

**UI & design**
You are free to design the UI as you see fit. As you will often be required to fill in design gaps, we care about and will evaluate the design as well, but we are primarily evaluating the functionality.

**Functionality**

All the core requirements listed above. We will also be evaluating the code quality, readability, and maintainability.

**Time Expectations**

We expect this to take no more than 3 hours.

## Getting Started

First, you need to set up a Vercel Postgres database. Check out Vercel's [Postgres documentation](https://vercel.com/docs/storage/vercel-postgres) for more details. You can also see this [guide](https://nextjs.org/learn/dashboard-app/setting-up-your-database) for more details.

Then, you need to create a .env.local file with the env variables given above.

You are now ready to run the dev app. You can install the dependencies and run the development server:

```bash
yarn install
yarn dev
```

**Seeding data**:
You can seed the db by hitting `http://localhost:3000/api/seed`. This will seed the database with 5 new transcripts & 20 question-answer pairs. If you need to reset the entire database, you can hit `http://localhost:3000/api/seed?reset=true`.

**Opening the app**:
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Appendix

### Deploying on Vercel

The easiest way to deploy your Next.js app is to use Vercel. Check out Vercel's [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

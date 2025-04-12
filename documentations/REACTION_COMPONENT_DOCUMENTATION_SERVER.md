---

**Revised Server-Side Reaction Implementation Guide (Polymorphic Approach with Verification)**

*(Updates are marked with ***Revised***)*

---

# Dynamic Server-Side Reaction Implementation Guide (Polymorphic Approach)

This document provides instructions for implementing or adapting a reaction feature (Like, Love, Haha, etc.) on various content types within the application using a flexible, polymorphic database model.

**Goal:** To allow authenticated users to add, update, or remove reactions on different types of content (e.g., Posts, Comments, Articles) using a single `Reaction` database table and retrieve aggregated reaction counts and the current user's reaction status.

**Core Components:**

1.  **Database Model:** Defines or adapts a single, polymorphic `Reaction` structure.
2.  **API Route:** Exposes a **feature-specific** endpoint for handling reaction requests.
3.  **Controller Logic:** Handles the business logic, dynamically identifying the target content type and ID.
4.  **Middleware:** Ensures user authentication.
5.  **Helper Functions:** Assists in retrieving aggregated data based on content type and ID.

---

## Step 1: Define or Adapt the Polymorphic Database Schema (Prisma)

**_Revised Step 1_**

The goal is to have a single `Reaction` model capable of linking to any content type.

**1.1 Verify Existing Reaction Schema:**

- **Action:** Examine `prisma/schema.prisma`. Look for an existing `model Reaction` or a model specifically for post reactions (e.g., `model PostReaction`).

**1.2 Adapt Existing Schema (If Found):**

- If a `Reaction` model (likely specific to Posts) exists, **modify it** to support polymorphism:
  - **Rename Specific Foreign Key:** If it has a field like `postId String`, rename it to `targetId String`. Update the corresponding `@relation`'s `fields` attribute. Remove the direct relation field (e.g., `post Post @relation(...)`).
  - **Add Type Discriminator:** Add the field `targetType String` to store the type of content (e.g., "Post", "Comment").
  - **Update Unique Constraint:** Modify the `@@unique` constraint to include `authorId`, `targetId`, and `targetType`. Remove any old unique constraint involving `postId`. Example: `@@unique([authorId, targetId, targetType])`.
  - **Update Index:** Modify any relevant `@@index` to use `targetId` and `targetType`. Example: `@@index([targetId, targetType])`.
  - **Ensure Base Fields:** Confirm it has `id`, `type` (enum `ReactionType`), `authorId` (with relation to `User`), and `createdAt`.

```prisma
// Example: Modifying an existing Post-specific Reaction model

// BEFORE (Example of what might exist)
// model Reaction {
//   id         String       @id @default(cuid())
//   type       ReactionType
//   authorId   String
//   author     User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
//   postId     String       // Specific to Post
//   post       Post         @relation(fields: [postId], references: [id], onDelete: Cascade) // Specific to Post
//   createdAt  DateTime     @default(now())
//   @@unique([authorId, postId]) // Specific to Post
// }

// AFTER Modification for Polymorphism
model Reaction {
  id         String       @id @default(cuid())
  type       ReactionType
  authorId   String
  author     User         @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // --- Polymorphic Relationship ---
  targetId   String       // Renamed from postId (or added if no ID before)
  targetType String       // Added: Type of content (e.g., "Post", "Comment")
  // --- No direct relation to Post/Comment here ---

  createdAt  DateTime     @default(now())

  // Ensure a user can only have one reaction per specific content item
  @@unique([authorId, targetId, targetType]) // Updated constraint
  // Index for efficiently querying reactions for a specific content item
  @@index([targetId, targetType]) // Added/Updated index
}

enum ReactionType { // Ensure this enum exists or create it
  LIKE
  LOVE
  HAHA
  WOW
  SAD
  ANGRY
}

model User {
  id String @id @default(cuid())
  // ... other fields
  reactions Reaction[] // Ensure this back-relation exists
}

// Remove 'reactions Reaction[]' from the Post model if it existed
// model Post { ... }
```

**1.3 Create New Schema (If No Suitable Model Found):**

- If no existing `Reaction` model is found, define a new one as follows:

```prisma
// In prisma/schema.prisma (if creating new)

enum ReactionType {
  LIKE
  LOVE
  HAHA
  WOW
  SAD
  ANGRY
}

model Reaction {
  id         String       @id @default(cuid())
  type       ReactionType
  authorId   String
  author     User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  targetId   String
  targetType String
  createdAt  DateTime     @default(now())
  @@unique([authorId, targetId, targetType])
  @@index([targetId, targetType])
}

model User {
  // ... ensure User model exists ...
  id String @id @default(cuid())
  reactions Reaction[] // Add back-relation
}
```

**1.4 Apply Changes:**

- **Action:** After modifying or creating the schema, run `npx prisma migrate dev` to generate and apply the necessary database migration. Carefully review the generated SQL. If renaming `postId` to `targetId`, you might need a custom migration step to populate the initial `targetType` (e.g., set `targetType = 'Post'` for all existing reaction rows). Prisma might handle basic renames, but adding the `targetType` with a default for existing rows often requires manual SQL in the migration file.

---

## Step 2: Define or Verify the API Route (Feature-Specific)

**_Revised Emphasis_**

For each feature needing reactions (Posts, Comments, etc.), ensure a **feature-specific** API route exists or create one.

**Action:**

1.  **Verify:** Check the relevant router file (e.g., `server/routes/postRoutes.js`, `server/routes/commentRoutes.js`). Does a `POST` route for reactions already exist (e.g., `/api/posts/:postId/reactions`)?
2.  **Adapt/Create:**
    - If it exists, ensure it uses the correct parameter name (e.g., `:postId`, `:commentId`) and points to the intended controller logic (Step 3).
    - If it doesn't exist, create it. The URL path and ID parameter name **must** be specific to the feature.

```javascript
// Example Check/Creation for Comments in server/routes/commentRoutes.js
// ... imports ...
const reactionController = require("../controllers/reactionController"); // Assuming shared controller
const authenticateToken = require("../middleware/authenticateToken");
// ...
router.post(
  "/:commentId/reactions", // VERIFY/CREATE: Ensure path and :commentId are correct
  authenticateToken,
  reactionController.handleReaction // VERIFY/CREATE: Ensure correct controller is called
);
// ...
```

**Key Point for AI Agent:** The endpoint URL (path and parameter name) is dynamic and feature-dependent.

---

## Step 3: Implement or Adapt the Controller Logic (Feature-Aware)

**_Revised Emphasis_**

Ensure there is controller logic (`handleReaction` function) that can process reaction requests polymorphically. A shared controller (`reactionController.js`) is often best.

**Action:**

1.  **Verify:** Check `server/controllers/` for an existing `reactionController.js` or reaction-handling logic within feature-specific controllers (e.g., `postController.js`).
2.  **Adapt/Create:**
    - If relevant logic exists (e.g., in `postController.handleReaction`), **refactor** it into a shared, reusable function (like `exports.handleReaction` in `reactionController.js`). This function _must_ use the `determineTargetInfo` helper (see below) to work with different features. Update the existing routes to call this shared function.
    - If no suitable logic exists, create the `handleReaction` function (preferably in `reactionController.js`) as detailed below. It must handle different `targetType`s and `targetId`s.

```javascript
// In server/controllers/reactionController.js (Recommended)

const prisma = require("../db");
const {
  getReactionCounts,
  getUserReaction,
} = require("../services/reactionService"); // Verify service exists (Step 4)

const VALID_REACTION_TYPES = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]; // Ensure sync with Enum

exports.handleReaction = async (req, res) => {
  // ... (Input validation: reactionType, authorId from req.user) ...

  // *** Dynamically determine the target type and ID ***
  const { targetId, targetType } = determineTargetInfo(req); // CRITICAL HELPER
  if (!targetType || !targetId) {
    /* ... handle error ... */
  }

  try {
    // *** Check Permissions using targetId and targetType ***
    const hasPermission = await checkPermissions(
      req.user?.userId,
      targetId,
      targetType
    ); // CRITICAL HELPER
    if (!hasPermission) {
      /* ... handle error ... */
    }

    // --- Handle Reaction Logic (Upsert/Delete using polymorphic fields) ---
    const reactionWhereUniqueInput = {
      authorId_targetId_targetType: {
        authorId: req.user.userId,
        targetId,
        targetType,
      },
    };
    if (upperReactionType) {
      // upperReactionType derived from reactionType
      await prisma.reaction.upsert({
        where: reactionWhereUniqueInput,
        update: { type: upperReactionType },
        create: {
          authorId: req.user.userId,
          targetId,
          targetType,
          type: upperReactionType,
        },
      });
      // ... message = "Reaction saved." ...
    } else {
      // ... (delete logic using reactionWhereUniqueInput) ...
    }

    // --- Fetch Updated State using targetId and targetType ---
    const updatedReactionCounts = await getReactionCounts(targetId, targetType);
    const updatedUserReaction = await getUserReaction(
      req.user?.userId,
      targetId,
      targetType
    );

    // --- Send Response ---
    res.status(200).json({
      /* ... message, counts, userReaction ... */
    });
  } catch (error) {
    /* ... handle errors ... */
  }
};

// --- Helper to determine target info (Implement/Verify) ---
function determineTargetInfo(req) {
  // Inspect req.params and req.baseUrl to return { targetId, targetType }
  // Example:
  if (req.params.commentId && req.baseUrl.includes("/api/comments")) {
    return { targetId: req.params.commentId, targetType: "Comment" }; // Use DB string "Comment"
  } else if (req.params.postId && req.baseUrl.includes("/api/posts")) {
    return { targetId: req.params.postId, targetType: "Post" }; // Use DB string "Post"
  }
  // *** AI Agent: Add checks for other features ***
  return { targetId: null, targetType: null };
}

// --- Helper for permission checks (Implement/Verify) ---
async function checkPermissions(userId, targetId, targetType) {
  // Logic MUST vary based on targetType
  // MUST check if target exists AND user has permission
  // Example for 'Post':
  if (targetType === "Post") {
    // ... Check Post existence & user permission (visibility, author, follow) ...
    // return true or false
  }
  // *** AI Agent: Implement checks for 'Comment', 'Article', etc. ***
  return false; // Default deny
}
```

**Action (Summary):** Ensure a single, adaptable `handleReaction` function exists. Implement/Verify the crucial `determineTargetInfo` and `checkPermissions` helper functions to handle different content types based on the request context. Refactor existing logic if necessary.

---

## Step 4: Implement or Verify Helper Functions (Service Layer)

**_Revised Emphasis_**

Ensure helper functions exist to get reaction counts and a specific user's reaction, adaptable for any `targetType` and `targetId`.

**Action:**

1.  **Verify:** Check `server/services/` for a `reactionService.js` or similar containing `getReactionCounts` and `getUserReaction` functions.
2.  **Adapt/Create:**
    - If they exist, ensure they accept `targetId` and `targetType` as arguments and query the polymorphic `Reaction` model correctly.
    - If they don't exist, create them in `reactionService.js` as shown below.

```javascript
// In server/services/reactionService.js (Verify/Create)
const prisma = require("../db");

async function getReactionCounts(targetId, targetType) {
  // Query Reaction model using targetId and targetType
  // Group by 'type', count occurrences
  // Return object like { LIKE: 10, LOVE: 5 }
  if (!targetId || !targetType) return {};
  try {
    const counts = await prisma.reaction.groupBy({
      /* ... where: { targetId, targetType }, by: ['type'], _count: { type: true } ... */
    });
    // ... format counts ...
    return reactionCounts;
  } catch (error) {
    /* ... handle error, return {} ... */
  }
}

async function getUserReaction(authorId, targetId, targetType) {
  // Find unique Reaction using authorId, targetId, targetType
  // Return the 'type' (e.g., "LIKE") or null
  if (!authorId || !targetId || !targetType) return null;
  try {
    const reaction = await prisma.reaction.findUnique({
      /* where: { authorId_targetId_targetType: { authorId, targetId, targetType } }, select: { type: true } */
    });
    return reaction ? reaction.type : null;
  } catch (error) {
    /* ... handle error, return null ... */
  }
}

module.exports = { getReactionCounts, getUserReaction };
```

**Action (Summary):** Ensure these two service functions exist and correctly query the polymorphic `Reaction` model using `targetId` and `targetType`.

---

## Step 5: Connect Middleware and Finalize

1.  **Authentication:** Verify `authenticateToken` middleware is applied to all reaction routes (Step 2).
2.  **Server Entry:** Verify feature routes are registered in `server/index.js`.
3.  **Testing:** Test thoroughly for each feature type, including edge cases (non-existent content, permissions, adding/changing/removing reactions).

---

This revised guide emphasizes verification and adaptation, making it safer and more robust for an AI agent (or developer) to implement polymorphic reactions by building upon existing code where possible.

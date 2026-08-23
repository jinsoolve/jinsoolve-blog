const assert = require("node:assert/strict");
const test = require("node:test");
const { createContentMetadata } = require("./content-metadata");
const { getPostPath, isPublicPost } = require("./content-policy");

test("creates stable heading anchors and reading-time metadata together", async () => {
  const metadata = await createContentMetadata(`
# Introduction
Opening paragraph.

## Details
More words for the reading-time calculation.

### Deep dive
Final paragraph.
`);

  assert.equal(metadata.readingTime.words > 0, true);
  assert.equal(metadata.readingTime.text.length > 0, true);
  assert.deepEqual(metadata.tableOfContents, {
    items: [
      {
        depth: 1,
        title: "Introduction",
        url: "#my-heading-1",
        items: [
          {
            depth: 2,
            title: "Details",
            url: "#my-heading-2",
            items: [
              {
                depth: 3,
                title: "Deep dive",
                url: "#my-heading-3",
                items: [],
              },
            ],
          },
        ],
      },
    ],
  });
});

test("ignores fenced-code headings and preserves inline heading content", async () => {
  const metadata = await createContentMetadata(`
---
title: Metadata is not a heading
---

# [Linked heading](https://example.com) with \`code\`

\`\`\`md
## This is code, not a heading
\`\`\`

$$
# This is math, not a heading
$$

Math heading
------------
`);

  assert.deepEqual(metadata.tableOfContents, {
    items: [
      {
        depth: 1,
        title: "Linked heading with code",
        url: "#my-heading-1",
        items: [
          {
            depth: 2,
            title: "Math heading",
            url: "#my-heading-2",
            items: [],
          },
        ],
      },
    ],
  });
});

test("keeps publication and localized route policy in one place", () => {
  assert.equal(isPublicPost({ title: "Draft", published: false }), false);
  assert.equal(isPublicPost({ title: "About Me", published: true }), false);
  assert.equal(isPublicPost({ title: "Public post", published: undefined }), true);
  assert.equal(getPostPath({ slug: "hello" }), "/posts/hello");
  assert.equal(getPostPath({ locale: "en", slug: "hello" }), "/en/posts/hello");
});

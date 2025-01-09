function rehypeCustomSlug() {
  let headingCounter = 0;
  return async (tree) => {
    const visit = (await import('unist-util-visit')).visit;

    // 헤더 노드를 방문
    visit(tree, 'element', (node) => {
      // h1 ~ h6 태그만 처리
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        // rehype-autolink-headings가 적용될 가능성이 있는 노드에만 ID 추가
        if (!node.properties) {
          node.properties = {};
        }

        // 링크가 생성될 가능성이 있는 노드만 처리
        if (!node.properties.id) {
          headingCounter += 1; // 카운터 증가
          node.properties.id = `my-heading-${headingCounter}`; // ID 설정
        }
      }
    });
  };
}

module.exports = rehypeCustomSlug;
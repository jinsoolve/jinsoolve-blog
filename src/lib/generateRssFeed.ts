import fs from 'fs';
import { Feed } from 'feed';

import { getAllPosts } from './api';

export const generateRssFeed = () => {
  const posts = getAllPosts();
  const siteURL = 'https://junghyeonsu-dev.vercel.app/';
  const date = new Date();
  const author = {
    name: '정현수',
    email: 'jung660317@naver.com',
    link: 'https://junghyeonsu-dev.vercel.app/',
  };
  const feed = new Feed({
    title: '정현수의 기술 블로그',
    description: '주니어 프론트엔드 개발자 정현수의 기술 블로그입니다.',
    language: 'ko',
    id: siteURL,
    link: siteURL,
    favicon: `${siteURL}/favicon.png`,
    copyright: `Copyright ${date.getFullYear()}. junghyeonsu all rights reserved.`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`,
    },
    author,
  });
  posts.forEach(post => {
    const url = `${siteURL}/blog/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content: post.content,
      author: [author],
      contributor: [author],
      date: new Date(post.date),
    });
  });

  fs.mkdirSync('../../public/rss', { recursive: true });
  fs.writeFileSync('../../public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('../../public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('../../public/rss/feed.json', feed.json1());
};

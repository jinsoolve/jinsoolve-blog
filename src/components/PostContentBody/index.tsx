import { Box, ColorMode, useColorMode } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import CustomHeading from './CustomHeading';

interface BodyProps {
  content: string;
}

interface ContentProps {
  colorMode: ColorMode;
}

const Content = styled.article<ContentProps>`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  white-space: pre-line;

  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 5px;
  }

  h1 {
    font-size: 30px;
    font-weight: 900;
    margin-top: 30px;
  }

  h2 {
    font-size: 26px;
    font-weight: 800;
    margin-top: 25px;
  }

  h3 {
    font-size: 23px;
    font-weight: 800;
    margin-top: 20px;
  }

  h4 {
    font-size: 21px;
    font-weight: 800;
    margin-top: 15px;
  }

  p {
    font-size: 16px;
    line-height: 1.7;

    img {
      width: 100%;
      margin-bottom: auto 10px;
      pointer-events: none;
    }

    div + em {
      display: block;
      text-align: center;
      font-size: 14px;
      font-style: normal;
      opacity: 0.6;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    code {
      font-family: 'Noto Sans KR, sans-serif';
      font-weight: 700;
      background: ${props => (props.colorMode === 'dark' ? '' : 'var(--chakra-colors-gray-100)')};
      border-radius: ${props =>
        props.colorMode === 'dark' ? 'var(--chakra-radii-md)' : 'var(--chakra-radii-md)'};
      border-width: 1px 1px 3px;
      padding: 2px;
    }
  }

  blockquote {
    background-color: ${props =>
      props.colorMode === 'dark' ? 'rgba(251, 211, 141, 0.16)' : 'rgb(254, 235, 200)'};
    border-inline-start-width: 4px;
    border-inline-start-color: ${props =>
      props.colorMode === 'dark'
        ? 'var(--chakra-colors-orange-200)'
        : 'var(--chakra-colors-orange-500)'};
    border-radius: 5px;

    p {
      padding: 0px 20px;
    }

    ul,
    ol {
      padding: 0px 20px;
    }

    li {
      list-style-position: inside;
      margin-bottom: 6px;
    }
  }

  a {
    color: #0a91ff;

    :hover {
      color: #0a91ffa6;
    }
  }

  ul,
  ol {
    position: relative;
    left: 10px;
    white-space: normal;
  }

  li {
    list-style-position: inside;
    margin-bottom: 6px;

    code {
      font-family: 'Noto Sans KR, sans-serif';
      font-weight: 700;
      background: ${props => (props.colorMode === 'dark' ? '' : 'var(--chakra-colors-gray-100)')};
      border-radius: ${props =>
        props.colorMode === 'dark' ? 'var(--chakra-radii-md)' : 'var(--chakra-radii-md)'};
      border-width: 1px 1px 3px;
      padding: 2px;
    }
  }

  pre {
    margin: 30px 0px;
  }
`;

const CustomComponents = {
  h1({ ...props }) {
    return <CustomHeading level="h1">{props.children}</CustomHeading>;
  },
  h2({ ...props }) {
    return <CustomHeading level="h2">{props.children}</CustomHeading>;
  },
  h3({ ...props }) {
    return <CustomHeading level="h3">{props.children}</CustomHeading>;
  },
  h4({ ...props }) {
    return <CustomHeading level="h4">{props.children}</CustomHeading>;
  },
  h5({ ...props }) {
    return <CustomHeading level="h5">{props.children}</CustomHeading>;
  },
  h6({ ...props }) {
    return <CustomHeading level="h6">{props.children}</CustomHeading>;
  },
  code({ className, children, ...props }: SyntaxHighlighterProps) {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code>{children}</code>
    );
  },
  img({ ...props }) {
    return (
      <Link href={props.src} passHref>
        <a>
          <Box shadow="sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={props.src} alt={props.alt} loading="lazy" />
          </Box>
        </a>
      </Link>
    );
  },
  a({ ...props }) {
    return (
      <Tooltip hasArrow label={props.href}>
        <a href={props.href} target="_blank" rel="noopener noreferrer">
          {props.children}
        </a>
      </Tooltip>
    );
  },
};

const PostContentBody = ({ content }: BodyProps) => {
  const { colorMode } = useColorMode();

  return (
    <Content colorMode={colorMode}>
      <ReactMarkdown components={CustomComponents}>{content}</ReactMarkdown>
    </Content>
  );
};

export default PostContentBody;

---
slug: <% tp.file.path().split("/").slice(0,-1).pop() %>
title: 
description: 
thumbnail: 
categories:
  - <% tp.file.path().split("/").slice(0, -2).pop() %>
tags: 
createdAt: <% new Date().toISOString().split('T')[0].replace(/-/g, '/') %>
updatedAt: 
featured: false
locale:
---
<%* 
if (tp.file.title.startsWith("무제 파일")) { 
    await tp.file.rename("content"); 
} 
%>
const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (accumulator, currentValue) => {
    return accumulator + currentValue.likes;
  };
  return blogs.reduce(reducer,0);
};

const favoriteBlog = (blogs) => {
  let favorite = blogs[0];
  blogs.forEach(blog => {
    if(blog.likes > favorite.likes) {
      favorite = blog;
    }
  });
  return favorite;
};

const mostBlogs = (blogs) => {
  let result = [];
  let partitioned = [[], blogs];
  while (partitioned[1].length > 0) {
    const partitioner = blog => {
      return blog.author === partitioned[1][0].author;
    };
    partitioned = _.partition(partitioned[1], partitioner);
    result.push(partitioned[0]);
  }
  result.sort((a,b) => a.length - b.length);
  return {
    author: result[result.length-1][0].author,
    blogs: result[result.length-1].length
  };
};

const mostLikes = (blogs) => {
  let result = [];
  let partitioned = [[], blogs];
  while (partitioned[1].length > 0) {
    const partitioner = blog => {
      return blog.author === partitioned[1][0].author;
    };
    partitioned = _.partition(partitioned[1], partitioner);
    result.push(partitioned[0]);
  }
  const reducer = (accumulator, currentValue) => {
    return accumulator + currentValue.likes;
  };
  result.sort((a,b) => {
    return a.reduce(reducer, 0) - b.reduce(reducer, 0);
  });
  return {
    author: result[result.length-1][0].author,
    blogs: result[result.length-1].reduce(reducer, 0)
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
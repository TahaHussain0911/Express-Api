// 5) Average number of tags
// sol 1
const answer1 = [
  {
    $unwind: {
      path: "$tags",
    },
  },
  {
    $group: "$_id",
    numberOfTags: {
      $sum: 1,
    },
  },
  {
    $group: null,
    averageNumberOfTags: {
      $avg: "$numberOfTags",
    },
  },
];
// sol 2
const answer2 = [
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: ["$tags", []] },
      },
    },
  },
  {
    $group: {
      _id: null,
      averagetNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
];
// 5) HOw many users have enim in their tags
// sol1
const answerEnim1 = [
  {
    $unwind: {
      path: "$tags",
    },
  },
  {
    $match: {
      tags: "enim",
    },
  },
  {
    $group: {
      _id: null,
      count: {
        $sum: 1,
      },
    },
  },
];
// sol2
const answerEnim2 = [
  {
    $match: {
      tags: "enim",
    },
  },
  {
    $count: "countOfEnim",
  },
];
// 6) Give user name and age who are inactive and includes velit as tag
const answerInactive = [
  {
    $match: {
      isActive: false,
      tags: "velit",
    },
  },
  {
    $project: {
      name: 1,
      age: 1,
    },
  },
];
// 7) Add a Full Address Field
const fullAddress = [
  {
    $addFields: {
      fullAddress: {
        $concat: [
          "$company.location.country",
          ", ",
          "$company.location.address",
        ],
      },
    },
  },
];
// 8) Unwind the tags Array and Count Unique Tags
const unwindTags = [
  {
    $unwind: {
      path: "$tags",
    },
  },
  {
    $group: {
      _id: "$tags",
      countTag: {
        $sum: 1,
      },
    },
  },
];
// 9) Calculate Total and Average Age by Gender
const userTotalAvg = [
  {
    $group: {
      _id: "$gender",
      averageAge: {
        $avg: "$age",
      },
      totalAge: {
        $sum: "$age",
      },
    },
  },
];
//10) Count Users by Registration Year
const userByRegisteredYear = [
  {
    $addFields: {
      registeredYear: {
        $year: "$registered",
      },
    },
  },
  {
    $group: {
      _id: "$registeredYear",
      countUserYear: {
        $sum: 1,
      },
    },
  },
];
// 11) Find Active Users by Country
const activeCountryUsers = [
  {
    $match: {
      isActive: true,
    },
  },
  {
    $group: {
      _id: "$company.location.country",
      countrySum: {
        $sum: 1,
      },
    },
  },
];
// 12) Filter and Aggregate Based on eyeColor
const filterOnEyeColor = [
  {
    $match: {
      eyeColor: "green",
    },
  },
  {
    $group: {
      _id: null,
      averageAge: {
        $avg: "$age",
      },
    },
  },
];
// 13) Retrieve a distinct list of tags used by active users.
const uniqueTags = [
  {
    $unwind: "$tags",
  },
  {
    $group: {
      _id: null,
      uniqueTags: {
        $addToSet: "$tags",
      },
    },
  },
];
// 13) Who has registered the most recently
const recentRegister = [
  {
    $sort: {
      registered: -1,
    },
  },
  {
    $limit: 4,
  },
  {
    $project: {
      name: 1,
      age: 1,
      registered: 1,
    },
  },
];

// 14) Categorize users on favorite fruit
const fruiteCategory = [
  {
    $project: {
      name: 1,
      registered: 1,
      favoriteFruit: 1,
      age: 1,
      gender: 1,
    },
  },
  {
    $group: {
      _id: "$favoriteFruit",
      users: {
        // $push: "$name",
        $push: "$$ROOT",
      },
    },
  },
];
// 15) Users having "ad" tag at 2nd position
const includesAd = [
  {
    $match: {
      "tags.1": "ad",
    },
  },
  {
    $count: "totalAdTagUsers",
  },
];

// 16) List companies located in USA with their user count
const companiesInUSA = [
  {
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: "$company.title",
      userCount: {
        $sum: 1,
      },
    },
  },
];

/// mongodb lookup
// 1) populate author details
// sol 1
const author_lookup = [
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $addFields: {
      author: {
        $first: "$author",
      },
    },
  },
];
// sol 2
const author_lookup_2 = [
    {
      $lookup: {
        from: "authors",
        localField: "author_id",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $addFields: {
        author: {
          $arrayElemAt:["author",0]
        },
      },
    },
  ];
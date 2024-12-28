// 5) Average number of tags
// sol 1
const answer1 = [
  {
    $unwind: {
      path: "$tags",
    },
  },
  {
    $group: "$tags",
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

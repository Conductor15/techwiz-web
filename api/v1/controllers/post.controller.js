const Post = require("../models/post.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/posts
module.exports.index = async (req, res) => {
    const find = {deleted: false};

    //status filter
    if(req.query.status){
        find.status = req.query.status;
    }

    //search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    //pagination
    const countPost = await Post.countDocuments(find);
    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,countPost
    );
    //end pagination

    //Sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //End sort

    const posts = await Post.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

    res.json(posts);
};

// [GET] /api/v1/posts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const post = await Post.findOne({
            _id: id,
            deleted: false
        });

        res.json(post);
    } catch (error) {
        res.json("Không tìm thấy!");
    }
};


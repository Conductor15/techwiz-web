const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {deleted: false};

    if(req.query.status){
        find.status = req.query.status;
    }

    //pagination
    const countTask = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,countTask
    );
    //end pagination

    //Sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //End sort
    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

    res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy!");
    }
};

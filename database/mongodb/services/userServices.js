const Users = require('../modals/users');

const fetchUserDate = async (query, select = '', sortBy = { createdAt: 1 }) => {
    try {
        return await Users.findOne(query).sort(sortBy).select(select);
    } catch (error) {
        throw error;
    }
}

const findOneUser = async (query, select = '', sortBy = { createdAt: 1 }) => {
    try {
        return await Users.findOne(query).sort(sortBy).select(select).lean().exec();
    } catch (error) {
        throw error;
    }
}

const createNewUser = async (newUser) => {
    try {
        return await Users.create(newUser);
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

const updateUser = async (query, updates, options = { new: true }) => {
    try {
        return await Users.findOneAndUpdate(query, updates, options);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    fetchUserDate,
    findOneUser,
    createNewUser,
    updateUser
}
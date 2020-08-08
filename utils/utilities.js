'use strict';
const moment = require('moment');
const randomstring = require("randomstring");
const { ObjectId } = require('mongoose').Types;
const { isNull, isUndefined } = require('lodash');

/**
 * Checks If an id is valid MongoDB ObjectId or not
 */
const isValidObjectId = (id) => {
    return ObjectId.isValid(id);
};

/**
 * Creates a MongoDB ObjectId
 */
const mongoId = (string) => {
    if (!isValidObjectId(string)) throw `Invalid String to convert into Mongo ObjectId`;

    return new ObjectId(string);
};

/**
 * Gets the time difference in seconds
 */
const timeDiffInSeconds = (dateFrom, dateTo = new Date()) => {
    return moment.duration(moment(dateFrom).diff(moment(dateTo))).asSeconds();
};

/**
 * Checks if the time is expired or not
 */
const isBeforeExpire = (expirationTime) => {
    const difference = this.timeDiffInSeconds(new Date(), new Date(expirationTime));
    return (difference > 0) ? true : false;
};

/**
 * Checks if the value is null or undefined
 */
const isNullOrUndefined = (value) => {
    return (isNull(value) || isUndefined(value));
};

/**
 * Creates a random string
 */
const generateRandonString = (length = 13, charset = 'alphabetic') => {
    return randomstring.generate({ length, charset });
}
/**
 * Add Miniutes to a date
 * returns date in ISO format
 */
const addMinutes = (minutes, time = new Date()) => {
    return moment(time).add(minutes, 'minutes').toISOString();
}

module.exports = {
    isValidObjectId,
    mongoId,
    timeDiffInSeconds,
    isBeforeExpire,
    isNullOrUndefined,
    generateRandonString,
    addMinutes
}
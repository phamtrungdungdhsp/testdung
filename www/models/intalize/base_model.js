"use strict";

const timeUtils = require('../../utils/time_utils');
const utils = require('../../utils/utils');
const PROMISE = require('bluebird');
const OBJECT_ID = require('mongoose').Types.ObjectId;

class BaseModel {
    /**
     * @return {number}
     */
    static get FIND_ONE() {
        return 1
    }

     
    /**
     * @return {number}
     */
    static get FIND_MANY() {
        return 2
    }

    /**
     * @return {number}
     */
    FIND_ONE() {
        return 1
    }

    /**
     * @return {number}
     */
    FIND_MANY() {
        return 2
    }

    constructor(collection) {
        this.coll = collection;
    }

    updateById(id, updatedata) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            updatedata.updateAt = new Date(timeUtils.getCurrentTime()).getTime();
            coll.update({_id: OBJECT_ID(id)}, updatedata, {multi: true}, function (error,success) {
                return resolve(error);
            })
        });
    }

    insertData(data) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            data.updateAt = new Date(timeUtils.getCurrentTime()).getTime();
            data.createAt = new Date(timeUtils.getCurrentTime()).getTime();

            (new coll(data)).save(function (error, result) {
                return resolve(result.toObject(), error);
            });
        });
    }

    updateWhereClause(condition, updatedata) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            updatedata.updateAt = new Date(timeUtils.getCurrentTime()).getTime();
            coll.update(condition, updatedata, {multi: true}, function (error) {
                return resolve(error);
            })
        });
    }

    countDataWhere(condition) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.count(condition, function (error, count) {
                return resolve(count);
            })
        });
    }


    getDataById(id) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.find({_id: OBJECT_ID(id)}).lean().exec().then(function (result) {
                if (result === null) {
                    return resolve(null);
                } else {
                    return resolve(result[ 0 ]);
                }
            })
        });
    }

    getDataWhere(whereClause, findType, sort = null, limit = null) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            if (BaseModel.FIND_ONE == findType) {
                if (sort != null) {
                    coll.findOne(whereClause).sort(sort).lean().exec().then(function (result) {
                        return resolve(result);
                    })
                } else {
                    coll.findOne(whereClause).sort(sort).lean().exec().then(function (result) {
                        return resolve(result);
                    })
                }

            } else if (BaseModel.FIND_MANY == findType) {
                if (sort != null) {
                    if (limit != null) {
                        coll.find(whereClause).sort(sort).lean().limit(limit).exec().then(function (result) {
                            return resolve(result);
                        })
                    } else {
                        coll.find(whereClause).sort(sort).lean().exec().then(function (result) {
                            return resolve(result);
                        })
                    }

                } else {
                    if (limit != null) {
                        coll.find(whereClause).sort(sort).lean().limit(limit).exec().then(function (result) {
                            return resolve(result);
                        })
                    } else {
                        coll.find(whereClause).sort(sort).lean().exec().then(function (result) {
                            return resolve(result);
                        })
                    }
                }
            }
        });
    }

    getDataWhereAndSelectField(whereClause, field, findType, sort = null, limit = null) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            if (BaseModel.FIND_ONE == findType) {
                if (sort != null) {
                    coll.findOne(whereClause, field).sort(sort).lean().exec().then(function (result) {
                        return resolve(result);
                    })
                } else {
                    coll.findOne(whereClause, field).sort(sort).lean().exec().then(function (result) {
                        return resolve(result);
                    })
                }
            } else if (BaseModel.FIND_MANY == findType) {
                if (sort != null) {
                    if (limit != null) {
                        coll.find(whereClause, field).sort(sort).lean().limit(limit).exec().then(function (result) {
                            return resolve(result);
                        })
                    } else {
                        coll.find(whereClause, field).sort(sort).lean().exec().then(function (result) {
                            return resolve(result);
                        })
                    }

                } else {
                    if (limit != null) {
                        coll.find(whereClause, field).sort(sort).lean().limit(limit).exec().then(function (result) {
                            return resolve(result);
                        })
                    } else {
                        coll.find(whereClause, field).sort(sort).lean().exec().then(function (result) {
                            return resolve(result);
                        })
                    }
                }
            }
        });
    }

    removeDataWhere(condition) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.remove(condition, function (error) {
                return resolve();
            })
        });
    }

    removeDataById(id) {
        let coll = this.coll;
        return new PROMISE(function (resolve) {
            coll.remove({_id: OBJECT_ID(id)}, function (error) {
                return resolve();
            })
        }).catch(function () {
            return new PROMISE(function (resolve) {
                return resolve(null);
            })
        });
    }

}

module.exports = BaseModel;
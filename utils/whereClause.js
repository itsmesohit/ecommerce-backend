// base  - prodduct.find();

// big Q = search=coder&price[lte]=1000&select=name,price&sort=-price

class WhereClause{
    constructor(base, bigQ){
        this.base = base;
        this.bigQ = bigQ;
    }
    search(){
        const keyword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i' // ignore the case
            }
        } : {}
        this.base = this.base.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy = {...this.bigQ};
        // Removing fields from the query
        const removeFields = ['search', 'sort','limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        this.base = this.base.find(JSON.parse(queryStr));
        return this;
    }

    pager(resultPerPage ){
        let currentPage = 1;
        if(this.bigQ.page) currentPage = this.bigQ.page;
        this.base.limit(resultPerPage).skip(resultPerPage * (currentPage - 1));
        return this;
    }
}

module.exports = WhereClause;
// Compare this snippet from models/product.js:
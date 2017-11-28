let rp = require('request-promise');

exports.getAllStores = function() {
     var options = { 
        uri : 'https://frozen-forest-55617.herokuapp.com/store',
        json : true,
        headers: {
            'x-api-key': 'test'
        },
    };
    
    try{
        return rp(options)
            .then(function (results) {
                return results;
            });
    }
    catch(err) {
            console.error("Request Failed");
            return [{name:"Something went wrong..."}];
    }
}

exports.getStoresbyId = function(id) {
    var options = { 
        uri : 'https://frozen-forest-55617.herokuapp.com/store/' + id,
        json : true,
        headers: {
            'x-api-key': 'test'
        },
    };
    
    try{
        return rp(options)
            .then(function (results) {
                return results;
            });
    }
    catch(err) {
            console.error("Request Failed");
            return [{name:"Something went wrong..."}];
    }
}

exports.saveStore = function(store) {
    var options = { 
        method: 'POST',
        uri : 'https://frozen-forest-55617.herokuapp.com/store',
        json : true,
        headers: {
            'x-api-key': 'test',
            'Content-Type': 'application/json'
        },
        body:store
    };
    
    try{
        return rp(options)
            .then(function (results) {
                return results;
            });
    }
    catch(err) {
            console.error("Request Failed");
            return [{name:"Something went wrong..."}];
    }
}

exports.updateStore = function(item, storeId) {
    return exports.getStoresbyId(storeId).then( function(store) {
        item.reportDate = Date.now();
        if(store[0].items) store[0].items.push(item);
        else store[0].items = [item];
        
        var options = { 
            method: 'PUT',
            uri : 'https://frozen-forest-55617.herokuapp.com/store/' + storeId,
            json : true,
            headers: {
                'x-api-key': 'test',
                'Content-Type': 'application/json'
            },
            body:store[0]
        };
        
        try{
            return rp(options)
                .then(function (results) {
                    return results;
                });
        }
        catch(err) {
                console.error("Request Failed");
                return [{name:"Something went wrong..."}];
        }
    });
}

exports.itemSearch = function(search) {
    var options = { 
        uri : 'https://frozen-forest-55617.herokuapp.com/search/items' ,
        json : true,
        headers: {
            'x-api-key': 'test',
            'User-Agent': 'Request-Promise'
        },
        qs: {
            'itemName': search.name,
            'zip': search.zipcode,
            'city': search.city,
            'state': search.state,
            'radius': search.radius,
            'age' : search.age
        }
    };
    
    try{
        return rp(options)
            .then(function (results) {
                return exports.filterResults(results, search.name);
            });
    }
    catch(err) {
            console.error("Request Failed");
            return [{name:"Something went wrong..."}];
    }
}

exports.filterResults = function(results, search) {
    let res = [];
    for(var i = 0, len = results.length; i < len; i++)
    {
        for(var j = 0, l = results[i].items.length; j < l; j++)
        {
            if(results[i].items[j].name == search)
            {
                res.push({
                    name: results[i].name,
                    location: results[i].address + " " + results[i].zip,
                    quantity: results[i].items[j].quantity,
                    description: results[i].items[j].description
                });
            }
        }
    }
    return res;
}
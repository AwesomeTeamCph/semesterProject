'use strict';

var json2csv = require('json2csv');
var fields = ['filename', 'title', 'author', 'release_date', 'cities', 'language'];
var fs = require('fs');

var books = require('../testMaterial/books.json');
try {
  var result = json2csv({ data: books, fields: fields });
  fs.writeFile('file.csv', result, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
  console.log(result);
} catch (err) {
  // Errors are thrown for bad options, or if the data is empty and no fields are provided.
  // Be sure to provide fields if it is possible that your data array will be empty.
  console.error(err);
}
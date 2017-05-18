/**
 * Created by Rihards on 15/05/2017.
 */
const neo4j = require('neo4j-driver').v1;

//create a driver instance for the user neo4j
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "saksafons"));

//Register a callback to know if driver creation was successful
driver.onCompleted = () => {
    console.log("Connection to Neo4j is successful");
}

// Register a callback to know if driver creation failed.
driver.onError = () => {
    console.log('Driver instantiation failed', error);
}

//export the driver
exports.getDriver = function () {
        return driver.session();
};

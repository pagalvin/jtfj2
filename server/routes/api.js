const express = require('express');
const router = express.Router();
const config = require('../config/config.js');
const MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectID;

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

router.get('/status', (req, res) => {

    var cursor = db.collection('KnowledgeDomains').find();

    console.log(`api.js: /status: cursor:`, cursor);

    db.collection(`KnowledgeDomains`).find().toArray((err, results) => {
  
        console.log(`api.js: /status: KnowledgeDomains:`, results);
        res.status(200).json(
          {
            from: "api.js: status under node", 
            status: "alive!",
            details: {
              config: config,
              KnowledgeDomains: results
            }
          }
        );

    });

});

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('API Root. Nothing is done on this mount.');
});

router.get('/ping', (req, res) => {
    console.log(`api.js: /ping: is req authenticated?`, req.isAuthenticated());
    res.status(200).json({from: "api.js: ping under node", answer: "ping!"});
})

const getAllItems = (collectionName) => {
  
  return new Promise( 
    (resolve, reject) => {

      var cursor = db.collection(collectionName).find();

      db.collection(collectionName).find().toArray((err, results) => {

        console.log(`api.js: getAllItems: successfully executed a find().`);

        resolve(results);
      });
    }
  )

}


router.post('/pingpost', (req, res) => {
    res.status(200).json(
      {
        from: "api.js: pingpost under node", 
        answer: "pingpost!", 
        requestBody: req.body
      });
});

const insertNewItem = (collection, item) => {

  return new Promise( (resolve, reject) => {

    item.DateCreated = new Date();

    collection.insertOne(item).then( (data) => { resolve(data);});

  })

}

const deleteOneExistingItem = (collection, deleteWhich) => {

  console.log(`api.js: deleteOneExistingItem: Entering, deleteWhich:`, {which: deleteWhich});

  return new Promise((resolve, reject) => {

    // Tell the collection to delete just one item that matches the deleteWhich pattern.
    collection.remove(deleteWhich, true).then(
      (result) => {

        console.log(`api.js: deleteOneExistingItem: Entering, delete succeeded!.`)
        
        resolve(
          {
            from: `api.js: deleteOneExistingItem.`,
            summaryResult: "Successfully deleted item with UniqueID: [" + deleteWhich.UniqueID + "].",
            deleteWhich: deleteWhich,
            dbResult: result
          }
        );
      }
    );

  })
}

const saveExistingItem = (collection, updateWhich, itemToSave) => {

  console.log(`api.js: saveExistingItem: Entering, updating:`, {which: updateWhich, tosave: itemToSave});

  return new Promise((resolve, reject) => {

    collection.updateOne(updateWhich, itemToSave).then(
      (result) => {

        console.log(`api.js: saveExistingItem: Entering, update succeeded!.`)
        
        resolve(
          {
            from: `api.js: saveExistingItem.`,
            summaryResult: "Successfully updated item with UniqueID: [" + itemToSave.UniqueID + "].",
            itemSaved: itemToSave,
            dbResult: result
          }
        );
      }
    );

  })
}


function insertNewItemIntoCollection(collectionName, itemToInsert /* req.body */) {

  return new Promise(
  
    (resolve, reject) => {
  
      console.log(`api.js: insertNewItemIntoCollection: processing a request:`, itemToInsert);

      console.log(`api.js: insertNewItemIntoCollection: Awaiting insert new item.`);

      insertNewItem(db.collection(collectionName), itemToInsert).then(
        (insertResult) => {

          console.log(`api.js: insertNewItemIntoCollection: New item inserted, id:`, insertResult.ops[0]._id)

          itemToInsert.UniqueID = insertResult.ops[0]._id;

          saveExistingItem(db.collection(collectionName), { _id: itemToInsert.UniqueID }, itemToInsert).then(
            (updateResults) => {

              console.log(`api.js: /KnowledgeDomains/new: updated item with unique ID, result:`, updateResults)

              resolve(insertResult);
            }
          )

        })
    })

}


router.get('/KnowledgeDomainsOLD', (req, res) => {

  var cursor = db.collection('KnowledgeDomains').find();

  // console.log(`api.js: /KnowledgeDomains: cursor:`, cursor);

  getAllItems('KnowledgeDomains').then( 
    (allItems) => {

    console.log(`api.js: /KnowledgeDomains: KnowledgeDomains: successfully executed a find().`);

    res.status(200).json(
        {
          from: "api.js: /KnowledgeDomains under node",
          status: "Retrieved all Knowledge Domains from Mongo.",
          requestBody: req.body,
          dbResult: allItems,
          KnowledgeDomains: allItems
        }
      );
    }
  )
});

/*
router.post('/KnowledgeDomains/new', (req, res) => {

    console.log(`api.js: /KnowledgeDomains/new: Got a request:`, req.body);

    console.log(`api.js: /KnowledgeDomains/new: Awaiting insert new item.`);

    insertNewItem(db.collection('KnowledgeDomains'), req.body).then (
      (insertResult) => {

        console.log(`api.js: /KnowledgeDomains/new: New item inserted, id:`,insertResult.ops[0]._id)

        req.body.UniqueID = insertResult.ops[0]._id;

        console.log(`api.js: /KnowledgeDomains/new: About to save this item to update Unique ID.`);
        console.log(`api.js: /KnowledgeDomains/new: About to save this item, body:`, req.body);
        
        saveExistingItem(db.collection('KnowledgeDomains'), {_id: req.body.UniqueID}, req.body).then(
          (updateResults) => {

            console.log(`api.js: /KnowledgeDomains/new: updated item with unique ID, result:`,updateResults)
            
            res.status(200).json(insertResult);
          }
        ) 
      }
    )
});
*/

router.delete('/KnowledgeDomain/:kdID/deleteOLD', 
  (req, res) => {
    console.log(`api.js: /KnowledgeDomains/delete: Got a request params:`, req.params);

    const collection = db.collection('KnowledgeDomains');

    deleteOneExistingItem(collection, {_id: ObjectId(req.params.kdID)}).then( 
      (deleteResults) => {

        console.log(`api.js: /KnowledgeDomains/delete: successfully deleted the item, results:`, deleteResults);
        
        res.status(200).json(deleteResults);
      }
    )
  }
);



router.post('/KnowledgeDomain/:kdID/updateOLD', (req, res) => {

    console.log(`api.js: /KnowledgeDomains/new: Got a request params:`, req.params);

    const collection = db.collection('KnowledgeDomains');

    req.body.DateModified = new Date();

    console.log(`api.js: /KnowledgeDomains/new: Saving an item:`, req.body);

    saveExistingItem(collection, {_id: ObjectId(req.body.UniqueID)}, req.body).then(
      (result) => {

        console.log(`api.js: /KnowledgeDomains/new: Successfully saved an item:`, req.body);
        
        res.status(200).json(result);
      }
    )

});


// router.get('/Facts', (req, res) => {

//   var cursor = db.collection('Facts').find();

//   getAllItems('Facts').then( 
//     (allItems) => {

//     console.log(`api.js: /Facts: Facts: successfully executed a find().`);

//     res.status(200).json(
//         {
//           from: "api.js: /Facts under node",
//           status: "Retrieved all Facts from Mongo.",
//           requestBody: req.body,
//           dbResult: allItems,
//           KnowledgeDomains: allItems
//         }
//       );
//     }
//   )
// });

const getInsertNewItemMount = (mountName, collection) => {
  return () => {

    router.post(mountName, (req, res) => {
      console.log(`api.js: ${mountName}: Got a request and awaiting insert operation. req.body:`, req.body);

      insertNewItemIntoCollection(collection, req.body).then(
        (insertResult) => {
          console.log(`api.js: ${mountName}: Insert completed successfully, result:`, insertResult);
          res.status(200).json(insertResult);
        }
      );
    });
  }
}

const getAllItemsMount = (mountName, collectionName) => {

  return () => {

    router.get(mountName, (req, res) => { 

      var cursor = db.collection(collectionName).find();

      // console.log(`api.js: /KnowledgeDomains: cursor:`, cursor);

      getAllItems(collectionName).then(
        (allItems) => {

          console.log(`api.js: getAllItemsCount</${mountName}>: successfully executed a find().`);

          res.status(200).json(
            {
              from: `api.js: getAllItemsMount<${mountName}>: from node.`,
              status: "Retrieved all items from Mongo.",
              requestBody: req.body,
              dbResult: allItems,
              Items: allItems
            }
          );
        }
      )
    });
  }

}

const getUpdateItemMount = (mountName, collectionName) => {

  // '/KnowledgeDomain/:kdID/update'

  return () => {
    router.post(mountName, (req, res) => {

        const ll = `api.js: getUpdateItemMount<${mountName}>:`;

        console.log(`${ll} Got a request with params:`, req.params);

        const collection = db.collection(collectionName);

        req.body.DateModified = new Date();

        console.log(`${ll} Saving an item:`, req.body);

        saveExistingItem(collection, {_id: ObjectId(req.body.UniqueID)}, req.body).then(
          (result) => {

            console.log(`${ll} Successfully saved an item:`, req.body);
            
            res.status(200).json(result);
          }
        )

    });
  }

}

const getDeleteItemRoute = (mountName, collectionName) => {

  return () => {

    router.delete(mountName,
      (req, res) => {

        const ll = `api.js: getDeleteItemRoute<${mountName}: `;

        console.log(`${ll} Entering, will delete item with ID: ${req.params.ID}.`);

        const collection = db.collection(collectionName);

        deleteOneExistingItem(collection, { _id: ObjectId(req.params.ID) }).then(
          (deleteResults) => {

            console.log(`${ll} successfully deleted the item, results:`, deleteResults);

            res.status(200).json(deleteResults);
          }
        )
      }
    );

  }
}

const allCrudMounts = () => {
  const mountInstructions = [
    {
      baseMountName: 'KnowledgeDomain',
      dbCollectionName: 'KnowledgeDomains'
    },
    {
      baseMountName: 'Fact',
      dbCollectionName: 'Facts'
    },
    {
      baseMountName: 'QuizTemplate',
      dbCollectionName: 'QuizTemplates'
    },
    {
      baseMountName: 'QuizInstance',
      dbCollectionName: 'QuizInstances'
    }
  ];

  return mountInstructions;
}

allCrudMounts().forEach( (mountInstructions) => {

    console.log(`api.js: initializing CRUD mounts: /${mountInstructions.baseMountName}.`);
    getInsertNewItemMount(`/${mountInstructions.baseMountName}/new`,mountInstructions.dbCollectionName)();
    getAllItemsMount(`/${mountInstructions.baseMountName}s`, mountInstructions.dbCollectionName)(); // Pluralize base mount name on getAll
    getUpdateItemMount(`/${mountInstructions.baseMountName}/:id/update`, mountInstructions.dbCollectionName)();
    getDeleteItemRoute(`/${mountInstructions.baseMountName}/:ID/delete`, mountInstructions.dbCollectionName)();
    
})


const findItemByID = (collection, ID) => {
  return new Promise((resolve, reject) => {
    collection.findOne({ a: 1 }).then(
      (item) => {
        resolve(item);
      }
    );
  })
}

const updateItem = (collection, updateWhich, itemToUpdate) => {

  return new Promise( (resolve, reject) => {

    itemToUpdate.DateModified = new Date();

  // const updateResult = await saveExistingItem(collection, updateWhich, itemToUpdate);

  })

}

var db;

MongoClient.connect(config.mongoUrl,
    (err, database) => {

        if (err) {
            return console.log(err);
        }
        db = database;
    }
);

module.exports = router;

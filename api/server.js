const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    db('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(err => res.status(500).json({ errorMessage: 'error trying to get the requested data.' }))
});

server.get('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .first()
    .then(dbData => {
        dbData
        ?res.status(200).json({ data: dbData })
        :res.status(404).json({ message: 'Could not find that user.'})
    })
    .catch(err => res.status(500).json({ errorMessage: 'error trying to get requested account.'}))
});

server.post('/', (req, res) => {
    db('accounts')
    .insert(req.body)
    .then(ids => {
        const id = ids[0]
        db('accounts')
        .where({ id  })
        .first()
        .then(dbData => res.status(201).json({ dbData: dbData }))
        .catch(err => res.status(500).json({ errorMessage: 'error sending back response confirmation.' }))
    })
    .catch(err => res.status(500).json({ errorMessage: 'error trying to create account.' }))
});

server.put('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
        count > 0
        ?res.status(200).json({ message: 'Post successfuly updated.' })
        :res.status(404).json({ message: 'could not find that post to delete. '})
    })
    .catch(err => res.status(500).json({ message: 'error trying to delete that post.' }));
});

server.delete('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
        count > 0
        ?res.status(200).json({ message: 'Account successfuly deleted.' })
        :res.status(404).json({ message: 'could not find that account to delete. '})
    })
    .catch(err => res.status(500).json({ message: 'error trying to delete that account.' }));
});




module.exports = server;

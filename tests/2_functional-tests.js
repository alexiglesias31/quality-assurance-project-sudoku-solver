const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings')

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve valid puzzle string', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: puzzlesAndSolutions[0][0]
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'solution')
                assert.equal(res.body.solution, puzzlesAndSolutions[0][1])
                done()
            })
    })
    test('Missing puzzle string', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Required field missing')
                done()
            })
    })
    test('Puzzle with invalid characters', function(done) {
        let puzzleInvalidCharacters = puzzlesAndSolutions[0][0].slice(0,5) + 'a' + puzzlesAndSolutions[0][0].slice(6)
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: puzzleInvalidCharacters
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
    })
    test('Puzzle with invalid length', function(done) {
        let puzzleInvalidCharacters = puzzlesAndSolutions[0][0].slice(0,78)
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: puzzleInvalidCharacters
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
    })
    test('Puzzle that cannot be solved', function(done) {
        let puzzleInvalidCharacters = puzzlesAndSolutions[0][0].slice(0,5) + '1234' + puzzlesAndSolutions[0][0].slice(9)
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: puzzleInvalidCharacters
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Puzzle cannot be solved')
                done()
            })
    })

    test('Check placement all fields', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: '3'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, true)
                done()
            })
    })
    test('Check placement with single placement conflict', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: '9'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, false)
                assert.property(res.body, 'conflict')
                assert.equal(res.body.conflict, 'column')
                done()
            })
    })
    test('Check placement with multiple placement conflict', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'B2',
                value: '1'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, false)
                assert.property(res.body, 'conflict')
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 2)
                done()
            })
    })
    test('Check placement with all placement conflict', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'B1',
                value: '2'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, false)
                assert.property(res.body, 'conflict')
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 3)
                done()
            })
    })
    test('Check placement with all placement conflict', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                value: '2'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Required field(s) missing')
                done()
            })
    })
    test('Check placement with invalid character', function(done) {
        let puzzleInvalidCharacters = puzzlesAndSolutions[0][0].slice(0,5) + 'a' + puzzlesAndSolutions[0][0].slice(6)
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzleInvalidCharacters,
                coordinate: 'A2',
                value: '2'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
    })
    test('Check placement with invalid character', function(done) {
        let puzzleInvalidCharacters = puzzlesAndSolutions[0][0].slice(0,78)
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzleInvalidCharacters,
                coordinate: 'A2',
                value: '2'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
    })
    test('Check placement with invalid coordinate', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'Z2',
                value: '2'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid coordinate')
                done()
            })
    })
    test('Check placement with invalid value', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: 'R'
            })
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid value')
                done()
            })
    })
});


const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // this.timeout(5000);
  // #1   
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
         puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378','POST request to /api/solve should solve correctly');
        done();
      });
  });
  // #2   
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
         puzzle : ''
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing','POST request to /api/solve should with missing field should prompt error');
        done();
      });
  });
  // #3   
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle : '@.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle','POST request to /api/solve should with invalid character should prompt error');
        done();
      });
  });
  // #4
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle : '3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long','POST request to /api/solve should with incorrect length should prompt error');
        done();
      });
  });
  // #5
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle : '999..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved','POST request to /api/solve should with UNsolve-able puzzle should prompt error');
        done();
      });
  });
  // #6
  test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A1",
        value : "1"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true,'POST request to /api/check should return valid : true');
        done();
      });
  });
  // #7
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A2",
        value : "4"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false,'POST request to /api/check should be false');
        assert.equal(res.body.conflict.length, 1,'POST request to /api/check should 1 placement conflict');
        done();
      });
  });
  // #8
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A2",
        value : "5"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false,'POST request to /api/check should be false');
        assert.equal(res.body.conflict.length, 2,'POST request to /api/check should 2 placement conflict');
        done();
      });
  });
   // #9
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A2",
        value : "2"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false,'POST request to /api/check should be false');
        assert.equal(res.body.conflict.length, 3,'POST request to /api/check should 3 placement conflict');
        done();
      });
  });
   // #10
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        coordinate : "A2",
        value : "2"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing','POST request to /api/check should prompt error Required field(s) missing');
        done();
      });
  });
  // #11
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '@.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A2",
        value : "2"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle','POST request to /api/check should prompt error Invalid characters in puzzle');
        done();
      });
  });
  // #12
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '.8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A2",
        value : "2"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long','POST request to /api/check should prompt error Expected puzzle to be 81 characters long');
        done();
      });
  });
  // #13
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "A134",
        value : "2"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate','POST request to /api/check should prompt error Invalid coordinate');
        done();
      });
  });
  // #14
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle : '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate : "B4",
        value : "K"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value','POST request to /api/check should prompt error Invalid value');
        done();
      });
  });


  
});

